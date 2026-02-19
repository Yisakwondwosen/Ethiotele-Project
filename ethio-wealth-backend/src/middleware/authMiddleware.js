const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Require db pool

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

        // Check if user still exists in DB
        const userCheck = await pool.query('SELECT id FROM "user" WHERE id = $1', [decoded.userId]);
        if (userCheck.rows.length === 0) {
            return res.status(401).json({ error: 'User no longer exists. Please login again.' });
        }

        req.user = decoded;
        next();
    } catch (ex) {
        console.error("Auth Error:", ex.message);
        res.status(400).json({ error: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
