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
    origin: ["http://localhost:5173", "http://localhost", "https://yisehak.duckdns.org"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Routes (Placeholders for now)
const authRoutes = require('./routes/authRoutes');
const faydaRoutes = require('./routes/faydaRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authMiddleware = require('./middleware/authMiddleware');

// Auto-run migration
try {
    require('../scripts/migrate');
} catch (e) {
    console.error("Migration skipped or failed:", e.message);
}

// Resilient API Router to handle Nginx Trailing Slashes and Stripping
const apiRouter = express.Router();

apiRouter.use('/profile', require('./routes/profileRoutes')); // Anonymous profile endpoint
apiRouter.use('/auth', authRoutes);
apiRouter.use('/auth', faydaRoutes); // Mount Fayda OIDC at root auth path
apiRouter.use('/telebirr', require('./routes/telebirrRoutes')); // Mount Telebirr Mock
apiRouter.use('/transactions', transactionRoutes);
apiRouter.use('/notifications', authMiddleware, notificationRoutes);

const reportService = require('./services/reportService');
apiRouter.get('/reports/monthly', async (req, res) => {
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

app.use('/api', apiRouter);
// Fallback if Nginx strips `/api` completely
app.use('/', apiRouter);

app.get('/callback', require('./controllers/faydaController').callback); // Root Callback for Fayda

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Ethio-Wealth API is running' });
});

// Start Server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Ethio-Wealth Backend running on port ${port}`);
    });
}

module.exports = app;
