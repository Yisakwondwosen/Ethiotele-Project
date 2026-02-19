const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Suggested for security
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
// Middleware
app.use(helmet());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Routes (Placeholders for now)
const authRoutes = require('./routes/authRoutes');
const faydaRoutes = require('./routes/faydaRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Auto-run migration
try {
    require('../scripts/migrate');
} catch (e) {
    console.error("Migration skipped or failed:", e.message);
}

// Routes
// Mount Legacy Routes FIRST to prevent Better-Auth from swallowing them
app.use('/api/auth', authRoutes);
app.use('/api/auth', faydaRoutes); // Mount Fayda OIDC at root auth path
app.get('/callback', require('./controllers/faydaController').callback); // Root Callback for Fayda
app.use('/api/telebirr', require('./routes/telebirrRoutes')); // Mount Telebirr Mock
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
