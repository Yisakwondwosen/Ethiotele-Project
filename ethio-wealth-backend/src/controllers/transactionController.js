const pool = require('../config/db');
const { z } = require('zod');
const { createNotification } = require('./notificationController'); // Import notification helper


// Validation Schema using Zod (FR-02, FR-04)
const transactionSchema = z.object({
    amount: z.number().positive(),
    description: z.string().optional(),
    categoryId: z.number().int().positive(),
    isTelebirr: z.boolean().optional(),
});

const getTransactions = async (req, res) => {
    try {
        const userId = req.user.userId; // Matches JWT payload from authController
        // JOIN with categories to get type and name
        const result = await pool.query(
            `SELECT t.*, c.name as category, c.type as type, c.icon_slug as icon 
             FROM transactions t 
             JOIN categories c ON t.category_id = c.id 
             WHERE t.user_id = $1 
             ORDER BY t.transaction_date DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createTransaction = async (req, res) => {
    try {
        // Validation
        const validatedData = transactionSchema.parse(req.body);
        const userId = req.user.userId;

        const { amount, description, categoryId, isTelebirr } = validatedData;

        const result = await pool.query(
            `INSERT INTO transactions (user_id, category_id, amount, description, is_telebirr_sync)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [userId, categoryId, amount, description, isTelebirr || false]
        );

        // We could join here to return full category info, but for now just return the transaction
        // The frontend optimistic update handles the UI immediate feedback

        // Notify user
        await createNotification(userId, `New transaction of ${amount} ETB added.`, 'success');

        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ errors: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = transactionSchema.parse(req.body);
        const userId = req.user.userId;
        const { amount, description, categoryId, isTelebirr } = validatedData;

        const result = await pool.query(
            `UPDATE transactions 
             SET amount = $1, description = $2, category_id = $3, is_telebirr_sync = $4
             WHERE id = $5 AND user_id = $6
             RETURNING *`,
            [amount, description, categoryId, isTelebirr || false, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found or unauthorized' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ errors: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const result = await pool.query(
            'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found or unauthorized' });
        }

        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSummary = async (req, res) => {
    try {
        const userId = req.user.userId;

        // 1. Get Aggregated totals
        const totalsResult = await pool.query(
            `SELECT 
                COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
                COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expense
             FROM transactions t
             JOIN categories c ON t.category_id = c.id
             WHERE t.user_id = $1`,
            [userId]
        );

        const totals = totalsResult.rows[0];
        const totalIncome = parseFloat(totals.total_income);
        const totalExpense = parseFloat(totals.total_expense);
        const currentBalance = totalIncome - totalExpense;

        // 2. Get Categorization
        const categoryResult = await pool.query(
            `SELECT c.name as category, c.type, SUM(t.amount) as total
             FROM transactions t
             JOIN categories c ON t.category_id = c.id
             WHERE t.user_id = $1
             GROUP BY c.id, c.name, c.type
             ORDER BY total DESC`,
            [userId]
        );

        res.json({
            totalIncome,
            totalExpense,
            currentBalance,
            categorization: categoryResult.rows.map(row => ({
                category: row.category,
                type: row.type,
                total: parseFloat(row.total)
            }))
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getTransactions,
    createTransaction,
    getCategories,
    updateTransaction,
    deleteTransaction,
    getSummary
};
