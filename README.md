# ExpenseShare - Full Stack Expense Splitting Application

ExpenseShare is a robust full-stack web application designed to simplify the process of sharing expenses with friends, roommates, and travel buddies. Inspired by Splitwise, it features a powerful "Simplified Debt" algorithm that minimizes the number of transactions required to settle up within a group.

## Technology Stack

### Frontend (Client)
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /><br>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /><br>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /><br>
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" /><br>
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" /><br>
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" /><br>
  <img src="https://img.shields.io/badge/Axios-007AFF?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
</p>

### Backend (Server)
<p align="left">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /><br>
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" /><br>
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /><br>
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
</p>

## Project Structure

This project is organized as a monorepo with separate directories for the client and server.

```text
ExpenseShare/
├── backend/                # Server-side logic and Database interaction
│   ├── config/             # DB Connection setup
│   ├── controllers/        # Request handling logic
│   ├── models/             # Database Schemas
│   ├── routes/             # API Endpoint definitions
│   └── server.js           # Server entry point
│
├── client/                 # Client-side user interface
│   ├── src/
│   │   ├── components/     # UI Components (Forms, Dashboards)
│   │   ├── services/       # API integration
│   │   └── App.jsx         # Main React component
│   └── vite.config.js      # Build configuration
│
└── README.md               # Project documentation (You are here)
```

## How to Run the Application

You need to run both the **Backend** and the **Client** simultaneously in separate terminals.

### 1. Start the Backend Server
The backend connects to MongoDB and serves the API on Port 5001.

```bash
# Open a terminal in the root folder
cd backend

# Install dependencies (first time only)
npm install

# Start the server
npm run dev
```
*Expected Output: `Server running in development mode on port 5001`*

### 2. Start the Client Application
The client powers the user interface and runs on a separate port (usually 5173).

```bash
# Open a NEW terminal in the root folder
cd client

# Install dependencies (first time only)
npm install

# Start the frontend
npm run dev
```
*Expected Output: `Local: http://localhost:5173/`*

### 3. Usage
Open your browser and visit the URL shown in the Client terminal (e.g., `http://localhost:5173`). You can now Register, Create Groups, and Share Expenses!
