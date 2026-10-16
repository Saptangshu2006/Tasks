# TaskPulse - Complete Task Manager Application

A modern, production-grade MERN stack Task Tracking web application with full user authentication, interactive dashboard metrics, multi-criteria task filtering, search, and Kanban / List / Grid view modes.

---

## 🚀 Features

- **User Authentication**:
  - Secure registration and login using JWT (JSON Web Tokens) and bcrypt password hashing.
  - Persistent login session via `localStorage` with token validation on startup.
  - **1-Click Demo Login** button for instant testing without manual typing.
  - Protected API routes enforcing user ownership of tasks.

- **Rich Task Filtering & Search**:
  - **Text Search**: Real-time search across task titles and descriptions.
  - **Status Filtering**: Filter by `All`, `Pending`, `In Progress`, or `Completed`.
  - **Priority Filtering**: Filter by `All`, `High`, `Medium`, or `Low`.
  - **Due Date Filtering**: Filter by `All`, `Due Today`, `Upcoming`, or `Overdue`.
  - **Tag Filtering**: Dynamic tag dropdown populated with the user's active tags.
  - **Sorting**: Sort by Date Created, Due Date, Priority, or Title (Ascending & Descending).
  - **1-Click Reset**: Quickly clear active filters.

- **Multiple Dashboard Views**:
  - **Cards Grid View**: Rich cards showing priority badges, overdue warnings, quick status switcher, and tags.
  - **Kanban Board View**: Drag/move tasks across *Pending*, *In Progress*, and *Completed* columns.
  - **Compact List View**: Dense table view for high-efficiency task management.

- **Interactive Metric Statistics**:
  - Real-time counters for Total, Pending, In Progress, Completed, and Overdue tasks.
  - Click any metric card to filter directly by that status or overdue criteria.

- **Zero-Setup Database Architecture**:
  - Built-in automatic fallback to an **In-Memory MongoDB Server** when no external database is configured.
  - Supports standard local MongoDB (`mongodb://127.0.0.1:27017/taskmanager`) or MongoDB Atlas via `.env`.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React Icons |
| **Backend** | Node.js, Express.js, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, CORS |
| **Database** | MongoDB (Local / Atlas) with `mongodb-memory-server` zero-setup fallback |

---

## 📂 Project Structure

```
Tasks/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & in-memory fallback
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration, login, and profile
│   │   │   └── taskController.js     # Task CRUD, filters, search, and metrics
│   │   ├── middleware/
│   │   │   └── authMiddleware.js     # JWT verification middleware
│   │   ├── models/
│   │   │   ├── User.js               # User schema with bcrypt pre-save hook
│   │   │   └── Task.js               # Task schema with indexes
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth endpoints
│   │   │   └── taskRoutes.js         # /api/tasks endpoints
│   │   └── server.js                 # Express app initialization
│   ├── .env                          # Backend environment variables
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx         # Sign in / Register / 1-click Demo login
│   │   │   ├── CompactListView.jsx   # Dense table view
│   │   │   ├── DeleteConfirmModal.jsx# Delete confirmation modal
│   │   │   ├── KanbanView.jsx        # Kanban board view
│   │   │   ├── Navbar.jsx            # Top navigation bar
│   │   │   ├── TaskCard.jsx          # Individual task card
│   │   │   ├── TaskFilters.jsx       # Multi-criteria filter & search bar
│   │   │   ├── TaskFormModal.jsx     # Task create/edit modal
│   │   │   ├── TaskStats.jsx         # Interactive metric cards
│   │   │   └── Toast.jsx             # Notification toasts
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Authentication state & actions
│   │   ├── services/
│   │   │   └── api.js                # API client with auto auth header injection
│   │   ├── App.jsx                   # Main dashboard view
│   │   ├── index.css                 # Tailwind CSS styles
│   │   └── main.jsx                  # React application entry point
│   ├── vite.config.js                # Vite config with /api proxy to backend
│   └── package.json
├── package.json                      # Root workspace scripts (concurrent runner)
└── README.md
```

---

## ⚡ Quick Start

### 1. Run Both Frontend and Backend Concurrently (Recommended)

From the root project directory:

```bash
npm run dev
```

This starts:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:3000`

Open [http://localhost:3000](http://localhost:3000) in your browser!

### 2. Quick Testing Demo Account

On the login screen, click the **"1-Click Demo Login"** button to automatically log in as a demo user (`alex.morgan@example.com`). If it's your first time, click **"Load Sample Tasks"** to instantly populate the dashboard with realistic tasks across priorities and statuses!

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`)

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `5000` | Port for Express server |
| `MONGODB_URI` | *(empty)* | MongoDB URI. If empty, starts In-Memory MongoDB automatically! |
| `JWT_SECRET` | `dev_jwt_secret...` | Secret key for signing JWT tokens |
| `NODE_ENV` | `development` | Runtime environment |

To connect to a local MongoDB instance:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager
```

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Login with `email` and `password`, returns JWT |
| `GET` | `/api/auth/me` | Private | Get authenticated user profile |

### Tasks (`/api/tasks`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/tasks` | Private | List tasks with query filters (`status`, `priority`, `search`, `tag`, `dueFilter`, `sortBy`, `order`) |
| `GET` | `/api/tasks/stats` | Private | Get metric counts (total, pending, inProgress, completed, overdue, highPriority) |
| `GET` | `/api/tasks/:id` | Private | Get single task details |
| `POST` | `/api/tasks` | Private | Create a task (`title`, `description`, `status`, `priority`, `dueDate`, `tags`) |
| `PUT` | `/api/tasks/:id` | Private | Update task fields |
| `DELETE` | `/api/tasks/:id` | Private | Delete a task |
