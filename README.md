# Ethio-Wealth: Personal Finance Manager

**This is a submission for the Senior Software Engineer (TechCo) role at Ethio Telecom.**

This repository contains the Product Requirement Document (PRD) implementation for the "Ethio-Wealth" personal finance tracker. It is designed as a modular, scalable, and secure pilot module potentially for integration with **telebirr**.

## 🚀 Features

- **Secure Authentication**: JWT-based auth with `bcrypt` hashing.
- **Financial Precision**: Uses `NUMERIC(15, 2)` in PostgreSQL to avoid floating-point errors.
- **Validation**: Strict input validation using `Zod` on the backend.
- **Interactive Dashboard**: React + Chart.js for real-time reporting.
- **Ethio Telecom Branding**: Custom Tailwind configuration matching corporate colors.

## 🛠 Tech Stack

- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: React (Vite), Tailwind CSS, Chart.js
- **Database**: PostgreSQL with UUIDs

## 📂 Project Structure

```
ethio-wealth/
├── ethio-wealth-backend/   # Node.js API
│   ├── src/
│   │   ├── config/         # DB Connection
│   │   ├── controllers/    # Request Handlers
│   │   ├── middleware/     # Auth & Validation
│   │   ├── services/       # Business Logic (Report Generation)
│   │   └── app.js          # Entry Point
│   └── schema.sql          # SQL Migrations
├── ethio-wealth-frontend/  # React App
│   ├── src/
│   │   ├── components/     # Reusable UI
│   │   ├── context/        # State Management
│   │   ├── pages/          # Views (Dashboard, Login)
│   │   └── services/       # API Integration
└── README.md
```

## 🏗 Setup & Run

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### 1. Database Setup
Run the SQL commands in `ethio-wealth-backend/schema.sql` to initialize your PostgreSQL database.

### 2. Backend
```bash
cd ethio-wealth-backend
npm install
# Create a .env file based on .env.example (if provided) or defaults
npm start
```

### 3. Frontend
```bash
cd ethio-wealth-frontend
npm install
npm run dev
```

## 🛡 Security & Design Decisions

1.  **Service Layer Pattern**: Business logic (like report generation) is separated from Controllers to ensure testability and reusability.
2.  **Concurrency Control**: The database is treated as the source of truth. Future improvements (e.g., wallet transfers) would use `SELECT ... FOR UPDATE`.
3.  **Validation**: Implemented specific Zod schemas to reject invalid financial data before it hits the database.

---
*Built with ❤️ for Ethio Telecom.*
