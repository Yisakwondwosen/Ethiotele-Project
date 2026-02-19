const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

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

        // 2. Find a valid Income Category (e.g. 'Business' or 'Salary')
        // We need a category ID because transactions must have one to determine type via join
        const categoryResult = await pool.query("SELECT id FROM categories WHERE type = 'income' LIMIT 1");
        const categoryId = categoryResult.rows.length > 0 ? categoryResult.rows[0].id : null;

        if (!categoryId) {
            // Fallback: Create a 'Telebirr Top-Up' category if none exists? 
            // Or just error out. For now, assume seed data exists.
            console.warn("No income category found for Telebirr deposit.");
        }

        // 3. Create "Pending" Transaction
        // Removed 'type' column as it doesn't exist in transactions table
        const description = `Telebirr Top-Up (${phoneNumber})`;
        const transactionResult = await pool.query(
            'INSERT INTO transactions (user_id, amount, category_id, description, transaction_date, is_telebirr_sync) VALUES ($1, $2, $3, $4, NOW(), true) RETURNING *',
            [userId, amount, categoryId, description]
        );

        // 4. Mock Success Response
        res.json({
            success: true,
            message: 'Payment Initiated Successfully',
            transaction: transactionResult.rows[0],
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

module.exports = { initiatePayment };
