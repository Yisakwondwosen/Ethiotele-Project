# Santim Sentry: Technical Pitch & Code Overview

## 1. Executive Summary
**Santim Sentry** is Ethiopia's first **Fayda-Verified Wealth Management Platform**. It solves the problem of decentralized personal finance by providing a secure, centralized dashboard for tracking expenses, analyzing spending habits, and managing digital wallet funds via Telebirr.

**Core Value Proposition:**
- **Verified Trust:** Uses National ID (Fayda) for identity verification.
- **Local Context:** Full Amharic/English support and Telebirr integration.
- **Financial Health:** Visual analytics to empower better financial decisions.

---

## 2. Technology Stack

We built Santim Sentry using a modern, scalable, and secure stack designed for performance and reliability.

### **Frontend (Client-Side)**
- **Framework:** **React (Vite)** – Chosen for lightning-fast build times and component-based architecture.
- **Styling:** **Tailwind CSS** – Enables rapid UI development with a custom "Santim" design system (Brand Colors: Purple, Orange, Dark).
- **Visualization:** **Chart.js** & **React-Chartjs-2** – Renders interactive financial trends and breakdown charts.
- **Localization:** **i18next** – Provides seamless switching between English and Amharic.
- **State Management:** **React Context API** – Manages Authentication state and User preferences globally.
- **Routing:** **React Router v6** – Handles client-side navigation (Dashboard, Wallet, Analytics).

### **Backend (Server-Side)**
- **Runtime:** **Node.js** & **Express** – A robust REST API handling business logic.
- **Database:** **PostgreSQL** – A relational database ensuring data integrity for transactions and user accounts.
- **Security:**
  - **JWT (JSON Web Tokens):** Stateless authentication for secure API access.
  - **Bcrypt:** Industry-standard password hashing.
  - **Fayda ID Mock:** Simulates biometric verification flows for compliance.
- **Payments:** **Telebirr Mock Controller** – specific controller to simulate mobile money top-ups and status callbacks.

### **DevOps & Infrastructure**
- **Docker:** Fully containerized application (Frontend + Backend + Database) for consistent deployment.
- **Nginx:** High-performance web server serving the frontend and reverse-proxying API requests.
- **Docker Compose:** Orchestrates the multi-container environment with a single command.

---

## 3. Key Technical Features

### **A. Real-Time Dashboard**
- **Dynamic Charts:** The dashboard aggregates transaction data to show monthly trends (Income vs. Expense) and category breakdowns.
- **Optimistic UI:** Expenses are added to the list instantly while backend processing happens in the background.

### **B. Telebirr Wallet Integration**
- **Mock Payment Gateway:** We implemented a custom `telebirrController.js` that simulates the real-world latency and response structure of the Telebirr API.
- **Transaction Sync:** Funds added via the "Top Up" modal are instantly reflected in the user's Total Balance.

### **C. Security First Architecture**
- **Middleware Protection:** Custom `authMiddleware.js` verifies every API request against the database to ensure the user session is active and valid.
- **SQL Injection Prevention:** All database queries use parameterized inputs via the `pg` library.

---

## 4. Code Structure Overview

```
ethio_wealth/
├── ethio-wealth-frontend/      # React Application
│   ├── src/
│   │   ├── components/         # Reusable UI (WalletView, Charts, Modals)
│   │   ├── pages/              # Route Views (Dashboard, Landing, Login)
│   │   ├── context/            # AuthContext (Global State)
│   │   └── services/           # API Connectors (Axios)
│   └── Dockerfile              # Nginx Production Build
│
├── ethio-wealth-backend/       # Node.js API
│   ├── src/
│   │   ├── controllers/        # Business Logic (Transactions, Auth, Telebirr)
│   │   ├── routes/             # API Endpoints definition
│   │   ├── middleware/         # Security & Auth Checks
│   │   └── config/             # DB Connection Config
│   ├── schema.sql              # Database Design & Seeds
│   └── Dockerfile              # Node.js Server Build
│
└── docker-compose.yml          # Orchestration Config
```

---

## 5. Conclusion
Santim Sentry is not just a tracker; it's a **secure financial ecosystem**. By leveraging cutting-edge web technologies and integrating with local Ethiopian infrastructure (Telebirr, Fayda), we provide a solution that is both globally competitive and locally relevant.

**Ready for Deployment.** 🚀🇪🇹
