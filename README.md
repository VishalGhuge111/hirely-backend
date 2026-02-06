# 🧠 Hirely Backend API

Hirely Backend is a Node.js + Express REST API powering the Hirely job portal platform. It handles authentication, user management, job postings, and application tracking with JWT-based security and MongoDB persistence.

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

* Secure authentication
* Clean REST APIs
* Role-based access
* Scalable MongoDB structure

---

## 🛠️ Tech Stack

| Layer              | Technology           |
| ------------------ | -------------------- |
| Runtime            | Node.js              |
| Framework          | Express.js           |
| Database           | MongoDB + Mongoose   |
| Auth               | JSON Web Token (JWT) |
| Password Hashing   | bcryptjs             |
| Environment Config | dotenv               |
| Dev Tool           | nodemon              |

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

### Register

```
POST /api/auth/register
```

* Accepts name, email, password
* Hashes password
* Creates user
* Returns token + user

### Login

```
POST /api/auth/login
```

* Verifies email & password
* Generates JWT token

### Protected Requests

Header required:

```
Authorization: Bearer <TOKEN>
```

Middleware verifies token and attaches user to request.

---

## ✨ Features

### 👤 Users

* Register
* Login
* Update profile
* Delete account

### 🧑‍💼 Admin

* Create jobs
* Manage jobs
* View all applications

### 💼 Jobs

* Create job
* Get all jobs
* Get single job

### 📄 Applications

* Apply to job
* Update application
* Get user applications
* Admin view applications

---

## 🔑 Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
ADMIN_EMAIL=admin@example.com
```

| Variable    | Purpose            |
| ----------- | ------------------ |
| PORT        | Server Port        |
| MONGO_URI   | MongoDB connection |
| JWT_SECRET  | JWT signing secret |
| ADMIN_EMAIL | Auto admin account |

---

## 📦 Installation

```bash
git clone https://github.com/VishalGhuge111/hirely-backend.git
cd hirely-backend
npm install
```

Create .env file and add variables.

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

| Method | Route              | Auth |
| ------ | ------------------ | ---- |
| POST   | /api/auth/register | No   |
| POST   | /api/auth/login    | No   |
| PUT    | /api/auth/profile  | Yes  |
| DELETE | /api/auth/profile  | Yes  |

### Jobs

| Method | Route         | Auth  |
| ------ | ------------- | ----- |
| GET    | /api/jobs     | No    |
| POST   | /api/jobs     | Admin |
| GET    | /api/jobs/:id | No    |

### Applications

| Method | Route                    | Auth  |
| ------ | ------------------------ | ----- |
| POST   | /api/applications/:jobId | Yes   |
| GET    | /api/applications        | Yes   |
| GET    | /api/applications/admin  | Admin |

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
├── server.js
├── package.json
└── README.md
```

---

## 🛡️ Security Practices

* Password hashing
* JWT authentication
* Protected routes
* Role-based middleware
* Environment variables

---

## 🚀 Deployment

Recommended: Render

Steps:

1. Push repo to GitHub
2. Create Render Web Service
3. Add environment variables
4. Deploy

---

## 🧯 Troubleshooting

### MongoDB Not Connecting

Check MONGO_URI

### Invalid Token

Login again

### Port Conflict

Change PORT in .env

---

## 📄 License

MIT

---

**Status:** Production Ready
**Version:** 1.0.0
