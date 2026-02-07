# 🧠 Hirely Backend API

Hirely Backend is a Node.js + Express REST API powering the Hirely job portal platform. It handles authentication, user management, job postings, and application tracking with **JWT-based authentication and Email OTP verification** using MongoDB persistence.

**Base API URL:** [https://hirely-backend-g7q8.onrender.com](https://hirely-backend-g7q8.onrender.com)

---

## 📋 Table of Contents

* [Overview](#overview)
* [Tech Stack](#tech-stack)
* [System Architecture](#system-architecture)
* [Authentication Flow](#authentication-flow)
* [Features](#features)
* [Environment Variables](#environment-variables)
* [Installation](#installation)
* [Run Scripts](#run-scripts)
* [API Endpoints](#api-endpoints)
* [Project Structure](#project-structure)
* [Security Practices](#security-practices)
* [Deployment](#deployment)
* [Troubleshooting](#troubleshooting)
* [License](#license)

---

## 🎯 Overview

Hirely Backend acts as the central API layer for the platform. It validates users, manages sessions, stores job data, and tracks applications.

Key goals:

* Secure authentication using JWT + Email OTP
* Clean and predictable REST APIs
* Role-based access control
* Scalable MongoDB data models
* Email verification and password recovery

---

## 🛠️ Tech Stack

| Layer              | Technology         |
| ------------------ | ------------------ |
| Runtime            | Node.js            |
| Framework          | Express.js         |
| Database           | MongoDB + Mongoose |
| Authentication     | JWT + Email OTP    |
| Password Hashing   | bcryptjs           |
| Email Service      | Brevo (SMTP API)   |
| Environment Config | dotenv             |
| Dev Tool           | nodemon            |

---

## 🏗️ System Architecture

Client (React)
↓
Axios API Calls
↓
Express Routes
↓
Controllers
↓
MongoDB Models

---

## 🔐 Authentication Flow

### Register (Email OTP Based)

```
POST /api/auth/register
```

* Accepts name, email, password
* Hashes password using bcrypt
* Generates a 6-digit email OTP
* Stores OTP with expiry time
* Sends OTP via Brevo email service
* Account remains unverified until OTP confirmation

---

### Verify Email (OTP)

```
POST /api/auth/verify-email
```

* Validates OTP and expiry
* Marks user email as verified
* Enables login access

---

### Login

```
POST /api/auth/login
```

* Verifies email & password
* Blocks login if email is not verified
* Generates JWT token on success

---

### Forgot Password (OTP Based)

```
POST /api/auth/forgot-password
```

* Sends OTP to registered email
* Stores OTP with expiry

```
POST /api/auth/reset-password
```

* Verifies OTP
* Allows password reset without login

---

### Protected Requests

All protected routes require the following header:

```
Authorization: Bearer <TOKEN>
```

JWT middleware validates token and attaches user to request.

---

## ✨ Features

### 👤 Users

* Register with email OTP verification
* Login with verified email
* Forgot password using OTP
* Reset password securely
* Update profile
* Delete account

---

### 🧑‍💼 Admin

* Create job postings
* Manage jobs
* Enable / disable job listings
* View all applications

---

### 💼 Jobs

* Create job
* Get all jobs
* Get single job
* Control job active / closed state

---

### 📄 Applications

* Apply to job (one-time per job)
* Prevent duplicate applications
* Get user applications
* Admin view all applications

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_verified_sender_email
ADMIN_EMAIL=admin@example.com
```

| Variable      | Purpose              |
| ------------- | -------------------- |
| PORT          | Server Port          |
| MONGO_URI     | MongoDB connection   |
| JWT_SECRET    | JWT signing secret   |
| BREVO_API_KEY | Email OTP service    |
| SENDER_EMAIL  | Email sender address |
| ADMIN_EMAIL   | Auto admin account   |

---

## 📦 Installation

```bash
git clone https://github.com/VishalGhuge111/hirely-backend.git
cd hirely-backend
npm install
```

Create a `.env` file and add environment variables.

---

## ▶️ Run Scripts

```bash
npm run dev     # Development
npm start       # Production
```

Server runs on:

```
http://localhost:5000
```

---

## 🔌 API Endpoints

### Auth

| Method | Route                     | Auth |
| ------ | ------------------------- | ---- |
| POST   | /api/auth/register        | No   |
| POST   | /api/auth/verify-email    | No   |
| POST   | /api/auth/login           | No   |
| POST   | /api/auth/forgot-password | No   |
| POST   | /api/auth/reset-password  | No   |
| PUT    | /api/auth/profile         | Yes  |
| DELETE | /api/auth/profile         | Yes  |

---

### Jobs

| Method | Route         | Auth  |
| ------ | ------------- | ----- |
| GET    | /api/jobs     | No    |
| GET    | /api/jobs/:id | No    |
| POST   | /api/jobs     | Admin |
| PUT    | /api/jobs/:id | Admin |

---

### Applications

| Method | Route                        | Auth  |
| ------ | ---------------------------- | ----- |
| POST   | /api/applications/:jobId     | Yes   |
| GET    | /api/applications            | Yes   |
| GET    | /api/applications/job/:jobId | Yes   |
| GET    | /api/applications/admin      | Admin |

---

### Health

| Method | Route |
| ------ | ----- |
| GET    | /     |

---

## 📁 Project Structure

```
hirely-backend/
├── config/
│   └── db.js
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
│   └── sendEmail.js
├── server.js
├── package.json
└── README.md
```

---

## 🛡️ Security Practices

* Password hashing using bcrypt
* Email OTP verification
* OTP expiry enforcement
* JWT authentication
* Protected routes
* Role-based authorization
* Environment variable protection

---

## 🚀 Deployment

Recommended Platform: Render

Steps:

1. Push repository to GitHub
2. Create a new Render Web Service
3. Add environment variables
4. Deploy

---

## 🧯 Troubleshooting

### MongoDB Not Connecting

Check `MONGO_URI`

### OTP Email Not Received

Verify `BREVO_API_KEY` and sender email

### Invalid Token

Login again

### Port Conflict

Change `PORT` in `.env`

---

## 📄 License

MIT

---

**Status:** Production Ready
**Version:** 1.1.0 (Email OTP & Security Update)
