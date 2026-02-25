
---

# 🛡️ Santim Sentry (ሳንቲም ሴንትሪ)

**Strategic Fintech Pilot for the Ethio Telecom TechCo Transition (2026)**

This repository implements **Santim Sentry**, a high-integrity financial ledger designed as a modular value-added service (VAS) for the **telebirr** ecosystem. It is built to meet the **National Bank of Ethiopia (NBE)** digital payment directives and the **National ID (Fayda)** integration standards.

## 🚀 Key Differentiators (Senior Implementation)

* **Fayda ID Anchored e-KYC**: Implements **OIDC with PKCE** via `better-auth` and the `fayda` provider to anchor financial identities to verified national records.
* **Financial Integrity**: Utilizes PostgreSQL `NUMERIC(15, 2)` to eliminate floating-point errors and implements a **Service Layer Pattern** for complex financial logic.
* **Digital Equb Module**: A unique feature allowing for verified, legally traceable informal savings groups—bridging traditional habits with digital banking.
* **Enterprise Observability**: Production-ready monitoring using **Sentry.io** for real-time error tracking and performance profiling.
* **Telebirr Interoperability**: Simulated sync module designed to handle telebirr transaction IDs for automated reconciliation.

## 🛠 Tech Stack

* **Backend**: Node.js (Express), PostgreSQL, Drizzle ORM.
* **Frontend**: React (Vite), Tailwind CSS, `better-auth/react`.
* **Identity**: Fayda National ID (MOSIP/eSignet compliant).
* **Monitoring**: Sentry.io.

## 📂 Project Structure

```text
ethio_wealth/
├── ethio-wealth-backend/   # Node.js Ledger API
│   ├── src/
│   │   ├── auth.js         # Better-Auth & Fayda Configuration
│   │   ├── controllers/    # Request Handlers (Fayda, Telebirr, Auth)
│   │   ├── services/       # Core Logic (Interest, Equb, Reports)
│   │   └── middleware/     # IdentityGuard & Zod Validation
├── ethio-wealth-frontend/  # React Application
│   ├── src/
│   │   ├── components/     # VerifiedSignIn, WalletView, IdentityHub
│   │   ├── lib/            # Auth-Client Setup
│   │   └── pages/          # Dashboard (Trust Score Visualization)
└── docker-compose.yml      # Orchestration for Production Scaling

```

## 🏗 Setup & Run

### 1. Identity Configuration

Create an `.env` in `ethio-wealth-backend/` and provide your Fayda credentials:

```env
CLIENT_ID=your_fayda_client_id
PRIVATE_KEY=your_fayda_private_rsa_key

## 🐳 Docker Setup

To run the entire stack using Docker:

1.  Make sure you have Docker and Docker Compose installed.
2.  Run the following command in the root directory:

```bash
docker-compose up --build
```

This will start the backend, frontend, and database services.
- Backend: http://localhost:3000
- Frontend: http://localhost:80
- Database: localhost:5432

**Note:** If you encounter `Exec format error` or similar issues, try `docker-compose down -v` and rebuild with `docker-compose up --build` to ensure clean node_modules installation inside the container.

### 2. Local Backend
```bash
cd ethio-wealth-backend
npm install
npm start
```

### 3. Orchestration (Docker)

Run the entire stack (DB, Backend, Frontend) with one command:

```bash
docker-compose up --build
```

## 📐 Database Schema Description

The system uses a robust relational PostgreSQL database with constraints ensuring financial integrity. 

**Tables:**
* **`user`**: Stores both authenticated users (Fayda/JWT) and strictly anonymous users (`POST /api/profile`). 
  * *Columns: `id`, `name` (Username), `email`, `emailVerified`, `password` (hashed), `wallet_balance` (Telebirr Mock).*
* **`categories`**: Hardcoded seed definitions classifying transactions into fundamental types.
  * *Columns: `id`, `name`, `type` (Enum: `income`, `expense`), `icon_slug`.*
* **`transactions`**: The core immutable financial ledger holding all user actions.
  * *Columns: `id`, `user_id` (FK), `amount` (DECIMAL), `category_id` (FK), `description`, `is_telebirr_sync`.*
* **`notifications`**: Real-time push notification cache.

## 📡 API Documentation

### Profiles (Core MVP Requirements)
* **`POST /api/profile`** - Create a profile utilizing ONLY a username. No Auth. 
  * `Payload: { "username": "abebe" }`
  * `Response: { "id": "uuid", "name": "abebe", "email": "...", "wallet_balance": 0 }`
* **`GET /api/profile/:username`** - Retrieve profile by string match. No Auth.

### Transactions
* **`GET /api/transactions`** - Retrieve all transactions for the user. (Auth required)
* **`POST /api/transactions`** - Create ledger entry. (Auth required)
  * `Payload: { "amount": 100, "categoryId": 1, "description": "Salary" }`
* **`PUT /api/transactions/:id`** - Update entry (Amount/Desc/Cat).
* **`DELETE /api/transactions/:id`** - Soft/Hard delete financial entry.

### Aggregations
* **`GET /api/transactions/summary`** - Master summary endpoint returning `totalIncome`, `totalExpense`, `currentBalance`, `walletBalance` and aggregated array arrays of categorical allocations and 6-month trends.

## 🛡 Strategic Design Decisions

1. **Strict Core Separation**: API logic is cleanly separated internally via the MVC pattern (`controllers` isolated from `routes`).
2. **Identity as the New Currency**: By anchoring users to their **Fayda ID**, the system generates a "Trust Score," solving the credit-gap for unbanked users in Ethiopia.
3. **Privacy by Design**: We store only a **one-way salted hash** of the Fayda ID, ensuring user privacy.
4. **Database-First Integrity**: Treats the PostgreSQL ledger as the immutable source of truth, using `DECIMAL(12,2)` constraints across `wallet_balance` and `transactions` to prevent float precision rounding destruction.

---

*Built by Yisehak Wondwossen (Isaac) for the Ethio Telecom Software Engineer Evaluation.*
