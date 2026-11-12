# TaskFlow — Modern Task Management Application (Official Browser Edition)

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=flat&logo=github)](https://github.com/GandikotiRavi/Task-Management-Application)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff.svg)](https://vitejs.dev/)

A full-stack, responsive, high-performance Task Management web application featuring an **Official Browser-Style Interface** (modeled after Chrome, Edge, and Arc), interactive **Kanban Board** with drag & drop, **Sprint Velocity Analytics**, real-time **WebSocket Synchronization**, and a **100% Zero-Crash Resilient Dual Engine** (full-stack REST API with instant local persistent fallback).

---

## 🌟 What's New in the Official Browser Edition

- **🌐 Authentic Official Browser Window Chrome**:
  - **Window Titlebar & Traffic Lights**: Red, yellow, green window controls and workspace brand tag.
  - **Curved Browser Tab Bar**: Realistic browser tabs (*Kanban Board*, *Table List*, *Sprint Analytics*, *Urgent Tasks*) with favicons, live task counters, tab close buttons, and `+` New Tab button.
  - **Dynamic Omnibox & Navigation Bar**:
    - Back, Forward, Reload (with spinning sync animation), and Home buttons.
    - Security padlock with verified HTTPS TLS 1.3 indicator.
    - Dynamic URL display that synchronizes live with your active view, filters, and searches (e.g. `https://taskflow.internal.net/sprint-14?view=board&priority=Urgent`).
    - Integrated real-time search input directly inside the address bar with `Ctrl+K` shortcut support.
    - Bookmark star, share link copier, and shield security indicators.
  - **Browser Bookmarks Toolbar**:
    - Instant 1-click filter bookmarks (*⭐ All Tasks*, *🔥 Urgent Only*, *⏳ In Progress*, *✅ Completed*, *🏷️ Frontend*, *🏷️ Backend*, *🏷️ Architecture*, *🏷️ Design*, *🏷️ Testing*, *📊 Analytics Report*).

- **🛡️ 100% Resilient Dual Engine (Always Working)**:
  - **Online Mode**: Full-stack REST API (`Express.js`, `MongoDB` / `store.json`) with live `Socket.IO` broadcasts across multiple client tabs.
  - **Local Workspace Fallback**: If the backend server is offline or unavailable, the application automatically falls back to an intelligent client-side `localStorage` engine. Demo login, registration, task creation, editing, status toggling, and subtask checklists continue to function seamlessly with **zero crashes or roadblocks**.

- **📊 Dedicated Sprint Analytics & Velocity Dashboard**:
  - Live completion velocity gauge with visual progress bar.
  - 5 KPI metric cards (Total Tasks, Active Work, Completed, Urgent Priority, Overdue).
  - Allocation breakdown by category tags with color-coded meters.
  - Priority distribution matrix (Urgent, High, Medium, Low).
  - Actionable priority watch-list for urgent and overdue items.

- **🎨 Multi-View Engineering Workspace**:
  - **Interactive Kanban Board**: 3 workflow columns (*Pending*, *In Progress*, *Completed*) with HTML5 drag-and-drop, quick inline task creation, and celebration confetti on completion.
  - **Table / List View**: Clean, compact table view with completion checkboxes, category tags, priority pills, and due dates.
  - **Slide-Over Task Inspector Drawer**: Linear-grade detail drawer for updating descriptions, checking off subtasks, and managing metadata.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Lucide React, Canvas Confetti, Axios, Socket.IO Client, Pure CSS Tokens |
| **Interface** | Official Browser Chrome (Tabs, Omnibox, Bookmarks, Window Controls) |
| **Backend** | Node.js (v18+), Express.js, Socket.IO, Mongoose, JWT, bcryptjs, CORS |
| **Database** | MongoDB with automatic persistent JSON file fallback (`server/data/store.json`) |
| **Client Engine** | Resilient Dual Mode (REST API + LocalStorage Synchronization) |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Single-Command Development (Root)
From the repository root folder:
```bash
# Install all dependencies (both client and server)
npm run install:all

# Launch both server and client concurrently
npm run dev
```

- **Frontend (Vite)**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

### 3. Alternative: Running Individual Services

**Run Backend Only:**
```bash
cd server
npm install
npm start
```

**Run Frontend Only:**
```bash
cd client
npm install
npm run dev
```
> *Tip: Even when running the frontend alone, the resilient local engine ensures demo accounts, task CRUD, and analytics work immediately!*

### 4. Production Build & Start
```bash
# Build the React production bundle into client/dist
npm run build

# Start the unified production server
npm start
```
The server will automatically serve the built client application and API on `http://localhost:5000`.

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create a new account
- `POST /api/auth/login` — Sign in with email and password
- `POST /api/auth/demo` — 1-Click instant demo sign-in
- `GET /api/auth/me` — Retrieve authenticated user profile (Bearer token required)

### Tasks (`/api/tasks`) *(Bearer token required)*
- `GET /api/tasks` — Retrieve tasks with query filters (`status`, `priority`, `category`, `search`, `sortBy`)
- `GET /api/tasks/stats` — Retrieve sprint analytics and velocity metrics
- `POST /api/tasks` — Create a new task
- `PUT /api/tasks/:id` — Update task details, subtasks, or workflow status
- `DELETE /api/tasks/:id` — Delete a task

### Health Check
- `GET /api/health` — Retrieve system and API health status

---

## 🧪 Testing

Run the automated integration test suite:
```bash
node server/test_integration.js
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
Created and maintained by [Gandikoti Ravi](https://github.com/GandikotiRavi/Task-Management-Application).
