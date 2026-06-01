# SubsHub – Subscription Management Dashboard

A full-stack SaaS admin dashboard for managing subscription plans, built as a for Gnxtace Technologies.

---



---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, TailwindCSS, Redux Toolkit |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) |
| Validation | Zod |
| Version Control | Git |

---

## 🚀 Setup & Run Instructions

### Prerequisites

- Node.js v18+
- MongoDB running locally (or use a MongoDB Atlas URI)
- npm or yarn

---

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/subscription-dashboard-task.git
cd subscription-dashboard-task
```

---

### 2. Backend Setup

```bash
cd server
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/subscription-dashboard
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**Seed the database** (creates 4 plans + demo users):

```bash
npm run seed
```

**Start the backend:**

```bash
npm run dev   # development (nodemon)
# or
npm start     # production
```

Server runs on `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|

| Admin | priyan2@gmail.com | 12345678 |

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login + get tokens |
| POST | `/api/auth/refresh` | — | Refresh access token |
| POST | `/api/auth/logout` | ✅ | Logout |
| GET | `/api/plans` | — | List all plans |
| POST | `/api/subscribe/:planId` | ✅ User | Subscribe to plan |
| GET | `/api/my-subscription` | ✅ User | Get active subscription |
| GET | `/api/admin/subscriptions` | ✅ Admin | All subscriptions (paginated) |

---

## 🎯 Features Implemented

### Backend
- ✅ JWT authentication with access + refresh tokens
- ✅ Role-based middleware (user / admin)
- ✅ All required API endpoints
- ✅ Zod validation with structured error responses
- ✅ MongoDB models: `users`, `plans`, `subscriptions`
- ✅ Database seeder (4 realistic plans + 2 demo users)
- ✅ Auto-expire subscriptions past end_date
- ✅ Cancel previous subscriptions on re-subscribe (upgrade/downgrade)
- ✅ Pagination on admin subscriptions list

### Frontend
- ✅ `/login` – User login with demo credentials hint
- ✅ `/register` – New user registration
- ✅ `/plans` – All plans with live subscribe buttons
- ✅ `/dashboard` – Active subscription details, progress bar, feature list
- ✅ `/admin/subscriptions` – Full table with status filter + pagination
- ✅ Redux Toolkit for global state (auth + subscription)
- ✅ JWT stored in localStorage, auto silent refresh on 401
- ✅ Protected routes (role-based)
- ✅ Dark / Light theme toggle (persisted)
- ✅ Responsive Navbar with user menu
- ✅ Toast notifications for subscribe actions

### Bonus
- ✅ Dark/light theme toggle
- ✅ Plan upgrade/downgrade logic (re-subscribe cancels old plan)
- ✅ Status filter on admin table
- ✅ Pagination
- ✅ Auto-logout redirect on token expiry

---

## 📁 Project Structure

```
subscription-dashboard-task/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── auth/         # ProtectedRoute, GuestRoute
│   │   │   └── layout/       # Navbar
│   │   ├── pages/            # Route-level pages
│   │   ├── store/            # Redux store + slices
│   │   └── services/         # Axios instance + interceptors
│   └── ...
└── server/                   # Express backend
    └── src/
        ├── config/           # DB connection
        ├── controllers/      # Business logic
        ├── middleware/        # Auth + role middleware
        ├── models/           # Mongoose schemas
        ├── routes/           # Express routers
        ├── seeds/            # DB seeder
        └── validators/       # Zod schemas
```



Uploading Gnextedtechonlaghy.mp4…


