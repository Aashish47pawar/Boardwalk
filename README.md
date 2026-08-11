# Boardwalk — Collaborative Task Manager

A real-time full-stack task management application built with the MERN stack.

## 🔗 Live Demo
[Coming soon — link after deployment]

## 🛠️ Tech Stack
- **Frontend:** React.js, Redux Toolkit, React Router, Socket.io-client
- **Backend:** Node.js, Express.js, Socket.io
- **Database:** MongoDB, Mongoose
- **Auth:** JWT (JSON Web Tokens), Bcrypt

## ✨ Features
- Secure user registration and login with JWT authentication
- Real-time task updates across all connected users via Socket.io
- Create, assign, edit and delete tasks with priority levels
- Kanban-style board with To Do / In Progress / Done columns
- Responsive design

## 🚀 Run Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Backend
```bash
cd server
cp .env.example .env   # fill in your MONGO_URI and JWT_SECRET
npm install
npm run dev
```

### Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

## 📁 Project Structure
```
task-manager/
├── server/          # Express API, Mongoose models, JWT auth
└── client/          # React app, Redux Toolkit store, Socket.io
```