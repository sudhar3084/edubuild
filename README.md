# 🎓 EDUBUILD - Empowering Rural Teachers with Affordable STEM Projects

**Bringing hands-on science learning to every classroom in India, one waste-material project at a time.**

---

## 📂 Project Structure

```
edubuild/
├── src/                   # React frontend source
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page components
│   ├── context/           # Auth & Language contexts
│   ├── services/          # API calls
│   ├── data/              # Static data
│   └── utils/             # Utility functions
├── backend/               # Express.js + MongoDB backend
│   ├── models/            # Database schemas
│   ├── controllers/       # Business logic
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, validation
│   └── config/            # Database config
├── package.json           # Frontend dependencies
└── vite.config.js         # Frontend build config
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### 1. Setup Backend

```bash
cd backend
npm install
cp .env.example .env

# Update .env with:
# MONGODB_URI=mongodb://localhost:27017/edubuild
# JWT_SECRET=your_secret_here

npm run dev
```

✅ Backend runs on `http://localhost:5000`

### 2. Setup Frontend

```bash
# From root directory
npm install
cp .env.example .env

# Keep VITE_API_URL=http://localhost:5000/api
npm run dev
```

✅ Frontend runs on `http://localhost:5173`

---

## ✨ Key Features

### 📚 **Budget-Based Project Selection**
Teachers enter their budget (₹50-₹200), platform recommends affordable projects.

### ♻️ **Waste Material Projects**
All projects use recycled materials - syringe hydraulics, cardboard structures, etc.

### 📖 **Step-by-Step Guides**
Clear instructions with materials, assembly steps, concept explanations.

### 🇮🇳 **Multilingual Support**
English, Hindi, Telugu interfaces for wider accessibility.

### 👥 **Teacher Community**
Teachers can submit and share low-cost projects.

### ⭐ **Ratings & Feedback**
Real classroom feedback improves project quality.

### 📱 **Offline Friendly**
Download PDF guides for classroom use without internet.

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup       - Register new user
POST   /api/auth/signin       - Login
GET    /api/auth/profile      - Get user profile (auth required)
```

### Projects
```
GET    /api/projects          - Get projects (filters: budget, classLevel, subject)
GET    /api/projects/:id      - Get single project
POST   /api/projects          - Create project (auth required)
PUT    /api/projects/:id      - Update project (auth required)
DELETE /api/projects/:id      - Delete project (auth required)
```

### Feedback
```
POST   /api/feedback          - Submit feedback (auth required)
GET    /api/feedback/:id      - Get project feedback
```

### Example
```bash
# Get projects under ₹150 for Class 9-10
GET /api/projects?budget=150&classLevel=9-10
```

---

## 🗄️ Database Models

**User**
```
{ name, email, password (hashed), role, school, state, createdAt }
```

**Project**
```
{ title, description, budget, classLevel, subject, 
  materials, steps, learningOutcomes, difficulty, rating, createdBy, createdAt }
```

**Feedback**
```
{ projectId, userId, userName, difficulty, feedback, rating, createdAt }
```

See [backend/README.md](./backend/README.md) for detailed schema.

---

## 🔐 Authentication

1. **Sign Up** → Get JWT token
2. **API Calls** → Include `Authorization: Bearer <token>`
3. **Token Valid** → 7 days
4. **Auto Logout** → Token expires or manual logout

---

## ✅ Implemented Features

- ✔️ Budget-based filtering
- ✔️ Class level & subject selection
- ✔️ User authentication (Sign up/In)
- ✔️ Multi-language (EN, HI, TE)
- ✔️ Teacher project submissions
- ✔️ Project ratings & reviews
- ✔️ Responsive design

## 🚀 Planned Features

- Smart recommendations
- Offline PDF downloads
- Student assessments
- Admin dashboard
- Mobile app
- Community forums

---

## 📊 Tech Stack

**Frontend:** React 18, Vite, React Router, Context API, Axios

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT

---

## 🙏 Mission

**EDUBUILD** empowers government school teachers with affordable, sustainable STEM education materials - making quality hands-on learning accessible to all Indian students.

---

**Made with ❤️ for Rural Education | 2026**
