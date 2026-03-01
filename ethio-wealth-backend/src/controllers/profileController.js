const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// Core Requirement: Create Profile (username only, no auth)
const createProfile = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).json({ error: "Username is required" });

        // Self-Healing Migration: Ensure wallet_balance column exists
        try {
            await pool.query('SELECT wallet_balance FROM "user" LIMIT 1');
        } catch (e) {
            await pool.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(12, 2) DEFAULT 0;`);
        }

        // Check if exists
        const exists = await pool.query('SELECT id, name, email, wallet_balance, "createdAt" FROM "user" WHERE name = $1', [username]);
        if (exists.rows.length > 0) {
            const user = exists.rows[0];
            const token = jwt.sign({ userId: user.id, isGuest: true }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '7d' });
            return res.json({ ...user, token }); // Return existing profile with token
        }

        // Insert new anonymous profile 
        const dummyEmail = `${username.toLowerCase().replace(/\s+/g, '')}_${Date.now()}@guest.local`;

        const result = await pool.query(
            'INSERT INTO "user" (name, email) VALUES ($1, $2) RETURNING id, name, email, wallet_balance, "createdAt"',
            [username, dummyEmail]
        );

        const newUser = result.rows[0];
        const token = jwt.sign({ userId: newUser.id, isGuest: true }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '7d' });

        res.status(201).json({ ...newUser, token });
    } catch (err) {
        console.error("Profile Create Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Core Requirement: Retrieve Profile (username only, no auth)
const getProfile = async (req, res) => {
    try {
        const { username } = req.params;

        // Self-Healing Migration: Ensure wallet_balance column exists
        try {
            await pool.query('SELECT wallet_balance FROM "user" LIMIT 1');
        } catch (e) {
            await pool.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(12, 2) DEFAULT 0;`);
        }
        const result = await pool.query(
            'SELECT id, name, email, wallet_balance, "createdAt" FROM "user" WHERE name = $1 LIMIT 1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }

        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id, isGuest: true }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '7d' });

        res.json({ ...user, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createProfile, getProfile };
