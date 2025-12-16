# Collaborative Task Manager

A full-stack real-time Task Manager application built with the MERN stack (Postgres/Prisma variant).

## 🚀 Features

- **Authentication**: Secure Register/Login with HttpOnly Cookies & JWT.
- **Task Management**: Create, Read, Update, Delete tasks with priorities and due dates.
- **Real-time Collaboration**: Live updates for task changes and assignments via Socket.io.
- **Modern UI**: Glassmorphic design, responsive layout, and intuitive UX.
- **Dashboard**: Personal views for Assigned, Created, and Overdue tasks.

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Zod.
- **Backend**: Node.js, Express, Prisma (PostgreSQL), Socket.io, Zod.
- **Database**: PostgreSQL.
- **DevOps**: Docker, Docker Compose.

## 📦 Prerequisites

- Node.js (v18+)
- Docker & Docker Compose (optional, for containerized run)
- PostgreSQL (if running locally without Docker)

## 🏃‍♂️ Getting Started

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd collaborative-task-manager
\`\`\`

### 2. Environment Setup
Create \`.env\` files in both \`backend\` and \`frontend\` directories.

**Backend (.env)**
\`\`\`env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager"
JWT_SECRET="your_jwt_secret"
CLIENT_URL="http://localhost:5173"
\`\`\`

**Frontend (.env)**
\`\`\`env
VITE_API_URL="http://localhost:5000"
\`\`\`

### 3. Run with Docker (Recommended)
\`\`\`bash
docker-compose up --build
\`\`\`
Access the app at `http://localhost:5173`.

### 4. Run Locally
**Backend**
\`\`\`bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
\`\`\`

**Frontend**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## 📚 API Guidelines

### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Sign in
- `POST /auth/logout` - Sign out
- `GET /auth/me` - Get current user profile
- `PUT /auth/me` - Update profile

### Tasks
- `GET /tasks` - List tasks (filters: status, priority, sortByDueDate)
- `POST /tasks` - Create task
- `GET /tasks/assigned` - Get tasks assigned to me
- `GET /tasks/created` - Get tasks created by me
- `GET /tasks/overdue` - Get overdue tasks
- `PATCH /tasks/:id` - Update task details
- `DELETE /tasks/:id` - Delete task

## 🏗️ Architecture
The project follows a layered architecture:
- **Controllers**: Handle HTTP requests/responses.
- **Services**: Business logic and data verification.
- **Repositories**: Database interactions via Prisma.
- **DTOs**: Data Transfer Objects with Zod validation.

## 🔄 Real-time Updates
Socket.io is used to push updates to connected clients:
- `task_updated`: Triggered when a task status/priority changes.
- `notification:new`: Triggered when a user is assigned a task.

## 🧪 Testing
Run backend unit tests:
\`\`\`bash
cd backend
npm test
\`\`\`
