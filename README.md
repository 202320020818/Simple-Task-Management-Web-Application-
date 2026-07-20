# 📋 TaskFlow - Simple Task Management Web Application


https://simple-task-management-web-applicat-chi.vercel.app/

A modern and responsive **Full-Stack Task Management Web Application** developed as an individual assignment. This application enables users to efficiently organize and manage their daily tasks with an intuitive interface and secure data storage using **MongoDB Atlas**.

---

## ✨ Features

- ➕ Create tasks with:
  - Title
  - Description
  - Priority (High, Medium, Low)
  - Due Date

- 📋 View all tasks in a clean and organized layout

- ✏️ Edit existing tasks

- 🗑️ Delete tasks

- 🔄 Update task status
  - Pending
  - In Progress
  - Completed

- 🔍 Filter tasks by:
  - Priority
  - Status

- ✅ Required field validation

- 📱 Fully responsive design for desktop and mobile devices

- ☁️ Persistent data storage using MongoDB Atlas

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- CSS3
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/202320020818/Simple-Task-Management-Web-Application-.git
```

```bash
cd Simple-Task-Management-Web-Application-
```

---

### 2️⃣ Configure Environment Variables

Navigate to the backend folder.

```bash
cd backend
```

Copy the example environment file.

```powershell
Copy-Item .env.example .env
```

Update the `.env` file with your MongoDB Atlas connection string.

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

---

### 3️⃣ Install Backend Dependencies

```bash
npm install
```

Run the backend server.

```bash
npm run dev
```

---

### 4️⃣ Install Frontend Dependencies

Open another terminal.

```bash
cd frontend
```

```bash
npm install
```

Run the frontend.

```bash
npm run dev
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update task details |
| PATCH | `/api/tasks/:id/status` | Update task status |
| DELETE | `/api/tasks/:id` | Delete a task |

---

## 👨‍💻 Author

**Eshan Harshana**

GitHub: https://github.com/202320020818

---

## 📄 License

This project was developed for educational purposes as an individual assignment.
