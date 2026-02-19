const { betterAuth } = require("better-auth");
const { drizzleAdapter } = require("better-auth/adapters/drizzle");
const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const { pgTable, text, timestamp, boolean } = require("drizzle-orm/pg-core");
const { fayda } = require("fayda"); // Import Fayda plugin
require("dotenv").config();

// Define Schema for Better-Auth (Must match DB tables)
const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    fayda_id: text("fayda_id")
});

const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull().references(() => user.id)
});

const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull().references(() => user.id),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    password: text("password")
});

const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull()
});

const pool = new Pool({
    user: process.env.DB_USER || 'mabook',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ethiowealth',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

const db = drizzle(pool);

// Clean Private Key (Handle Base64URL and wrapping)
const rawKey = process.env.PRIVATE_KEY || "";
console.log("Raw Key Length:", rawKey.length);

const cleanKey = rawKey
    .replace(/[\n\r\s]/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');

console.log("Clean Key Length:", cleanKey.length);

// Initialize Fayda Plugin Safely
// Initialize Fayda Plugin Safely
let faydaPlugin = null;
try {
    faydaPlugin = fayda({
        clientId: process.env.CLIENT_ID,
        privateKey: cleanKey,
        redirectUrl: 'http://localhost:3000/api/auth/callback/fayda'
    });
    console.log("Fayda Plugin Initialized Successfully");
} catch (e) {
    console.error("CRITICAL: Fayda Plugin Init Failed:", e.message);
}

const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000",
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: { user, session, account, verification }
    }),
    emailAndPassword: {
        enabled: true
    },
    plugins: faydaPlugin ? [faydaPlugin] : []
});

module.exports = { auth };
