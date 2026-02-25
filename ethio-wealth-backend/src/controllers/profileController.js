const pool = require('../config/db');

// Core Requirement: Create Profile (username only, no auth)
const createProfile = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).json({ error: "Username is required" });

        // Check if exists
        const exists = await pool.query('SELECT id, name, email, wallet_balance, "createdAt" FROM "user" WHERE name = $1', [username]);
        if (exists.rows.length > 0) {
            return res.json(exists.rows[0]); // Return existing profile
        }

        // Insert new anonymous profile 
        const dummyEmail = `${username.toLowerCase().replace(/\s+/g, '')}_${Date.now()}@guest.local`;

        const result = await pool.query(
            'INSERT INTO "user" (name, email) VALUES ($1, $2) RETURNING id, name, email, wallet_balance, "createdAt"',
            [username, dummyEmail]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Profile Create Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Core Requirement: Retrieve Profile (username only, no auth)
const getProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const result = await pool.query(
            'SELECT id, name, email, wallet_balance, "createdAt" FROM "user" WHERE name = $1 LIMIT 1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createProfile, getProfile };
