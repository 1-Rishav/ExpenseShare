<p align="center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" alt="Express Logo" width="80" height="80"/>
</p>

<h1 align="center">💰 ExpenseShare Backend</h1>

<p align="center">
  <strong>A robust RESTful API server for expense tracking, group management, and intelligent debt simplification</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-9.0.2-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
</p>

---

## 📖 Description

ExpenseShare Backend is a Node.js/Express server that powers the ExpenseShare application. It provides a complete RESTful API for managing users, groups, expenses, and implements an intelligent **Min-Cash-Flow Algorithm** to simplify debts between group members.

The server features:
- **RESTful API Architecture** with clean separation of concerns
- **MongoDB Database** with Mongoose ODM for data modeling
- **Debt Simplification Algorithm** to minimize transactions
- **Multiple Split Types** (Equal, Exact, Percentage)
- **Settlement Processing** for recording payments
- **CORS Enabled** for cross-origin requests

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center" width="120">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" width="48" height="48" alt="Node.js" />
      <br><strong>Node.js</strong>
      <br><sub>Runtime</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" width="48" height="48" alt="Express" />
      <br><strong>Express 5</strong>
      <br><sub>Web Framework</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" width="48" height="48" alt="MongoDB" />
      <br><strong>MongoDB</strong>
      <br><sub>Database</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongoose/mongoose-original.svg" width="48" height="48" alt="Mongoose" />
      <br><strong>Mongoose 9</strong>
      <br><sub>ODM</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodemon/nodemon-original.svg" width="48" height="48" alt="Nodemon" />
      <br><strong>Nodemon</strong>
      <br><sub>Dev Server</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/dotenv/dotenv-original.svg" width="48" height="48" alt="Dotenv" />
      <br><strong>Dotenv</strong>
      <br><sub>Environment</sub>
    </td>
  </tr>
</table>

---

## 📁 Project Structure

```
backend/
│
├── 📂 config/                      # Configuration files
│   └── db.js                       # 🔌 MongoDB connection setup
│
├── 📂 controllers/                 # Business logic layer
│   ├── expenseController.js        # 💰 Expense & balance logic
│   ├── groupController.js          # 👥 Group CRUD operations
│   └── userController.js           # 👤 User auth & management
│
├── 📂 models/                      # Database schemas
│   ├── Expense.js                  # 📝 Expense schema with splits
│   ├── Group.js                    # 🏠 Group schema with members
│   └── User.js                     # 👤 User schema
│
├── 📂 routes/                      # API route definitions
│   ├── expenseRoutes.js            # 💵 /api/expenses routes
│   ├── groupRoutes.js              # 👥 /api/groups routes
│   └── userRoutes.js               # 👤 /api/users routes
│
├── .env                            # 🔐 Environment variables
├── .gitignore                      # 📋 Git ignore rules
├── ARCHITECTURE.md                 # 📐 System design document
├── package.json                    # 📦 Dependencies & scripts
├── README.md                       # 📖 This file
└── server.js                       # 🚀 Application entry point
```

---

## 📊 Database Models

### 👤 User Model (`models/User.js`)

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated unique identifier |
| `name` | String | User's full name (required) |
| `email` | String | User's email address (required, unique) |
| `createdAt` | Date | Timestamp of creation |
| `updatedAt` | Date | Timestamp of last update |

### 👥 Group Model (`models/Group.js`)

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated unique identifier |
| `name` | String | Group name (required) |
| `members` | [ObjectId] | Array of User references |
| `createdAt` | Date | Timestamp of creation |
| `updatedAt` | Date | Timestamp of last update |

### 💰 Expense Model (`models/Expense.js`)

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated unique identifier |
| `description` | String | Expense description (required) |
| `amount` | Number | Total expense amount (required) |
| `payer` | ObjectId | Reference to User who paid |
| `group` | ObjectId | Reference to Group |
| `splitType` | Enum | `EQUAL`, `EXACT`, or `PERCENTAGE` |
| `splits` | Array | Split details per user |
| `splits.user` | ObjectId | Reference to User |
| `splits.amount` | Number | Calculated amount owed |
| `splits.percentage` | Number | Percentage (for PERCENTAGE type) |
| `date` | Date | Expense date |
| `createdAt` | Date | Timestamp of creation |
| `updatedAt` | Date | Timestamp of last update |

---

## 🔌 API Endpoints

### 👤 User Routes (`/api/users`)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/api/users` | Register new user | `{ name, email }` |
| `GET` | `/api/users` | Get all users | - |
| `POST` | `/api/users/login` | Login user | `{ email }` |

### 👥 Group Routes (`/api/groups`)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/api/groups` | Create new group | `{ name, members[] }` |
| `GET` | `/api/groups` | Get all groups | Query: `?userId=` |
| `GET` | `/api/groups/:id` | Get single group | - |

### 💰 Expense Routes (`/api/expenses`)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/api/expenses` | Add new expense | `{ description, amount, payer, group, splitType, splits[] }` |
| `GET` | `/api/expenses/group/:groupId` | Get group expenses | - |
| `GET` | `/api/expenses/group/:groupId/balance` | Get simplified balances | - |
| `POST` | `/api/expenses/settle` | Settle a debt | `{ payer, receiver, amount, group }` |

---

## 🧠 Debt Simplification Algorithm

The backend implements a **Min-Cash-Flow Algorithm** to minimize the number of transactions needed to settle all debts.

### How It Works

```
Step 1: Calculate Net Balances
─────────────────────────────────
For each expense:
  • Payer gets +amount (is owed)
  • Each split user gets -splitAmount (owes)

Example: Alice pays $100 for (Alice, Bob, Carol, Dave)
  • Alice: +$75 (paid $100, owes $25)
  • Bob:   -$25
  • Carol: -$25
  • Dave:  -$25

Step 2: Simplify Debts (Greedy Approach)
─────────────────────────────────────────
1. Find Max Debtor (owes most)
2. Find Max Creditor (owed most)
3. Transfer min(|debtor|, |creditor|)
4. Update balances
5. Repeat until all settled

Result: Minimum number of transactions!
```

### Algorithm Complexity

| Operation | Time Complexity |
|-----------|-----------------|
| Net Balance Calculation | O(N × M) |
| Debt Simplification | O(U²) worst case |

Where: N = expenses, M = users per expense, U = total users

---

## ⚙️ Controllers Overview

### 👤 userController.js

| Function | Route | Description |
|----------|-------|-------------|
| `registerUser` | POST /api/users | Creates new user with validation |
| `getUsers` | GET /api/users | Returns all registered users |
| `loginUser` | POST /api/users/login | Simulated email-based login |

### 👥 groupController.js

| Function | Route | Description |
|----------|-------|-------------|
| `createGroup` | POST /api/groups | Creates group with members |
| `getGroups` | GET /api/groups | Returns groups (filterable by userId) |
| `getGroup` | GET /api/groups/:id | Returns single group with populated members |

### 💰 expenseController.js

| Function | Route | Description |
|----------|-------|-------------|
| `addExpense` | POST /api/expenses | Creates expense with split validation |
| `getGroupExpenses` | GET /api/expenses/group/:groupId | Returns all expenses for a group |
| `getGroupBalance` | GET /api/expenses/group/:groupId/balance | Returns simplified debt graph |
| `settleDebt` | POST /api/expenses/settle | Records settlement transaction |

---

## ✨ Key Features

### 💳 Split Types

| Type | Description | Validation |
|------|-------------|------------|
| **EQUAL** | Split equally among all members | Auto-calculated |
| **EXACT** | Specify exact amounts per person | Sum must equal total |
| **PERCENTAGE** | Split by percentage | Must total 100% |

### 🔒 Data Validation

- Duplicate email prevention for users
- Split amount validation for EXACT type
- Percentage total validation for PERCENTAGE type
- Float precision handling (0.01 threshold)

### 🔄 Settlement Processing

Settlements are recorded as special expenses:
- Description: "Settlement"
- Split Type: EXACT
- Single split to receiver

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **MongoDB** (local or Atlas connection)

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the `backend` folder:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/expenseshare
NODE_ENV=development
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | 5001 |
| `MONGO_URI` | MongoDB connection string | localhost |
| `NODE_ENV` | Environment mode | development |

### Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start at `http://localhost:5001`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with Nodemon |

---

## 🧪 API Testing

### Test with cURL

**Register User:**
```bash
curl -X POST http://localhost:5001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

**Create Group:**
```bash
curl -X POST http://localhost:5001/api/groups \
  -H "Content-Type: application/json" \
  -d '{"name": "Trip to Vegas", "members": ["userId1", "userId2"]}'
```

**Add Expense:**
```bash
curl -X POST http://localhost:5001/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Hotel",
    "amount": 400,
    "payer": "userId1",
    "group": "groupId",
    "splitType": "EQUAL",
    "splits": [{"user": "userId1"}, {"user": "userId2"}]
  }'
```

**Get Simplified Balances:**
```bash
curl http://localhost:5001/api/expenses/group/{groupId}/balance
```

---

## 📐 Architecture

For detailed system design and architecture decisions, see [ARCHITECTURE.md](./ARCHITECTURE.md).

Key design decisions:
- **MongoDB** chosen for flexible expense document structure
- **Normalized splits** stored with calculated amounts for query efficiency
- **Greedy algorithm** for debt simplification (optimal for most cases)

---

## 🔧 Configuration Files

### server.js
```javascript
// Entry point - configures Express app
// - JSON body parsing
// - CORS middleware
// - Route mounting
// - Server startup
```

### config/db.js
```javascript
// MongoDB connection using Mongoose
// - Connection string from environment
// - Error handling with process exit
// - Connection success logging
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ using Node.js + Express + MongoDB
</p>
