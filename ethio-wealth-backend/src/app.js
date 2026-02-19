const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Suggested for security
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes (Placeholders for now)
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Ethio-Wealth API is running' });
});

// Import services for demonstration (normally would be in controllers)
const reportService = require('./services/reportService');

app.get('/api/reports/monthly', async (req, res) => {
    // Mock user ID and params for now until auth is fully wired
    const { userId, month, year } = req.query;
    if (!userId || !month || !year) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }
    try {
        const report = await reportService.getMonthlyBreakdown(userId, month, year);
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Ethio-Wealth Backend running on port ${port}`);
    });
}

module.exports = app;
