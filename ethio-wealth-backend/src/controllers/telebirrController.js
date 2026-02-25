const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { createNotification } = require('./notificationController');


const initiatePayment = async (req, res) => {
    try {
        const { amount, phoneNumber } = req.body;
        const userId = req.user.userId;

        if (!amount || !phoneNumber) {
            return res.status(400).json({ error: 'Amount and Phone Number required' });
        }

        console.log(`[Telebirr Mock] Initiating payment request for ${amount} ETB to ${phoneNumber}`);

        // 1. Simulate API Call Delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 4. Update internal wallet_balance (Self-Healing)
        try {
            await pool.query('UPDATE "user" SET wallet_balance = COALESCE(wallet_balance, 0) + $1 WHERE id = $2', [amount, userId]);
        } catch (e) {
            await pool.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(12, 2) DEFAULT 0;`);
            await pool.query('UPDATE "user" SET wallet_balance = COALESCE(wallet_balance, 0) + $1 WHERE id = $2', [amount, userId]);
        }

        // 5. Mock Success Response
        await createNotification(userId, `Telebirr Top-Up of ${amount} ETB successful.`, 'success');

        res.json({
            success: true,
            message: 'Payment Initiated Successfully',
            telebirr_ref: `TB-${uuidv4().substring(0, 8).toUpperCase()}`
        });

    } catch (error) {
        // Log to file for debugging
        const fs = require('fs');
        const logData = `[${new Date().toISOString()}] Telebirr Error: ${error.message}\nStack: ${error.stack}\n`;
        fs.appendFileSync('telebirr_error.log', logData);

        console.error("Telebirr Mock Error:", error);
        res.status(500).json({ error: 'Payment Initialization Failed' });
    }
};

const payForAi = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cost = 50.00;

        let userRes;
        try {
            userRes = await pool.query('SELECT wallet_balance FROM "user" WHERE id = $1', [userId]);
        } catch (e) {
            await pool.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(12, 2) DEFAULT 0;`);
            userRes = await pool.query('SELECT wallet_balance FROM "user" WHERE id = $1', [userId]);
        }
        if (userRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });

        const currentBalance = parseFloat(userRes.rows[0].wallet_balance || 0);
        if (currentBalance < cost) {
            return res.status(400).json({ error: 'Insufficient wallet balance. Please top up via Telebirr.' });
        }

        // Deduct
        await pool.query('UPDATE "user" SET wallet_balance = wallet_balance - $1 WHERE id = $2', [cost, userId]);

        await createNotification(userId, `50 ETB deducted for AI Insights Pro Unlock.`, 'info');

        res.json({ success: true, message: 'Payment successful', remainingBalance: currentBalance - cost });
    } catch (error) {
        console.error("AI Payment Error:", error);
        res.status(500).json({ error: 'Failed to process AI payment' });
    }
};

module.exports = { initiatePayment, payForAi };
