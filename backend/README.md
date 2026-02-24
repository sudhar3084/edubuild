# EDUBUILD Backend

Express.js + PostgreSQL backend for the EDUBUILD platform.

## 🚀 Project Structure

```
backend/
├── config/
│   └── db.js              # PostgreSQL connection (Sequelize)
├── models/
│   ├── User.js            # User model (teachers, admins)
│   ├── Project.js         # Project model
│   └── Feedback.js        # Feedback model
├── controllers/
│   ├── authController.js  # Auth logic
│   ├── projectController.js # Project CRUD
│   └── feedbackController.js # Feedback logic
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── projectRoutes.js   # Project endpoints
│   └── feedbackRoutes.js  # Feedback endpoints
├── middleware/
│   ├── auth.js            # JWT authentication
│   └── adminOnly.js       # Admin verification
├── server.js              # Main server file
├── package.json           # Dependencies
└── .env.example           # Environment template
```

## 📋 Setup Instructions

### 1. Install PostgreSQL

**Windows:**
- Download from https://www.postgresql.org/download/
- Install with default settings
- Default user: `postgres`, password: `postgres`

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
psql -U postgres
CREATE DATABASE edubuild;
\q
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=edubuild
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 5. Start the Backend Server

```bash
npm run dev        # Development mode with auto-reload
# OR
npm start          # Production mode
```

Server will run on `http://localhost:5000`

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new teacher
- `POST /api/auth/signin` - Login
- `GET /api/auth/profile` - Get user profile (requires token)

### Projects

- `GET /api/projects` - Get all projects (with optional filters)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (auth required)
- `PUT /api/projects/:id` - Update project (auth + owner check)
- `DELETE /api/projects/:id` - Delete project (auth + owner check)

**Query Parameters for GET /api/projects:**
- `budget` - Max budget (₹)
- `classLevel` - 6-8, 9-10, 11-12
- `subject` - Physics, Chemistry, Biology, Mathematics, Engineering

### Feedback

- `POST /api/feedback` - Submit feedback (auth required)
- `GET /api/feedback/:projectId` - Get project feedback

## 📊 Database Models

### Users Table
```sql
- id (UUID, Primary Key)
- name (STRING)
- email (STRING, UNIQUE)
- password (STRING, hashed)
- role (ENUM: 'teacher' | 'admin')
- school (STRING)
- state (STRING)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### Projects Table
```sql
- id (UUID, Primary Key)
- title (STRING)
- description (TEXT)
- image (STRING)
- budget (FLOAT)
- classLevel (ENUM: '6-8' | '9-10' | '11-12')
- subject (ENUM: Physics | Chemistry | Biology | Mathematics | Engineering)
- materials (JSON)
- steps (JSON)
- learningOutcomes (JSON)
- difficulty (ENUM: Easy | Medium | Hard)
- rating (FLOAT)
- createdBy (UUID, Foreign Key → Users)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### Feedback Table
```sql
- id (UUID, Primary Key)
- projectId (UUID, Foreign Key → Projects)
- userId (UUID, Foreign Key → Users)
- userName (STRING)
- schoolName (STRING)
- difficulty (ENUM: Easy | Medium | Hard)
- feedback (TEXT)
- rating (INTEGER: 1-5)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are valid for 7 days.

## 📝 Example Requests

### Sign Up
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Teacher",
  "email": "john@example.com",
  "password": "secure123",
  "school": "Government School",
  "state": "Tamil Nadu"
}
```

### Get Projects
```bash
GET /api/projects?budget=200&classLevel=9-10&subject=Physics
```

### Create Project
```bash
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Hydraulic Lift",
  "description": "...",
  "budget": 50,
  "classLevel": "9-10",
  "subject": "Physics",
  "materials": [...],
  "steps": [...],
  "learningOutcomes": [...]
}
```

## 🚀 Deployment

For production:

1. Use a managed PostgreSQL service (AWS RDS, Railway, etc.)
2. Set `NODE_ENV=production`
3. Use a strong `JWT_SECRET`
4. Update `CLIENT_URL` to your frontend domain
5. Deploy to Heroku, Railway, Vercel, or similar

## 🔧 Troubleshooting

### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
Solution: Ensure PostgreSQL is running
```bash
psql -U postgres  # Test connection
```

### Database Not Found
```
Error: database "edubuild" does not exist
```
Solution: Create the database
```bash
psql -U postgres -c "CREATE DATABASE edubuild;"
```

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
Solution: Change PORT in .env or kill process using port 5000

---

**Made with ❤️ for Rural STEM Education**
