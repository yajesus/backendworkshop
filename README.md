# 🛠️ Workshop Booking System - Backend

This is the backend for the Workshop Booking System built with **Node.js**, **Express**, **Prisma**, and **PostgreSQL (Neon)**.

---

## 🚀 Features

- Admin and customer authentication (JWT)
- Workshop and time slot CRUD (admin)
- Booking submission and management
- Dashboard stats endpoint
- Prisma ORM with PostgreSQL (Neon)
- Zod validation, Jest tests
- Dockerized and seedable

---

## 🧪 Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourname/workshop-backend.git
cd workshop-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://<user>:<password>@<project>.pooler.<region>.neon.tech/<dbname>?sslmode=require
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## 📦 Scripts

### ▶️ Start Dev Server

```bash
npm run dev
```

### 🔨 Build

```bash
npm run build
```

### 🧪 Run Tests

```bash
npx jest
```

### 🌱 Seed Database

```bash
npx ts-node prisma/seed.ts
```

### 🔁 Prisma DB Push

```bash
npx prisma db push
```

---

## 🐳 Docker Setup

### 1. Build and run with Docker Compose

```bash
docker-compose up --build
```

### 2. Access the API

- http://localhost:5000/api/workshops

---

## 📚 Endpoints Summary

### Auth

- `POST /api/admin/login`
- `POST /api/customers/register`
- `POST /api/customers/login`

### Workshops

- `POST /api/workshops`
- `GET /api/workshops`
- `PUT /api/workshops/:id`
- `DELETE /api/workshops/:id`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings`
- `PUT /api/bookings/:id`

### Stats

- `GET /api/stats`

---

## 👤 Admin Credentials (Seeded)

```txt
Email: admin@example.com
Password: admin123
```

---

## ✅ Stack

- Node.js + Express
- Prisma + Neon PostgreSQL
- Zod + JWT
- Docker + Jest + Supertest

---

Built with ❤️ by [Your Name]
