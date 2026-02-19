-- Better Auth Schema for Santim Sentry
-- Using "user" table as required by better-auth

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS "verification";
DROP TABLE IF EXISTS "account";
DROP TABLE IF EXISTS "session";
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS users; -- Drop old table

CREATE TABLE "user" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
    "role" text,
    "password" text, -- Added for standard JWT Auth
    "fayda_id" text
);

CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"createdAt" timestamp DEFAULT now(),
    "updatedAt" timestamp DEFAULT now(),
    "expiresAt" timestamp,
	"password" text
);

CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
    "createdAt" timestamp DEFAULT now(),
    "updatedAt" timestamp DEFAULT now()
);

-- Recreate transactions and categories linked to "user"
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('income', 'expense')) NOT NULL,
    icon_slug VARCHAR(50)
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text REFERENCES "user"("id") ON DELETE CASCADE, -- Linked to better-auth user
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    is_telebirr_sync BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_date DATE DEFAULT CURRENT_DATE
);

-- Seed Data
INSERT INTO categories (name, type, icon_slug) VALUES 
('Salary', 'income', 'FaMoneyBillWave'),
('Business', 'income', 'FaBriefcase'),
('Food & Drinks', 'expense', 'FaUtensils'),
('Groceries', 'expense', 'FaShoppingBag'),
('Transport', 'expense', 'FaBus'),
('Bills', 'expense', 'FaFileInvoiceDollar'),
('Health', 'expense', 'FaNotesMedical'),
('Entertainment', 'expense', 'FaFilm');
