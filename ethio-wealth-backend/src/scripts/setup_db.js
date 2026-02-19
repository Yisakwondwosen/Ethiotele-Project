const { Client } = require('pg');
require('dotenv').config();

const setupDatabase = async () => {
    // 1. Connect to default 'postgres' database to check/create 'ethiowealth'
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: 'postgres', // Connect to default DB first
        password: process.env.DB_PASSWORD || 'postgres',
        port: process.env.DB_PORT || 5432,
    });

    try {
        await client.connect();

        // Check if database exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'ethiowealth'");

        if (res.rows.length === 0) {
            console.log("Database 'ethiowealth' does not exist. Creating...");
            await client.query('CREATE DATABASE ethiowealth');
            console.log("Database 'ethiowealth' created successfully!");
        } else {
            console.log("Database 'ethiowealth' already exists.");
        }

    } catch (err) {
        console.error("Error setting up database:", err);
    } finally {
        await client.end();
    }

    // 2. Now connect to 'ethiowealth' and apply schema
    const ethiowealthClient = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: 'ethiowealth',
        password: process.env.DB_PASSWORD || 'postgres',
        port: process.env.DB_PORT || 5432,
    });

    try {
        await ethiowealthClient.connect();
        console.log("Connected to 'ethiowealth'. Applying schema...");

        const fs = require('fs');
        const path = require('path');
        const schemaPath = path.join(__dirname, '../../schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        await ethiowealthClient.query(schema);
        console.log("Schema applied successfully!");

    } catch (err) {
        console.error("Error applying schema:", err);
    } finally {
        await ethiowealthClient.end();
    }
};

setupDatabase();
