const fs = require('fs');

const tp = './src/controllers/transactionController.js';
let tC = fs.readFileSync(tp, 'utf8');

const summaryMethod = `
const getSummary = async (req, res) => {
    try {
        const userId = req.user.userId;

        // 1. Get Aggregated totals
        const totalsResult = await pool.query(
            \`SELECT 
                COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
                COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expense
             FROM transactions t
             JOIN categories c ON t.category_id = c.id
             WHERE t.user_id = $1\`,
            [userId]
        );

        const totals = totalsResult.rows[0];
        const totalIncome = parseFloat(totals.total_income);
        const totalExpense = parseFloat(totals.total_expense);
        const currentBalance = totalIncome - totalExpense;

        // 2. Get Categorization
        const categoryResult = await pool.query(
            \`SELECT c.name as category, c.type, SUM(t.amount) as total
             FROM transactions t
             JOIN categories c ON t.category_id = c.id
             WHERE t.user_id = $1
             GROUP BY c.id, c.name, c.type
             ORDER BY total DESC\`,
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
`;

tC = tC.replace('module.exports = {', summaryMethod + '\nmodule.exports = {\n    getSummary,');
fs.writeFileSync(tp, tC);

const tr = './src/routes/transactionRoutes.js';
let tR = fs.readFileSync(tr, 'utf8');
tR = tR.replace("router.get('/', transactionController.getTransactions);", "router.get('/summary', transactionController.getSummary);\nrouter.get('/', transactionController.getTransactions);");
fs.writeFileSync(tr, tR);

console.log("Updated backend with summary endpoints.");
