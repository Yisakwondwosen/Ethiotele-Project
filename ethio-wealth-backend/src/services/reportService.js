const db = require('../config/db');

/**
 * Service to calculate a user's monthly spending breakdown by category.
 * We use NUMERIC in SQL and return as Strings to maintain precision.
 */
const getMonthlyBreakdown = async (userId, month, year) => {
    const query = `
        SELECT 
            c.name AS category_name,
            c.type,
            SUM(t.amount) AS total_amount,
            COUNT(t.id) AS transaction_count
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = $1 
          AND EXTRACT(MONTH FROM t.transaction_date) = $2
          AND EXTRACT(YEAR FROM t.transaction_date) = $3
        GROUP BY c.name, c.type
        ORDER BY total_amount DESC;
    `;

    try {
        const { rows } = await db.query(query, [userId, month, year]);

        // Calculate grand total for percentage calculations in Frontend
        const grandTotal = rows
            .filter(r => r.type === 'expense')
            .reduce((acc, curr) => acc + parseFloat(curr.total_amount), 0);

        return {
            breakdown: rows,
            totalExpense: grandTotal.toFixed(2),
            month,
            year
        };
    } catch (error) {
        console.error('Database Error in Report Service:', error);
        throw new Error('Could not retrieve monthly financial report.');
    }
};

module.exports = { getMonthlyBreakdown };
