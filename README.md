# 📋 Personal Task & Time Tracker

A full-stack productivity application built with Next.js, NestJS, and PostgreSQL. Track tasks, monitor time spent, and analyze your productivity with powerful analytics.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)

---

## 🎯 Features

### Core Features ✅
- **User Authentication** - Secure registration, login, and JWT-based authentication
- **Task Management** - Create, edit, delete, and mark tasks as complete
- **Time Tracking** - Start/stop timer for any task and track total time spent
- **Dashboard** - View all tasks with status indicators and productivity stats
- **Protected Routes** - Secure access to authenticated pages

### Bonus Features ⭐
- **Categories & Tags** - Organize tasks with color-coded categories
- **Advanced Filtering** - Filter by status, priority, category, or search text
- **CSV Export** - Download your task data for external analysis
- **Data Visualization** - Charts showing productivity trends and time distribution
- **Search Functionality** - Quick search across task titles and descriptions
- **Priority Levels** - Organize tasks by urgency (Low, Medium, High, Urgent)

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **NestJS** | 11.1.13 | Node.js framework (TypeScript) |
| **PostgreSQL** | 14+ | Relational database |
| **Prisma** | 5.22.0 | ORM and database toolkit |
| **JWT** | 11.0.2 | Authentication tokens |
| **bcrypt** | 6.0.0 | Password hashing |
| **Passport** | 0.7.0 | Authentication middleware |
| **class-validator** | 0.14.3 | Request validation |
| **class-transformer** | 0.5.1 | Data transformation |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | React framework with App Router |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.9.3 | Type safety |
| **Zustand** | 5.0.11 | State management |
| **Tailwind CSS** | 4.1.18 | Utility-first CSS |
| **shadcn/ui** | - | UI component library |
| **Axios** | 1.13.4 | HTTP client |
| **React Hook Form** | 7.71.1 | Form handling |
| **Zod** | 4.3.6 | Schema validation |
| **Recharts** | 3.7.0 | Data visualization |
| **date-fns** | 4.1.0 | Date utilities |
| **Lucide React** | 0.563.0 | Icon library |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** v9 or higher (comes with Node.js)
- **PostgreSQL** v14 or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-time-tracker.git
cd task-time-tracker
```

### 2. Database Setup

```bash
# Start PostgreSQL service
# Windows:
net start postgresql-x64-14

# macOS:
brew services start postgresql@14

# Linux:
sudo service postgresql start

# Create database
psql -U postgres

# In PostgreSQL CLI:
CREATE DATABASE task_tracker;
CREATE USER taskuser WITH ENCRYPTED PASSWORD 'yourpassword123';
GRANT ALL PRIVILEGES ON DATABASE task_tracker TO taskuser;
\q
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start development server
npm run start:dev
```

Backend will run on **http://localhost:3001**

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
# Edit .env.local if needed

# Start development server
npm run dev
```

Frontend will run on **http://localhost:3000**

---

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL="postgresql://taskuser:yourpassword123@localhost:5432/task_tracker?schema=public"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="7d"

# Server
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

**Important:**
- Replace `taskuser` and `yourpassword123` with your PostgreSQL credentials
- **Change `JWT_SECRET` in production** to a strong random string
- Update `FRONTEND_URL` when deploying

### Frontend (.env.local)

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**For Production:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

---

## 🗄️ Database Schema

```
┌─────────────────────┐
│       User          │
├─────────────────────┤
│ id: String (PK)     │
│ email: String       │
│ password: String    │
│ name: String        │
│ createdAt: DateTime │
│ updatedAt: DateTime │
└─────────────────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────────┐
│    Category     │  │      Task        │
├─────────────────┤  ├──────────────────┤
│ id: String (PK) │  │ id: String (PK)  │
│ name: String    │  │ title: String    │
│ color: String   │  │ description: ?   │
│ userId: String  │  │ status: Enum     │
└─────────────────┘  │ priority: Enum   │
                     │ userId: String   │
                     │ categoryId: ?    │
                     │ createdAt: Date  │
                     │ updatedAt: Date  │
                     └──────────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │   TimeEntry      │
                     ├──────────────────┤
                     │ id: String (PK)  │
                     │ startTime: Date  │
                     │ endTime: ?       │
                     │ duration: Int    │
                     │ taskId: String   │
                     │ userId: String   │
                     │ createdAt: Date  │
                     └──────────────────┘

Enums:
- TaskStatus: TODO | IN_PROGRESS | COMPLETED
- Priority: LOW | MEDIUM | HIGH | URGENT
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response: 201 Created
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-02-07T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Tasks

All task endpoints require authentication:
```http
Authorization: Bearer <token>
```

#### Get All Tasks
```http
GET /api/tasks?status=TODO&priority=HIGH&categoryId=uuid&search=keyword

Response: 200 OK
[
  {
    "id": "uuid",
    "title": "Complete assignment",
    "description": "Finish the project",
    "status": "TODO",
    "priority": "HIGH",
    "categoryId": "uuid",
    "category": { ... },
    "timeEntries": [ ... ],
    "totalTime": 3600,
    "createdAt": "2026-02-07T12:00:00.000Z",
    "updatedAt": "2026-02-07T12:00:00.000Z"
  }
]
```

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "priority": "MEDIUM",
  "categoryId": "uuid"
}

Response: 201 Created
```

#### Update Task
```http
PATCH /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "IN_PROGRESS",
  "priority": "HIGH"
}

Response: 200 OK
```

#### Toggle Task Status
```http
PATCH /api/tasks/:id/toggle

Response: 200 OK
```

#### Delete Task
```http
DELETE /api/tasks/:id

Response: 200 OK
```

### Time Tracking

#### Start Timer
```http
POST /api/time-entries/start/:taskId

Response: 201 Created
{
  "id": "uuid",
  "startTime": "2026-02-07T12:00:00.000Z",
  "endTime": null,
  "duration": 0,
  "taskId": "uuid",
  "userId": "uuid",
  "createdAt": "2026-02-07T12:00:00.000Z"
}
```

#### Stop Timer
```http
POST /api/time-entries/stop/:entryId

Response: 200 OK
{
  "id": "uuid",
  "startTime": "2026-02-07T12:00:00.000Z",
  "endTime": "2026-02-07T12:30:00.000Z",
  "duration": 1800,
  "taskId": "uuid"
}
```

#### Get Active Timer
```http
GET /api/time-entries/active

Response: 200 OK
```

#### Get Task Time Entries
```http
GET /api/time-entries/task/:taskId

Response: 200 OK
```

### Categories

#### Get All Categories
```http
GET /api/categories

Response: 200 OK
```

#### Create Category
```http
POST /api/categories
Content-Type: application/json

{
  "name": "Work",
  "color": "#3B82F6"
}

Response: 201 Created
```

#### Update Category
```http
PATCH /api/categories/:id

Response: 200 OK
```

#### Delete Category
```http
DELETE /api/categories/:id

Response: 200 OK
```

### Analytics

#### Dashboard Stats
```http
GET /api/analytics/dashboard

Response: 200 OK
{
  "tasksCompletedToday": 5,
  "tasksCompletedWeek": 23,
  "totalHoursToday": 4.5,
  "totalHoursWeek": 32.5,
  "tasksByStatus": [...],
  "tasksByPriority": [...]
}
```

#### Productivity Trend
```http
GET /api/analytics/productivity-trend?days=7

Response: 200 OK
```

#### Time Distribution
```http
GET /api/analytics/time-distribution?period=week

Response: 200 OK
```

---

## 🛠️ Development Commands

### Backend

```bash
cd backend

# Development
npm run start:dev          # Start with hot-reload
npm run start:debug        # Start with debugger

# Production
npm run build              # Build for production
npm run start:prod         # Start production server

# Testing
npm test                   # Run tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Generate coverage report

# Database
npx prisma studio          # Open Prisma Studio (GUI)
npx prisma migrate dev     # Create new migration
npx prisma migrate reset   # Reset database
npx prisma generate        # Generate Prisma Client

# Code Quality
npm run lint               # Lint code
npm run format             # Format code with Prettier
```

### Frontend

```bash
cd frontend

# Development
npm run dev                # Start development server
npm run build              # Build for production
npm start                  # Start production server

# Code Quality
npm run lint               # Lint code
npx tsc --noEmit          # Type check
```

---

## 📁 Project Structure

```
task-time-tracker/
├── backend/
│   ├── prisma/
│   │   ├── migrations/           # Database migrations
│   │   └── schema.prisma         # Database schema
│   ├── src/
│   │   ├── auth/                 # Authentication module
│   │   ├── tasks/                # Tasks module
│   │   ├── time-entries/         # Time tracking module
│   │   ├── categories/           # Categories module
│   │   ├── analytics/            # Analytics module
│   │   ├── prisma/               # Prisma service
│   │   ├── app.module.ts         # Root module
│   │   └── main.ts               # Entry point
│   ├── .env                      # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/                  # Next.js App Router
    │   │   ├── (auth)/           # Auth pages
    │   │   ├── dashboard/        # Dashboard pages
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   └── globals.css
    │   ├── components/           # React components
    │   │   ├── dashboard/
    │   │   ├── tasks/
    │   │   └── ui/               # shadcn/ui components
    │   ├── lib/                  # Utilities
    │   ├── store/                # Zustand stores
    │   └── types/                # TypeScript types
    ├── .env.local                # Environment variables
    └── package.json
```

---

## 🧪 Testing the Application

### 1. Test User Registration

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 2. Test User Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Open Frontend

Navigate to [http://localhost:3000](http://localhost:3000) and:
1. Register a new account
2. Login with your credentials
3. Create your first task
4. Start tracking time
5. View your dashboard analytics

---

## 🚢 Deployment

### Backend (Railway/Render/Heroku)

1. Set environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Strong random secret
   - `FRONTEND_URL` - Your frontend domain

2. Build command: `npm install && npx prisma generate && npm run build`
3. Start command: `npm run start:prod`

### Frontend (Vercel/Netlify)

1. Set environment variable:
   - `NEXT_PUBLIC_API_URL` - Your backend domain

2. Build command: `npm run build`
3. Output directory: `.next`

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3001 (backend)
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo service postgresql status   # Linux
brew services list              # macOS

# Restart PostgreSQL
sudo service postgresql restart
```

### Prisma Issues

```bash
cd backend
rm -rf node_modules/.prisma
npx prisma generate
npx prisma migrate reset
```

---

## 📸 Application Screenshots

### 🏠 Homepage - Landing Page
<p align="center">
  <img src="screenshots/homepage.png" alt="Homepage" width="700"/>
</p>
*Modern landing page with clear call-to-action buttons*

---

### 🔐 Authentication

<div align="center">
  <img src="screenshots/login.png" alt="Login Page" width="48%"/>
  <img src="screenshots/register.png" alt="Register Page" width="48%"/>
</div>
<p align="center"><i>Secure login and registration pages with form validation</i></p>

---

### 📊 Dashboard - Overview
<p align="center">
  <img src="screenshots/dashboard.png" alt="Dashboard" width="700"/>
</p>
*Real-time productivity stats and recent tasks overview*

---

### ✅ Task Management
<p align="center">
  <img src="screenshots/task.png" alt="Task Page" width="700"/>
</p>
*Complete task CRUD operations with filtering and search*

---

### 📈 Analytics & Insights
<p align="center">
  <img src="screenshots/analytics.png" alt="Analytics" width="700"/>
</p>
*Visual charts showing productivity trends and time distribution*

---

### 👤 User Profile
<p align="center">
  <img src="screenshots/my-profile.png" alt="Profile" width="700"/>
</p>
*User profile management and settings*

---

## 👤 Author

Thilina Samarasinghe

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

**Built with ❤️ using Next.js, NestJS, and PostgreSQL**
