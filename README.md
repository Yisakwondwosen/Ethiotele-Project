Since we have pivoted the project name to **Santim Sentry** and integrated high-level features like **Fayda ID** and **telebirr** synchronization, your README needs to reflect that "Senior" strategic depth. A basic README says what the app *is*; a Senior README explains why it is *enterprise-ready* for Ethio Telecom.

Here is the updated, high-impact version for your repository.

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

```

### 2. Orchestration (Docker)

Run the entire stack (DB, Backend, Frontend) with one command:

```bash
docker-compose up --build

```

## 🛡 Strategic Design Decisions

1. **Identity as the New Currency**: By anchoring users to their **Fayda ID**, the system generates a "Trust Score," solving the credit-gap for unbanked users in Ethiopia.
2. **Privacy by Design**: We store only a **one-way salted hash** of the Fayda ID, ensuring user privacy while maintaining a unique, verifiable financial anchor.
3. **Database-First Integrity**: Treats the PostgreSQL ledger as the immutable source of truth, using row-level locking (`FOR UPDATE`) to prevent race conditions during concurrent transactions.

---

*Built by Yisehak Wondwossen (Isaac) for the Ethio Telecom  Software Engineer Evaluation.*
