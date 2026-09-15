# TaskFlow — Modern Task Management Application

A full-stack, responsive, user-friendly, and interactive Task Management web application built with **React**, **Vite**, **Node.js**, **Express**, **Socket.IO**, and **MongoDB** (with automatic zero-setup persistent fallback).

---

## ✨ Features

- **🔐 User Authentication & Authorization**:
  - Secure registration and login with password hashing (`bcryptjs`)
  - JWT (`jsonwebtoken`) token-based authorization with Bearer header interceptor
  - Protected API routes and protected client-side routes
  - One-click **Instant Demo Login** for quick testing and evaluation without typing credentials
  - User-isolated tasks and workspace

- **📋 Complete Task CRUD Operations**:
  - **Create**: Add new tasks with title, rich description, status, priority, category tag, and due date
  - **Read**: Browse tasks with real-time text search, status pills filtering, priority filtering, and multiple sort modes
  - **Update**: Edit task details, progress tasks through workflows (Pending ➔ In Progress ➔ Completed), or toggle completion status directly
  - **Delete**: Safe task removal protected by confirmation dialogs
  - **Celebration Confetti**: Dynamic confetti burst animation (`canvas-confetti`) whenever a task is completed!

- **📊 Dynamic Analytics & Metrics**:
  - 5 interactive KPI stat cards (Total Tasks, In Progress, Completed, Pending, Overdue)
  - Live completion velocity progress bar calculation

- **🎨 Two Rich Interactive Views**:
  - **Kanban Board**: 3-column drag-and-drop workflow (`Pending`, `In Progress`, `Completed`) with quick-action progress buttons
  - **Table / List View**: Clean, compact table view with completion checkboxes, category tags, priority pills, and quick actions

- **⚡ Real-Time WebSocket Synchronization**:
  - Socket.IO updates tasks live across multiple tabs and browser windows
  - Stackable Toast notifications alert active users of team updates

- **🌓 Sleek Modern Design**:
  - Curated Dark Mode (default) and Light Mode with instant toggle
  - Glassmorphic card surfaces, fluid typography (*Outfit* & *Inter*), and subtle micro-interactions
  - Fully responsive layout for desktop, tablet, and mobile screens

- **🛡️ Resilient Dual-Mode Database**:
  - Seamlessly connects to MongoDB if available via `MONGODB_URI`
  - Automatically falls back to a file-backed persistent JSON store (`server/data/store.json`) if MongoDB service is offline, guaranteeing **zero runtime crashes or setup roadblocks**!

---

## 🏗️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Lucide React, Canvas Confetti, Axios, Socket.IO Client, Vanilla CSS Tokens |
| **Backend** | Node.js, Express.js, Socket.IO, Mongoose, JWT, bcryptjs, CORS, Dotenv |
| **Database** | MongoDB / Mongoose with persistent local JSON store fallback |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Backend Setup
```bash
cd server
npm install
npm start
```
> The server will start on `http://localhost:5000`. If MongoDB is running locally or configured via `.env`, it connects automatically. Otherwise, it runs seamlessly in persistent fallback mode.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
> The Vite frontend will start on `http://localhost:5173`.

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in with email and password
- `POST /api/auth/demo` — Instant demo sign-in (1-click access)
- `GET /api/auth/me` — Retrieve current user profile (requires Bearer token)

### Tasks (`/api/tasks`) *(All require Bearer token)*
- `GET /api/tasks` — Retrieve tasks with query filters (`status`, `priority`, `search`, `sortBy`)
- `GET /api/tasks/stats` — Retrieve analytics counts and completion percentage
- `POST /api/tasks` — Create a new task
- `PUT /api/tasks/:id` — Update task details or status
- `DELETE /api/tasks/:id` — Delete a task

---

## 🧪 Running Automated Tests

Run the built-in end-to-end integration test suite:
```bash
cd server
node test_integration.js
```
