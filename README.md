# TaskFlow — Team Task Manager

A full-stack collaborative **Team Task Management** web application built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). It features secure JWT authentication, role-based access control, a Kanban-style task board, and a real-time analytics dashboard.

---

## 🚀 Features

- **🔐 Secure Authentication** — Register & Login with JWT tokens and bcrypt password hashing
- **📊 Analytics Dashboard** — Live overview of your projects, assigned tasks, completed tasks, and overdue items
- **📁 Project Management** — Create projects, invite teammates by email, and manage your team
- **📋 Kanban Task Board** — Drag tasks across `To Do`, `In Progress`, and `Done` columns
- **👥 Role-Based Access Control (RBAC):**
  - **Admin** — Full CRUD on projects and tasks, can invite/remove members
  - **Member** — Can only update the status of tasks assigned to them
- **🗑️ Cascading Deletes** — Deleting a project automatically removes all associated tasks
- **📱 Responsive Design** — Works on desktop and mobile with a premium dark-mode UI

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v4, React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT), bcryptjs |
| **HTTP Client** | Axios |

---

## 📂 Project Structure

```
MERN Project/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── Layout.jsx       # Universal sidebar wrapper
│       │   └── PrivateRoute.jsx # Route guard for authenticated pages
│       ├── context/
│       │   └── AuthContext.jsx  # Global auth state & API layer
│       └── pages/
│           ├── Login.jsx
│           ├── Signup.jsx
│           ├── Dashboard.jsx
│           ├── Projects.jsx
│           └── ProjectBoard.jsx # Kanban board
│
└── server/                  # Node.js / Express backend
    ├── config/
    │   └── db.js                # MongoDB connection
    ├── controllers/
    │   ├── authController.js
    │   ├── projectController.js
    │   ├── taskController.js
    │   └── dashboardController.js
    ├── middleware/
    │   └── authMiddleware.js    # JWT protect middleware
    ├── models/
    │   ├── userModel.js
    │   ├── projectModel.js
    │   └── taskModel.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── projectRoutes.js
    │   ├── taskRoutes.js
    │   └── dashboardRoutes.js
    └── server.js
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/team-task-manager.git
cd team-task-manager
```

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
MONGO_URI=your_mongodb_connection_string_here
PORT=5000
JWT_SECRET=your_super_secret_key_here
```

> ⚠️ **Never commit your `.env` file to GitHub.** It is already excluded by `.gitignore`.

Start the backend server:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`

### 3. Configure the Frontend

Open a **new terminal window**:

```bash
cd client
npm install
npm run dev
```

The React app will be running at `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive a JWT token |

### Projects
| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/api/projects` | Get all your projects |
| `POST` | `/api/projects` | Create a new project |
| `PUT` | `/api/projects/:id/members` | Invite a teammate (Admin only) |
| `DELETE` | `/api/projects/:id` | Delete project + all tasks (Admin only) |

### Tasks
| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/api/tasks/project/:projectId` | Get all tasks for a project |
| `POST` | `/api/tasks/project/:projectId` | Create a task (Admin only) |
| `PUT` | `/api/tasks/:id` | Update task (Admin: full update, Member: status only) |
| `DELETE` | `/api/tasks/:id` | Delete a task (Admin only) |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Get aggregated analytics for the logged-in user |

---

## 🎯 How to Use

1. **Register** an account to become an Admin.
2. Go to **My Projects** and create your first project.
3. Click **Invite Teammate** and enter a registered user's email.
4. Click **Add Task**, fill in the title, priority, and assign it to a teammate.
5. Your teammate logs in and sees their assigned task on the board.
6. They update the task status to **Done** — the dashboard analytics update automatically!

---

## 👨‍💻 Author

**Prince** — Full Stack Developer  
Built as part of a MERN Stack Development assignment.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
