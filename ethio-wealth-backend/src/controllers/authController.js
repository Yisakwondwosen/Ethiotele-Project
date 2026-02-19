const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

const register = async (req, res) => {
    try {
        const { name, email, password } = registerSchema.parse(req.body);

        // Check if user exists
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await pool.query(
            'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email',
            [name, email, hashedPassword]
        );

        const user = newUser.rows[0];

        // Generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', {
            expiresIn: '1h',
        });

        res.status(201).json({ user: { ...user, name: user.full_name }, token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        // Find user
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', {
            expiresIn: '24h',
        });

        res.json({ user: { id: user.id, name: user.full_name, email: user.email }, token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.register = register;
exports.login = login;
