# Hirely Backend API

Express.js REST API server for the Hirely job portal platform. Provides authentication, job management, and application tracking functionality with JWT-based access control and MongoDB persistence.

## API Purpose

The Hirely backend serves as the central API layer for a job portal application, handling:

- **Authentication**: User registration, login, and JWT token generation
- **User Management**: Profile creation, updates, and deletion with role-based access
- **Job Management**: Job posting, retrieval, and listing with metadata
- **Application Tracking**: Job application submission, status management, and history
- **Role-Based Access Control**: Admin and user tier permissions with middleware protection

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | LTS |
| Framework | Express.js | ^5.2.1 |
| Database | MongoDB | 9.1.5 (Mongoose) |
| Authentication | JWT | ^9.0.3 |
| Password Hashing | bcryptjs | ^3.0.3 |
| CORS | cors | ^2.8.6 |
| Environment | dotenv | ^17.2.3 |
| Development | nodemon | ^3.1.11 |

## Authentication Flow

### Registration
```
POST /api/auth/register
├─ Request: { name, email, password }
├─ Validation: All fields required, email uniqueness checked
├─ Role Assignment: ADMIN_EMAIL → "admin", others → "user"
├─ Password: Hashed with bcryptjs (salt: 10)
└─ Response: { token, user: { id, name, email, role } }
```

### Login
```
POST /api/auth/login
├─ Request: { email, password }
├─ Verification: Email exists, password matches hash
├─ Token Generation: JWT signed with JWT_SECRET
└─ Response: { token, user: { id, name, email, role } }
```

### Protected Routes
```
Authorization Header: Bearer <token>
│
├─ Token Extraction: "Bearer " prefix parsed
├─ Verification: Decoded with JWT_SECRET
├─ User Population: Full user object attached to req.user
└─ On Failure: 401 Unauthorized response
```

### Token Usage
All protected endpoints require:
```
Header: Authorization: Bearer <JWT_TOKEN>
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server Configuration
PORT=5000

# Database
MONGO_URI=mongodb://username:password@host:port/database

# Authentication
JWT_SECRET=your-secret-key-min-32-characters-recommended
ADMIN_EMAIL=admin@hirely.com
```

### Variable Details

| Variable | Type | Description |
|----------|------|-------------|
| `PORT` | number | Server port (default: 5000) |
| `MONGO_URI` | string | MongoDB connection string with credentials |
| `JWT_SECRET` | string | Secret key for JWT signing (min 32 chars recommended) |
| `ADMIN_EMAIL` | string | Email address that receives admin role on registration |

## Local Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or Atlas)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/VishalGhuge111/hirely-backend.git
   cd hirely-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your values:
   - Set `MONGO_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a strong random string
   - Set `ADMIN_EMAIL` if using non-default admin account

4. **Verify MongoDB connection**
   - Ensure MongoDB is running and accessible at your `MONGO_URI`
   - Verify credentials and network access rules (for Atlas)

## Run Scripts

### Development
Runs server with hot-reload via nodemon:
```bash
npm run dev
```
- Watches for file changes
- Auto-restarts server on modification
- Output includes "Server running on port 5000"

### Production
Starts server in normal mode:
```bash
npm start
```
- Runs `node server.js`
- Single process, no auto-reload
- Use with process manager (PM2, systemd) in production

### Custom Port
```bash
PORT=3001 npm run dev
```

## API Endpoints

### Authentication Routes
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | No | Create new user account |
| POST | `/api/auth/login` | No | Login and receive JWT token |
| PUT | `/api/auth/profile` | Yes | Update user profile (name, mobile, LinkedIn) |
| DELETE | `/api/auth/profile` | Yes | Delete user account |

### Job Routes
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/jobs` | No | List all jobs |
| POST | `/api/jobs` | Yes* | Post new job (admin only) |
| GET | `/api/jobs/:id` | No | Get job details |

### Application Routes
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/applications` | Yes | Get user's applications |
| POST | `/api/applications` | Yes | Submit job application |
| GET | `/api/applications/:id` | Yes* | Get application details |

*Admin role may have additional privileges

### Health Check
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Server status ("Hirely API Running...") |

## Folder Structure

```
hirely-backend/
├── config/
│   └── db.js                 # MongoDB connection setup
├── controllers/
│   ├── auth.controller.js    # Auth logic (register, login, profile)
│   ├── job.controller.js     # Job CRUD operations
│   └── application.controller.js  # Application management
├── middleware/
│   ├── authMiddleware.js     # JWT verification & user population
│   └── roleMiddleware.js     # Role-based access control
├── models/
│   ├── User.js               # User schema (name, email, password, role)
│   ├── Job.js                # Job schema (title, description, company)
│   └── Application.js        # Application schema (user, job, status)
├── routes/
│   ├── auth.routes.js        # Auth endpoints
│   ├── job.routes.js         # Job endpoints
│   └── application.routes.js # Application endpoints
├── utils/
│   └── generateToken.js      # JWT token generation utility
├── server.js                 # Express app setup & server listen
├── .env.example              # Environment variable template
├── package.json              # Dependencies & scripts
└── README.md                 # This file
```

## Deployment Notes

### Vercel Deployment
Not recommended for Node.js + MongoDB long-running server. Use traditional hosting instead.

### Recommended Hosting Options

#### 1. **Railway.app** (Recommended for Beginners)
- MongoDB + Node.js integrated
- Auto-deploys on git push
- Free tier available
- [Railway Deployment Guide](https://docs.railway.app/guides/nodejs)

#### 2. **Render.com**
- Free tier with 0.5GB RAM
- Native MongoDB support via Render Databases
- Simple GitHub integration

#### 3. **AWS EC2 + RDS/Atlas**
- Scalable infrastructure
- MongoDB Atlas for database
- PM2 for process management
- Nginx reverse proxy

#### 4. **DigitalOcean App Platform**
- $5/month droplet + managed MongoDB Atlas
- Docker deployment option
- Simple CLI deployment

#### 5. **Heroku Alternative (Koyeb)**
- Similar to Heroku but cheaper
- Free tier tier support
- Built-in MongoDB add-ons

### Deployment Checklist

- [ ] Environment variables set in hosting platform (PORT, MONGO_URI, JWT_SECRET, ADMIN_EMAIL)
- [ ] MongoDB production instance provisioned (Atlas, Render, etc.)
- [ ] JWT_SECRET is a strong random string (min 32 characters)
- [ ] CORS origins configured for frontend domain
- [ ] Database backups enabled
- [ ] Error logging/monitoring configured
- [ ] Process manager configured (PM2, systemd, Docker)
- [ ] Health check endpoint accessible (`GET /`)

### Production Security Considerations

```javascript
// Recommended additions before production:

// 1. Rate limiting
const rateLimit = require('express-rate-limit');
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// 2. Request validation
// Implement input sanitization for all user inputs

// 3. HTTPS enforcement
// Configure nginx/load balancer to redirect HTTP → HTTPS

// 4. Helmet.js for security headers
const helmet = require('helmet');
app.use(helmet());

// 5. Logging
// Implement structured logging (Winston, Pino)

// 6. Error handling
// Add global error handler middleware
```

### Database Optimization

```javascript
// Index creation for performance
db.users.createIndex({ email: 1 });
db.applications.createIndex({ userId: 1 });
db.applications.createIndex({ jobId: 1 });
db.jobs.createIndex({ createdAt: -1 });
```

## Development Workflow

### Adding a New Endpoint

1. **Define Model** (`models/`)
   ```javascript
   // Example: models/Resume.js
   const resumeSchema = new Schema({
     userId: { type: Schema.Types.ObjectId, ref: 'User' },
     url: String,
   });
   ```

2. **Create Controller** (`controllers/`)
   ```javascript
   // Example: controllers/resume.controller.js
   exports.uploadResume = async (req, res) => { ... };
   ```

3. **Setup Routes** (`routes/`)
   ```javascript
   // Example: routes/resume.routes.js
   router.post('/', protect, controller.uploadResume);
   ```

4. **Register in server.js**
   ```javascript
   app.use('/api/resumes', require('./routes/resume.routes'));
   ```

### Testing Endpoints

Use curl, Postman, or Thunder Client:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'

# Protected endpoint (replace TOKEN)
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}'
```

## Troubleshooting

### MongoDB Connection Error
```
Error: Mongo connection error: connection refused
```
**Solution**: Verify `MONGO_URI` is correct and MongoDB is running:
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/hirely
```

### JWT Token Invalid
```
Error: jwt malformed / jwt expired
```
**Solution**: Ensure JWT_SECRET matches between token generation and verification. Regenerate token if expired.

### CORS Issues
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Update frontend domain in `server.js`:
```javascript
app.use(cors({ origin: 'https://yourdomain.com' }));
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
```bash
# Change port
PORT=3001 npm run dev

# Or find and kill process
lsof -i :5000
kill -9 <PID>
```

## License

ISC

## Support

For issues or contributions, please open a GitHub issue or pull request on the [Hirely Backend Repository](https://github.com/VishalGhuge111/hirely-backend).
