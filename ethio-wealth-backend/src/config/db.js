const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'mabook',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ethiowealth',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Auto-patch the schema for new features:
pool.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(12, 2) DEFAULT 0;`)
    .catch(err => console.log('Notice: Auto-migration log - ', err.message));

module.exports = pool;
