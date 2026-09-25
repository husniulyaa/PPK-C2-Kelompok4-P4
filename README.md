# Student Expense Tracker 🎓💰

A production-ready full-stack web application designed for university students to track, manage, and optimize their daily finances, allowances, and campus living expenses. Built for university software engineering practical assignments with clean architecture, strict data isolation, and modern SaaS design.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes & Server Actions, Prisma ORM
- **Database**: PostgreSQL (Fully compatible with Neon Cloud Database)
- **Authentication**: JWT-based session tokens with secure HTTP-only cookies
- **Security & Authorization**: Strict user-level data isolation (User A cannot view/edit/delete User B data)
- **State & Preferences**: Persistent dark/light theme preference via cookies

---

## 👥 GitHub Collaboration & Team User Story Distribution

The project follows a standard GitHub feature-branch collaboration workflow divided into 4 developer branches:

| Developer | Feature Branch | User Stories | Scope of Work |
| :--- | :--- | :--- | :--- |
| **Lintang** | `feature/lintang-authentication` | **US-01, US-02, US-03** | User Registration with Neon DB, Email/Password JWT Login, HTTP-only Cookie Session & Middleware Route Protection |
| **Hana** | `feature/hana-dashboard-transaction` | **US-04, US-05, US-06** | Financial Dashboard Overview Cards, Add Income Transactions, Add Expense Transactions & Live Balance Computation |
| **Nabkay** | `feature/nabkay-management` | **US-07, US-08, US-09** | User Transaction History Table, Edit Transaction Modal & Backend Update, Delete Transaction with Confirmation Modal |
| **Sela** | `feature/sela-filter-preference` | **US-10, US-11, US-12** | Transaction Filtering (All/Income/Expense), Saved Dark/Light Mode Theme Preference via Cookies, Secure Logout Session Destruction |

---

## 🛠️ Installation & Setup Guide

### 1. Clone or Extract Project
```bash
cd student-expense-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` with your Neon PostgreSQL connection string and secret:
```env
DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
NODE_ENV="development"
```

### 4. Database Initialization (Prisma & Neon)
Generate the Prisma Client and push schema to Neon PostgreSQL:
```bash
npx prisma generate
npx prisma db push
```

*(Optional) Seed sample student transactions:*
```bash
npm run prisma:seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌿 Git Branch & Merge Workflow

To simulate or inspect the team collaboration workflow:

### 1. Switch between developer feature branches:
```bash
# Lintang's authentication branch
git checkout feature/lintang-authentication

# Hana's dashboard and transaction creation branch
git checkout feature/hana-dashboard-transaction

# Nabkay's transaction management branch
git checkout feature/nabkay-management

# Sela's filtering and preferences branch
git checkout feature/sela-filter-preference
```

### 2. Merge feature branch into main:
```bash
# Switch to main branch
git checkout main

# Merge feature branch
git merge feature/lintang-authentication
git merge feature/hana-dashboard-transaction
git merge feature/nabkay-management
git merge feature/sela-filter-preference
```

---

## 🧪 Acceptance Criteria Checklist

### Lintang (selesai)
- [x] **US-01**: Registration form with validation (name, email, password min 6 chars) and Neon DB storage.
- [x] **US-02**: Email/password authentication, password hashing with bcrypt, JWT session creation.
- [x] **US-03**: Session maintained via HTTP-only cookie, Next.js middleware protected routes (`/dashboard`).

### Hana
- [x] **US-04**: Financial dashboard displaying Current Balance, Total Income, Total Expense, Cashflow charts.
- [x] **US-05**: Add income transaction form with student category presets, linked to logged-in user.
- [x] **US-06**: Add expense transaction form with automatic balance recalculation.

### Nabkay
- [x] **US-07**: Transaction history table with formatted currency and date, strictly isolated per user.
- [x] **US-08**: Edit transaction modal with prefilled data and database update endpoint.
- [x] **US-09**: Delete transaction modal with warning confirmation and cascade safety.

### Sela
- [x] **US-10**: Filter transactions by All, Income only, and Expense only + search and category filters.
- [x] **US-11**: Persistent dark/light mode preference stored in `theme_preference` cookie.
- [x] **US-12**: Logout button destroys session cookie and securely redirects to `/login`.

---

## 🔒 Security & User Isolation Architecture
Every database query in `/api/transactions` and `/api/transactions/[id]` enforces `userId: currentUser.id`. Even if User A knows the numeric ID of User B's transaction, unauthorized access returns `403 Forbidden`.
