const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'mabook',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ethiowealth',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

const migrate = async () => {
    try {
        const schemaPath = path.join(__dirname, '../schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        console.log('Running migration...');
        await pool.query(schemaSql);
        console.log('Migration successful');
    } catch (err) {
        console.error('Migration failed', err);
    } finally {
        await pool.end();
    }
};

migrate();
