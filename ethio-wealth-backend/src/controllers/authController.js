const pool = require('../config/db');
const bcrypt = require('bcryptjs');
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

        // Check if user exists (quote table name "user" since it's a reserved word)
        const userCheck = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await pool.query(
            'INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        const user = newUser.rows[0];

        // Generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', {
            expiresIn: '24h',
        });

        res.status(201).json({ user, token });
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
        const result = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check password
        if (!user.password) {
            // User might have signed up via Fayda/Social only
            return res.status(400).json({ error: 'Please sign in with your National ID (Fayda)' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', {
            expiresIn: '24h',
        });

        res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getMe = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await pool.query('SELECT id, name, email, fayda_id, role, "createdAt" FROM "user" WHERE id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional()
});

const updateMe = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, email, password } = updateSchema.parse(req.body);

        // Fetch current user
        const result = await pool.query('SELECT * FROM "user" WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const currentUser = result.rows[0];

        // Update fields if provided
        const updatedName = name || currentUser.name;
        const updatedEmail = email || currentUser.email;
        let updatedPassword = currentUser.password;

        if (password) {
            updatedPassword = await bcrypt.hash(password, 10);
        }

        const updateQuery = await pool.query(
            'UPDATE "user" SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email, fayda_id, role, "createdAt"',
            [updatedName, updatedEmail, updatedPassword, userId]
        );

        res.json(updateQuery.rows[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteMe = async (req, res) => {
    try {
        const userId = req.user.userId;

        // The foreign key ON DELETE CASCADE will handle transactions and notifications
        await pool.query('DELETE FROM "user" WHERE id = $1', [userId]);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.register = register;
exports.login = login;
exports.getMe = getMe;
exports.updateMe = updateMe;
exports.deleteMe = deleteMe;
