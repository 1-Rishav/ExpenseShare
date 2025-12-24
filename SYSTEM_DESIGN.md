# ExpenseShare - System Design Document

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Technology Stack Analysis](#3-technology-stack-analysis)
4. [Database Design & Data Modeling](#4-database-design--data-modeling)
5. [API Architecture & Design Patterns](#5-api-architecture--design-patterns)
6. [Core Algorithm: Debt Simplification](#6-core-algorithm-debt-simplification)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Data Flow & State Management](#8-data-flow--state-management)
9. [Security Architecture](#9-security-architecture)
10. [Performance Considerations](#10-performance-considerations)
11. [Scalability Analysis](#11-scalability-analysis)
12. [Future Roadmap](#12-future-roadmap)

---

## 1. Executive Summary

### 1.1 Problem Statement
ExpenseShare addresses the "Roommate's Dilemma" - the challenge of accurately tracking shared costs among groups and determining the most efficient way to settle debts. Without optimization, debt graphs become complex, leading to unnecessary transactions and confusion.

### 1.2 Solution Overview
A full-stack web application that enables:
- **Group-based expense tracking** for trips, roommates, or events
- **Flexible expense splitting** (Equal, Exact, Percentage)
- **Intelligent debt simplification** using Min-Cash-Flow algorithm
- **Streamlined settlement processing** with 2-step confirmation

### 1.3 Key Metrics
| Metric | Value |
|--------|-------|
| Architecture | Monolithic (Client-Server) |
| Database | MongoDB (NoSQL) |
| API Style | RESTful |
| Authentication | Session-based (LocalStorage) |
| Deployment | Vercel (Client) + Render (Backend) |

---

## 2. System Architecture Overview

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              EXPENSESHARE ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           CLIENT LAYER                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │   │
│  │  │  Landing    │  │  Dashboard  │  │   Group     │  │   Profile   │    │   │
│  │  │   Page      │  │  (GroupList)│  │  Details    │  │    View     │    │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │   │
│  │                                                                         │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │                    React 19 + Vite 7                             │   │   │
│  │  │  • Framer Motion (Animations)  • Tailwind CSS 4 (Styling)       │   │   │
│  │  │  • React Router 7 (Navigation) • Axios (HTTP Client)            │   │   │
│  │  │  • GSAP (Advanced Animations)  • Lucide React (Icons)           │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                                      │ HTTPS (REST API)                         │
│                                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           SERVER LAYER                                   │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │                     Express.js 5 Server                          │   │   │
│  │  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │   │   │
│  │  │  │ User Routes   │  │ Group Routes  │  │Expense Routes │        │   │   │
│  │  │  │ /api/users    │  │ /api/groups   │  │ /api/expenses │        │   │   │
│  │  │  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘        │   │   │
│  │  │          │                  │                  │                 │   │   │
│  │  │  ┌───────▼───────┐  ┌───────▼───────┐  ┌───────▼───────┐        │   │   │
│  │  │  │    User       │  │    Group      │  │   Expense     │        │   │   │
│  │  │  │  Controller   │  │  Controller   │  │  Controller   │        │   │   │
│  │  │  └───────────────┘  └───────────────┘  └───────────────┘        │   │   │
│  │  │                              │                                   │   │   │
│  │  │                    ┌─────────▼─────────┐                         │   │   │
│  │  │                    │  Debt Simplifier  │                         │   │   │
│  │  │                    │    Algorithm      │                         │   │   │
│  │  │                    └───────────────────┘                         │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                                      │ Mongoose ODM                             │
│                                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           DATA LAYER                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │                      MongoDB Atlas                               │   │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │   │   │
│  │  │  │   Users     │  │   Groups    │  │  Expenses   │              │   │   │
│  │  │  │ Collection  │◄─┤ Collection  │◄─┤ Collection  │              │   │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘              │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Interaction Flow
```
User Action → React Component → API Service (Axios) → Express Route → Controller → Mongoose Model → MongoDB
                                                                           ↓
User Interface ← React State Update ← API Response ← Controller Response ←─┘
```

### 2.3 Directory Structure
```
ExpenseShare/
├── backend/                          # Node.js/Express Server
│   ├── config/
│   │   └── db.js                     # MongoDB connection configuration
│   ├── controllers/
│   │   ├── userController.js         # User business logic
│   │   ├── groupController.js        # Group CRUD operations
│   │   └── expenseController.js      # Expense & balance calculations
│   ├── models/
│   │   ├── User.js                   # User schema definition
│   │   ├── Group.js                  # Group schema with member refs
│   │   └── Expense.js                # Expense schema with splits
│   ├── routes/
│   │   ├── userRoutes.js             # /api/users endpoints
│   │   ├── groupRoutes.js            # /api/groups endpoints
│   │   └── expenseRoutes.js          # /api/expenses endpoints
│   ├── server.js                     # Application entry point
│   └── package.json                  # Backend dependencies
│
├── client/                           # React/Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx       # Public landing with GSAP
│   │   │   ├── Login.jsx             # Authentication UI
│   │   │   ├── CreateUser.jsx        # Registration form
│   │   │   ├── GroupList.jsx         # Dashboard with stats
│   │   │   ├── CreateGroup.jsx       # Group creation wizard
│   │   │   ├── GroupDetails.jsx      # Expense management
│   │   │   ├── AddExpense.jsx        # Expense form with splits
│   │   │   └── Profile.jsx           # User profile & settlements
│   │   ├── services/
│   │   │   └── api.js                # Axios API functions
│   │   ├── App.jsx                   # Root component & routing
│   │   ├── main.jsx                  # Application bootstrap
│   │   └── index.css                 # Global styles & animations
│   └── package.json                  # Frontend dependencies
│
├── README.md                         # Project documentation
└── SYSTEM_DESIGN.md                  # This document
```

---

## 3. Technology Stack Analysis

### 3.1 Frontend Stack

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **React** | 19.2.0 | UI Library | Latest stable with concurrent features, improved performance |
| **Vite** | 7.2.4 | Build Tool | Lightning-fast HMR, native ESM support, optimized builds |
| **Tailwind CSS** | 4.1.18 | Styling | Utility-first approach, JIT compilation, design consistency |
| **Framer Motion** | 12.23.26 | Animations | Declarative animations, gesture support, layout animations |
| **GSAP** | 3.14.2 | Advanced Animations | Timeline control, scroll triggers, complex sequences |
| **React Router** | 7.11.0 | Navigation | Nested routes, data loading, type-safe navigation |
| **Axios** | 1.13.2 | HTTP Client | Interceptors, request/response transformation, error handling |
| **Lucide React** | 0.562.0 | Icons | Tree-shakeable, consistent design, TypeScript support |
| **React Toastify** | 11.0.5 | Notifications | Customizable toasts, promise support, accessibility |

### 3.2 Backend Stack

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Node.js** | 18+ | Runtime | Event-driven, non-blocking I/O, large ecosystem |
| **Express** | 5.2.1 | Web Framework | Minimal, flexible, middleware architecture |
| **MongoDB** | - | Database | Document-oriented, flexible schema, horizontal scaling |
| **Mongoose** | 9.0.2 | ODM | Schema validation, middleware hooks, population |
| **dotenv** | 17.2.3 | Configuration | Environment variable management |
| **cors** | 2.8.5 | Security | Cross-origin resource sharing middleware |
| **nodemon** | 3.1.11 | Development | Auto-restart on file changes |

### 3.3 Technology Decision Matrix

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                        TECHNOLOGY SELECTION RATIONALE                          │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  Database: MongoDB vs PostgreSQL                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ ✓ MongoDB Selected                                                       │  │
│  │   • Flexible schema for variable splits array                            │  │
│  │   • Document structure matches expense data model                        │  │
│  │   • Easy horizontal scaling for future growth                            │  │
│  │   • Native JSON support reduces serialization overhead                   │  │
│  │                                                                          │  │
│  │ ✗ PostgreSQL Rejected                                                    │  │
│  │   • Rigid schema requires complex joins for splits                       │  │
│  │   • Additional complexity for variable-length arrays                     │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  Frontend Framework: React vs Vue vs Svelte                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ ✓ React Selected                                                         │  │
│  │   • Largest ecosystem and community support                              │  │
│  │   • Excellent animation library support (Framer Motion)                  │  │
│  │   • React 19 concurrent features for better UX                           │  │
│  │   • Strong TypeScript integration path                                   │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  Build Tool: Vite vs Webpack vs Parcel                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ ✓ Vite Selected                                                          │  │
│  │   • Native ESM for instant server start                                  │  │
│  │   • Sub-second HMR updates                                               │  │
│  │   • Optimized production builds with Rollup                              │  │
│  │   • First-class Tailwind CSS integration                                 │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Database Design & Data Modeling

### 4.1 Entity Relationship Diagram
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA DESIGN                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐   │
│  │     USERS       │         │     GROUPS      │         │    EXPENSES     │   │
│  ├─────────────────┤         ├─────────────────┤         ├─────────────────┤   │
│  │ _id: ObjectId   │◄────────│ members: [Ref]  │         │ _id: ObjectId   │   │
│  │ name: String    │         │ _id: ObjectId   │◄────────│ group: Ref      │   │
│  │ email: String   │◄────────│ name: String    │         │ payer: Ref      │───┤   │
│  │ createdAt: Date │         │ createdAt: Date │         │ description: Str│   │
│  │ updatedAt: Date │         │ updatedAt: Date │         │ amount: Number  │   │
│  └─────────────────┘         └─────────────────┘         │ splitType: Enum │   │
│          ▲                                               │ splits: [       │   │
│          │                                               │   {user: Ref,   │   │
│          │                                               │    amount: Num, │   │
│          └───────────────────────────────────────────────│    percentage}] │   │
│                                                          │ date: Date      │   │
│                                                          │ timestamps      │   │
│                                                          └─────────────────┘   │
│                                                                                 │
│  RELATIONSHIPS:                                                                 │
│  • User ←──1:N──→ Group (via members array)                                    │
│  • Group ←──1:N──→ Expense (via group reference)                               │
│  • User ←──1:N──→ Expense (via payer reference)                                │
│  • User ←──1:N──→ Expense.splits (via user reference in splits array)          │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Collection Schemas

#### Users Collection
```javascript
{
  _id: ObjectId,           // Auto-generated unique identifier
  name: String,            // Required - User's display name
  email: String,           // Required, Unique - Authentication identifier
  createdAt: Date,         // Auto-managed timestamp
  updatedAt: Date          // Auto-managed timestamp
}

// Indexes: { email: 1 } (unique)
```

#### Groups Collection
```javascript
{
  _id: ObjectId,           // Auto-generated unique identifier
  name: String,            // Required - Group name (e.g., "Vegas Trip")
  members: [ObjectId],     // Array of User references
  createdAt: Date,         // Auto-managed timestamp
  updatedAt: Date          // Auto-managed timestamp
}

// Indexes: { members: 1 } (for user-based queries)
```

#### Expenses Collection
```javascript
{
  _id: ObjectId,           // Auto-generated unique identifier
  description: String,     // Required - Expense description
  amount: Number,          // Required - Total expense amount
  payer: ObjectId,         // Required - Reference to User who paid
  group: ObjectId,         // Required - Reference to Group
  splitType: String,       // Enum: 'EQUAL' | 'EXACT' | 'PERCENTAGE'
  splits: [{
    user: ObjectId,        // Reference to User
    amount: Number,        // Calculated/explicit amount owed
    percentage: Number     // Optional - For percentage splits
  }],
  date: Date,              // Expense date (default: now)
  createdAt: Date,         // Auto-managed timestamp
  updatedAt: Date          // Auto-managed timestamp
}

// Indexes: { group: 1 }, { payer: 1 }, { date: -1 }
```

### 4.3 Design Decisions

#### Decision 1: Ledger Model vs Balance Storage
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    LEDGER MODEL ARCHITECTURE DECISION                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  OPTION A: Store Current Balance (Rejected)                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  User: { balance: 150.00 }                                               │   │
│  │                                                                          │   │
│  │  Problems:                                                               │   │
│  │  • Race conditions when multiple expenses added simultaneously           │   │
│  │  • Balance drift over time due to floating-point errors                  │   │
│  │  • No audit trail - cannot reconstruct how balance was reached           │   │
│  │  • Complex rollback logic for expense deletion                           │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  OPTION B: Ledger Model (Selected) ✓                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  Expenses: [{ payer: A, splits: [...] }, { payer: B, splits: [...] }]   │   │
│  │  Balance = Σ(paid) - Σ(owed) calculated on-demand                        │   │
│  │                                                                          │   │
│  │  Benefits:                                                               │   │
│  │  • 100% data consistency - balance always accurate                       │   │
│  │  • Complete audit trail - every transaction recorded                     │   │
│  │  • Simple expense deletion - just remove document                        │   │
│  │  • No race conditions - append-only operations                           │   │
│  │                                                                          │   │
│  │  Trade-off: Read performance (acceptable for typical group sizes)        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### Decision 2: Normalized vs Embedded Splits
```
Selected: Store calculated amounts in splits array

Rationale:
• EQUAL splits: amount = total / members.length (calculated once)
• PERCENTAGE splits: amount = total * percentage / 100 (calculated once)
• EXACT splits: amount provided directly

Storing calculated amounts enables:
• Efficient balance queries without re-running split logic
• Historical accuracy even if split logic changes
• Simpler aggregation pipelines
```

---

## 5. API Architecture & Design Patterns

### 5.1 RESTful API Design

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API ENDPOINT MAP                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  BASE URL: http://localhost:5001/api                                            │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  USER ENDPOINTS (/api/users)                                             │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  POST   /api/users          Register new user                            │   │
│  │         Body: { name, email }                                            │   │
│  │         Response: { _id, name, email }                                   │   │
│  │                                                                          │   │
│  │  GET    /api/users          Get all users                                │   │
│  │         Response: [{ _id, name, email, createdAt }]                      │   │
│  │                                                                          │   │
│  │  POST   /api/users/login    Authenticate user (email-based)              │   │
│  │         Body: { email }                                                  │   │
│  │         Response: { _id, name, email }                                   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  GROUP ENDPOINTS (/api/groups)                                           │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  POST   /api/groups         Create new group                             │   │
│  │         Body: { name, members: [userId, ...] }                           │   │
│  │         Response: { _id, name, members, createdAt }                      │   │
│  │                                                                          │   │
│  │  GET    /api/groups         Get groups (filterable)                      │   │
│  │         Query: ?userId=xxx (optional filter)                             │   │
│  │         Response: [{ _id, name, members: [{name, email}] }]              │   │
│  │                                                                          │   │
│  │  GET    /api/groups/:id     Get single group with populated members      │   │
│  │         Response: { _id, name, members: [{_id, name, email}] }           │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  EXPENSE ENDPOINTS (/api/expenses)                                       │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  POST   /api/expenses                    Add new expense                 │   │
│  │         Body: { description, amount, payer, group, splitType, splits }   │   │
│  │         Validation: EXACT sum = amount, PERCENTAGE sum = 100             │   │
│  │         Response: { _id, description, amount, payer, splits, ... }       │   │
│  │                                                                          │   │
│  │  GET    /api/expenses/group/:groupId     Get group expenses              │   │
│  │         Response: [{ _id, description, amount, payer: {name}, ... }]     │   │
│  │                                                                          │   │
│  │  GET    /api/expenses/group/:groupId/balance   Get simplified balances   │   │
│  │         Response: [{ from: {id, name}, to: {id, name}, amount }]         │   │
│  │         Algorithm: Min-Cash-Flow debt simplification                     │   │
│  │                                                                          │   │
│  │  POST   /api/expenses/settle             Record debt settlement          │   │
│  │         Body: { payer, receiver, amount, group }                         │   │
│  │         Creates: Settlement expense with EXACT split                     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Controller Architecture Pattern

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         MVC PATTERN IMPLEMENTATION                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Request Flow:                                                                  │
│                                                                                 │
│  HTTP Request                                                                   │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │   Express   │────▶│   Router    │────▶│ Controller  │────▶│   Model     │   │
│  │  Middleware │     │  (Routes)   │     │  (Logic)    │     │ (Mongoose)  │   │
│  └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘   │
│       │                                         │                   │           │
│       │ CORS, JSON                              │ Business          │ Database  │
│       │ Parsing                                 │ Logic             │ Operations│
│       │                                         │                   │           │
│       ▼                                         ▼                   ▼           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          MongoDB Database                                │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Request/Response Examples

#### Add Expense Request
```json
// POST /api/expenses
{
  "description": "Hotel for Vegas Trip",
  "amount": 400,
  "payer": "64a1b2c3d4e5f6g7h8i9j0k1",
  "group": "64a1b2c3d4e5f6g7h8i9j0k2",
  "splitType": "EQUAL",
  "splits": [
    { "user": "64a1b2c3d4e5f6g7h8i9j0k1" },
    { "user": "64a1b2c3d4e5f6g7h8i9j0k3" },
    { "user": "64a1b2c3d4e5f6g7h8i9j0k4" },
    { "user": "64a1b2c3d4e5f6g7h8i9j0k5" }
  ]
}

// Response (201 Created)
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k6",
  "description": "Hotel for Vegas Trip",
  "amount": 400,
  "payer": "64a1b2c3d4e5f6g7h8i9j0k1",
  "group": "64a1b2c3d4e5f6g7h8i9j0k2",
  "splitType": "EQUAL",
  "splits": [
    { "user": "64a1b2c3d4e5f6g7h8i9j0k1", "amount": 100 },
    { "user": "64a1b2c3d4e5f6g7h8i9j0k3", "amount": 100 },
    { "user": "64a1b2c3d4e5f6g7h8i9j0k4", "amount": 100 },
    { "user": "64a1b2c3d4e5f6g7h8i9j0k5", "amount": 100 }
  ],
  "date": "2024-12-24T10:30:00.000Z"
}
```

#### Get Balance Response
```json
// GET /api/expenses/group/:groupId/balance
[
  {
    "from": { "id": "64a1b2c3d4e5f6g7h8i9j0k3", "name": "Bob" },
    "to": { "id": "64a1b2c3d4e5f6g7h8i9j0k1", "name": "Alice" },
    "amount": 75.50
  },
  {
    "from": { "id": "64a1b2c3d4e5f6g7h8i9j0k4", "name": "Carol" },
    "to": { "id": "64a1b2c3d4e5f6g7h8i9j0k1", "name": "Alice" },
    "amount": 50.25
  }
]
```

---

## 6. Core Algorithm: Debt Simplification

### 6.1 Problem Statement
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        THE DEBT SIMPLIFICATION PROBLEM                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Without Optimization (Complex Debt Graph):                                     │
│                                                                                 │
│       Alice ──$10──▶ Bob                                                        │
│         ▲              │                                                        │
│         │              │                                                        │
│        $10           $10                                                        │
│         │              │                                                        │
│         │              ▼                                                        │
│       Carol ◀──$10── Dave                                                       │
│                                                                                 │
│  Total Transactions: 4 payments = $40 changing hands                            │
│                                                                                 │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                 │
│  With Optimization (Simplified):                                                │
│                                                                                 │
│  Net Balances:                                                                  │
│  • Alice: -$10 + $10 = $0 (settled)                                            │
│  • Bob:   +$10 - $10 = $0 (settled)                                            │
│  • Carol: -$10 + $10 = $0 (settled)                                            │
│  • Dave:  +$10 - $10 = $0 (settled)                                            │
│                                                                                 │
│  Total Transactions: 0 payments = $0 changing hands                             │
│                                                                                 │
│  RESULT: 100% reduction in transactions!                                        │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Algorithm Implementation

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    MIN-CASH-FLOW ALGORITHM (GREEDY APPROACH)                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  STEP 1: Calculate Net Balances                                                 │
│  ═══════════════════════════════                                                │
│                                                                                 │
│  For each expense in group:                                                     │
│    • Payer gets +amount (they are owed this money)                              │
│    • Each split user gets -splitAmount (they owe this money)                    │
│                                                                                 │
│  Example: Alice pays $100 for dinner (split among Alice, Bob, Carol, Dave)      │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  User    │  Paid    │  Owes    │  Net Balance                           │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  Alice   │  +$100   │  -$25    │  +$75 (Creditor - is owed)             │   │
│  │  Bob     │  $0      │  -$25    │  -$25 (Debtor - owes)                  │   │
│  │  Carol   │  $0      │  -$25    │  -$25 (Debtor - owes)                  │   │
│  │  Dave    │  $0      │  -$25    │  -$25 (Debtor - owes)                  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  STEP 2: Separate Givers and Receivers                                          │
│  ═════════════════════════════════════                                          │
│                                                                                 │
│  Givers (Net < 0):     [Bob: -$25, Carol: -$25, Dave: -$25]                     │
│  Receivers (Net > 0):  [Alice: +$75]                                            │
│                                                                                 │
│  STEP 3: Greedy Matching (Two-Pointer Approach)                                 │
│  ═══════════════════════════════════════════════                                │
│                                                                                 │
│  While (givers not empty AND receivers not empty):                              │
│    1. Take first giver and first receiver                                       │
│    2. Transfer amount = min(|giver.amount|, receiver.amount)                    │
│    3. Record transaction: giver → receiver: amount                              │
│    4. Update balances                                                           │
│    5. Remove settled parties (balance ≈ 0)                                      │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  Iteration 1:                                                            │   │
│  │    Bob (-$25) pays Alice (+$75)                                          │   │
│  │    Amount: min(25, 75) = $25                                             │   │
│  │    Result: Bob settled, Alice now +$50                                   │   │
│  │                                                                          │   │
│  │  Iteration 2:                                                            │   │
│  │    Carol (-$25) pays Alice (+$50)                                        │   │
│  │    Amount: min(25, 50) = $25                                             │   │
│  │    Result: Carol settled, Alice now +$25                                 │   │
│  │                                                                          │   │
│  │  Iteration 3:                                                            │   │
│  │    Dave (-$25) pays Alice (+$25)                                         │   │
│  │    Amount: min(25, 25) = $25                                             │   │
│  │    Result: Dave settled, Alice settled                                   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  FINAL OUTPUT:                                                                  │
│  [                                                                              │
│    { from: "Bob",   to: "Alice", amount: 25 },                                  │
│    { from: "Carol", to: "Alice", amount: 25 },                                  │
│    { from: "Dave",  to: "Alice", amount: 25 }                                   │
│  ]                                                                              │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Algorithm Pseudocode
```javascript
function getGroupBalance(groupId) {
    // Step 1: Fetch all expenses for the group
    const expenses = await Expense.find({ group: groupId });
    
    // Step 2: Calculate net balances
    const balances = {};  // { userId: netAmount }
    
    expenses.forEach(expense => {
        const payerId = expense.payer.toString();
        
        // Payer is owed the full amount
        balances[payerId] = (balances[payerId] || 0) + expense.amount;
        
        // Each split user owes their portion
        expense.splits.forEach(split => {
            const debtorId = split.user.toString();
            balances[debtorId] = (balances[debtorId] || 0) - split.amount;
        });
    });
    
    // Step 3: Separate into givers (owe money) and receivers (owed money)
    const givers = [];    // Net balance < 0
    const receivers = []; // Net balance > 0
    
    for (const [userId, amount] of Object.entries(balances)) {
        if (amount < -0.01) {      // Using 0.01 for float precision
            givers.push({ userId, amount });
        } else if (amount > 0.01) {
            receivers.push({ userId, amount });
        }
    }
    
    // Step 4: Greedy matching
    const simplifiedDebts = [];
    let giverIdx = 0, receiverIdx = 0;
    
    while (giverIdx < givers.length && receiverIdx < receivers.length) {
        const giver = givers[giverIdx];
        const receiver = receivers[receiverIdx];
        
        const transferAmount = Math.min(Math.abs(giver.amount), receiver.amount);
        
        simplifiedDebts.push({
            from: giver.userId,
            to: receiver.userId,
            amount: Math.round(transferAmount * 100) / 100  // Round to 2 decimals
        });
        
        // Update balances
        giver.amount += transferAmount;
        receiver.amount -= transferAmount;
        
        // Move pointers if settled
        if (Math.abs(giver.amount) < 0.01) giverIdx++;
        if (receiver.amount < 0.01) receiverIdx++;
    }
    
    return simplifiedDebts;
}
```

### 6.4 Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Net Balance Calculation | O(E × S) | O(U) |
| Giver/Receiver Separation | O(U) | O(U) |
| Greedy Matching | O(U) | O(U) |
| **Total** | **O(E × S)** | **O(U)** |

Where:
- E = Number of expenses
- S = Average splits per expense
- U = Number of users in group

### 6.5 Algorithm Comparison

| Approach | Complexity | Optimality | Implementation |
|----------|------------|------------|----------------|
| All-Edges Graph | O(T) | Poor | Simple |
| Min-Cost Max-Flow | Polynomial | Optimal | Complex |
| **Greedy (Selected)** | **O(E × S)** | **Near-Optimal** | **Moderate** |
| Brute Force | O(N!) | Optimal | Impractical |

**Why Greedy?**
- Produces optimal results for most real-world scenarios
- Simple to implement and debug
- Fast execution for typical group sizes (< 50 members)
- Deterministic output (same input → same output)

---

## 7. Frontend Architecture

### 7.1 Component Hierarchy
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         REACT COMPONENT ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  App.jsx (Root)                                                                 │
│  ├── ToastContainer (Notifications)                                             │
│  ├── Navbar (Conditional rendering based on auth state)                         │
│  │   ├── Logo/Brand                                                             │
│  │   ├── User greeting (authenticated)                                          │
│  │   └── Navigation links                                                       │
│  │                                                                              │
│  └── Routes (AnimatePresence wrapper)                                           │
│      │                                                                          │
│      ├── "/" ─────────────────────────────────────────────────────────────┐    │
│      │   ├── LandingPage.jsx (unauthenticated)                            │    │
│      │   │   ├── Hero Section (GSAP animations)                           │    │
│      │   │   ├── Features Section (Framer Motion)                         │    │
│      │   │   └── CTA Section (Glassmorphism)                              │    │
│      │   │                                                                │    │
│      │   └── GroupList.jsx (authenticated) ─ Dashboard                    │    │
│      │       ├── Stats Cards (Net Balance, Owed, Owe)                     │    │
│      │       ├── Search Bar                                               │    │
│      │       └── Group Cards Grid                                         │    │
│      │                                                                    │    │
│      ├── "/login" ────────────────────────────────────────────────────────┤    │
│      │   └── Login.jsx                                                    │    │
│      │       └── Email-based authentication form                          │    │
│      │                                                                    │    │
│      ├── "/create-user" ──────────────────────────────────────────────────┤    │
│      │   └── CreateUser.jsx                                               │    │
│      │       └── Registration form (name, email)                          │    │
│      │                                                                    │    │
│      ├── "/create-group" (Protected) ─────────────────────────────────────┤    │
│      │   └── CreateGroup.jsx                                              │    │
│      │       ├── Group name input                                         │    │
│      │       └── Member selection checkboxes                              │    │
│      │                                                                    │    │
│      ├── "/groups/:groupId" (Protected) ──────────────────────────────────┤    │
│      │   └── GroupDetails.jsx                                             │    │
│      │       ├── AddExpense.jsx (Collapsible)                             │    │
│      │       │   ├── Description/Amount inputs                            │    │
│      │       │   ├── Payer selection                                      │    │
│      │       │   ├── Split type toggle (EQUAL/EXACT/PERCENTAGE)           │    │
│      │       │   └── Dynamic split inputs                                 │    │
│      │       ├── Expenses List                                            │    │
│      │       └── Simplified Balances Sidebar                              │    │
│      │           └── Settlement buttons (2-step confirmation)             │    │
│      │                                                                    │    │
│      └── "/profile" (Protected) ──────────────────────────────────────────┘    │
│          └── Profile.jsx                                                       │
│              ├── User info header                                              │
│              ├── Stats cards (Payable/Receivable)                              │
│              ├── Groups list                                                   │
│              └── Settlement details with pay actions                           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 State Management Strategy

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          STATE MANAGEMENT APPROACH                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Authentication State: LocalStorage                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  localStorage.setItem('currentUser', JSON.stringify(user))              │   │
│  │  localStorage.getItem('currentUser') → { _id, name, email }             │   │
│  │                                                                          │   │
│  │  Used by: App.jsx, Navbar, GroupDetails, Profile                         │   │
│  │  Cleared on: Logout                                                      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Component-Level State: useState Hooks                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  GroupList:                                                              │   │
│  │    • groups: []           - All user's groups                            │   │
│  │    • filteredGroups: []   - Search-filtered groups                       │   │
│  │    • stats: {}            - Net balance calculations                     │   │
│  │    • searchTerm: ""       - Search input value                           │   │
│  │    • loading: boolean     - Loading state                                │   │
│  │                                                                          │   │
│  │  GroupDetails:                                                           │   │
│  │    • expenses: []         - Group expenses                               │   │
│  │    • balances: []         - Simplified debt graph                        │   │
│  │    • showAddExpense: bool - Form visibility toggle                       │   │
│  │    • confirmingDebt: idx  - 2-step confirmation state                    │   │
│  │                                                                          │   │
│  │  AddExpense:                                                             │   │
│  │    • members: []          - Group members for selection                  │   │
│  │    • splitType: string    - EQUAL | EXACT | PERCENTAGE                   │   │
│  │    • splits: {}           - User-specific split amounts                  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Why No Redux/Context?                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  • Application scope is limited (single user session)                    │   │
│  │  • Data is page-specific (groups, expenses per group)                    │   │
│  │  • API calls refresh data on navigation                                  │   │
│  │  • Simpler mental model for MVP                                          │   │
│  │  • LocalStorage handles cross-component auth state                       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Animation Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ANIMATION SYSTEM DESIGN                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Layer 1: Page Transitions (Framer Motion AnimatePresence)                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  <AnimatePresence mode="wait">                                           │   │
│  │    <Routes>                                                              │   │
│  │      <Route element={<motion.div initial/animate/exit />} />             │   │
│  │    </Routes>                                                             │   │
│  │  </AnimatePresence>                                                      │   │
│  │                                                                          │   │
│  │  Effects: Fade, slide, scale transitions between pages                   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Layer 2: List Animations (Staggered Children)                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  const containerVariants = {                                             │   │
│  │    hidden: { opacity: 0 },                                               │   │
│  │    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }         │   │
│  │  };                                                                      │   │
│  │                                                                          │   │
│  │  const itemVariants = {                                                  │   │
│  │    hidden: { y: 20, opacity: 0 },                                        │   │
│  │    visible: { y: 0, opacity: 1 }                                         │   │
│  │  };                                                                      │   │
│  │                                                                          │   │
│  │  Used in: GroupList cards, Expense list items                            │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Layer 3: Micro-interactions (Hover/Tap)                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  <motion.div                                                             │   │
│  │    whileHover={{ y: -5, scale: 1.02 }}                                   │   │
│  │    whileTap={{ scale: 0.98 }}                                            │   │
│  │  />                                                                      │   │
│  │                                                                          │   │
│  │  Used in: Cards, buttons, interactive elements                           │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Layer 4: Background Effects (CSS Keyframes)                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  @keyframes blob {                                                       │   │
│  │    0%, 100% { transform: translate(0, 0) scale(1); }                     │   │
│  │    33% { transform: translate(30px, -50px) scale(1.1); }                 │   │
│  │    66% { transform: translate(-20px, 20px) scale(0.9); }                 │   │
│  │  }                                                                       │   │
│  │                                                                          │   │
│  │  .animate-blob { animation: blob 7s infinite; }                          │   │
│  │                                                                          │   │
│  │  Used in: LandingPage gradient blobs                                     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Layer 5: Scroll-based (GSAP ScrollTrigger potential)                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  Currently: CSS snap-scroll on LandingPage                               │   │
│  │  Future: GSAP ScrollTrigger for parallax effects                         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 7.4 Design System

| Element | Implementation | Values |
|---------|----------------|--------|
| **Colors** | Tailwind CSS | Primary: Indigo-600, Secondary: Slate-900, Success: Green-500, Error: Red-500 |
| **Typography** | System fonts | Weights: medium (500), bold (700), black (900) |
| **Spacing** | Tailwind scale | Base: 4px, Common: 4, 6, 8, 12, 16, 20, 24 |
| **Borders** | Rounded corners | sm: 0.5rem, xl: 1rem, 2xl: 1.5rem, 3xl: 2rem |
| **Shadows** | Layered | sm, md, lg, xl, 2xl with color tints |
| **Effects** | Glassmorphism | backdrop-blur-md, bg-white/80 |

---

## 8. Data Flow & State Management

### 8.1 User Authentication Flow
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          AUTHENTICATION DATA FLOW                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Registration Flow:                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  CreateUser.jsx                                                          │   │
│  │       │                                                                  │   │
│  │       │ 1. User submits { name, email }                                  │   │
│  │       ▼                                                                  │   │
│  │  registerUser(userData)  ──────────────────────────────────────────────▶│   │
│  │       │                                    POST /api/users               │   │
│  │       │                                         │                        │   │
│  │       │                                         ▼                        │   │
│  │       │                                  userController.registerUser()   │   │
│  │       │                                         │                        │   │
│  │       │                                         │ Check email unique     │   │
│  │       │                                         │ Create User document   │   │
│  │       │                                         ▼                        │   │
│  │       │◀──────────────────────────────── { _id, name, email }            │   │
│  │       │                                                                  │   │
│  │       │ 2. Show success toast                                            │   │
│  │       │ 3. Navigate to /login                                            │   │
│  │       ▼                                                                  │   │
│  │  Login.jsx                                                               │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Login Flow:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  Login.jsx                                                               │   │
│  │       │                                                                  │   │
│  │       │ 1. User submits { email }                                        │   │
│  │       ▼                                                                  │   │
│  │  loginUser(email)  ────────────────────────────────────────────────────▶│   │
│  │       │                                    POST /api/users/login         │   │
│  │       │                                         │                        │   │
│  │       │                                         ▼                        │   │
│  │       │                                  userController.loginUser()      │   │
│  │       │                                         │                        │   │
│  │       │                                         │ Find user by email     │   │
│  │       │                                         ▼                        │   │
│  │       │◀──────────────────────────────── { _id, name, email }            │   │
│  │       │                                                                  │   │
│  │       │ 2. localStorage.setItem('currentUser', JSON.stringify(data))     │   │
│  │       │ 3. Show welcome toast                                            │   │
│  │       │ 4. Navigate to / (Dashboard)                                     │   │
│  │       │ 5. window.location.reload() to update Navbar                     │   │
│  │       ▼                                                                  │   │
│  │  GroupList.jsx (Dashboard)                                               │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Expense Creation Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          EXPENSE CREATION DATA FLOW                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  AddExpense.jsx                                                                 │
│       │                                                                         │
│       │ 1. User fills form:                                                     │
│       │    • description: "Hotel"                                               │
│       │    • amount: 400                                                        │
│       │    • payer: "Alice"                                                     │
│       │    • splitType: "EQUAL"                                                 │
│       │    • splits: [Alice, Bob, Carol, Dave]                                  │
│       ▼                                                                         │
│  addExpense(expenseData)  ─────────────────────────────────────────────────────▶│
│       │                                         POST /api/expenses              │
│       │                                              │                          │
│       │                                              ▼                          │
│       │                                   expenseController.addExpense()        │
│       │                                              │                          │
│       │                                              │ Validation:              │
│       │                                              │ • EXACT: sum = amount    │
│       │                                              │ • PERCENTAGE: sum = 100  │
│       │                                              │                          │
│       │                                              │ Calculate splits:        │
│       │                                              │ • EQUAL: amount/members  │
│       │                                              │ • PERCENTAGE: amount*%   │
│       │                                              │                          │
│       │                                              │ Create Expense document  │
│       │                                              ▼                          │
│       │◀─────────────────────────────────────── { expense document }            │
│       │                                                                         │
│       │ 2. Show success toast                                                   │
│       │ 3. Reset form                                                           │
│       │ 4. Call onExpenseAdded() callback                                       │
│       ▼                                                                         │
│  GroupDetails.jsx                                                               │
│       │                                                                         │
│       │ 5. fetchData() - Refresh expenses and balances                          │
│       │    • getGroupExpenses(groupId)                                          │
│       │    • getGroupBalance(groupId)                                           │
│       ▼                                                                         │
│  UI Updated with new expense and recalculated balances                          │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 8.3 Balance Calculation Flow
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         BALANCE CALCULATION DATA FLOW                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  GroupDetails.jsx / Profile.jsx                                                 │
│       │                                                                         │
│       │ useEffect on mount/groupId change                                       │
│       ▼                                                                         │
│  getGroupBalance(groupId)  ────────────────────────────────────────────────────▶│
│       │                              GET /api/expenses/group/:groupId/balance   │
│       │                                              │                          │
│       │                                              ▼                          │
│       │                                   expenseController.getGroupBalance()   │
│       │                                              │                          │
│       │                              ┌───────────────┴───────────────┐          │
│       │                              │                               │          │
│       │                              ▼                               ▼          │
│       │                    Expense.find({group})           Calculate Net        │
│       │                              │                     Balances             │
│       │                              │                               │          │
│       │                              └───────────────┬───────────────┘          │
│       │                                              │                          │
│       │                                              ▼                          │
│       │                                   Greedy Debt Simplification            │
│       │                                              │                          │
│       │                                              │ Separate givers/receivers│
│       │                                              │ Match and minimize       │
│       │                                              │ transactions             │
│       │                                              ▼                          │
│       │                                   Populate user names                   │
│       │                                              │                          │
│       │◀─────────────────────────────────────────────┘                          │
│       │                                                                         │
│       │ Response: [{ from: {id, name}, to: {id, name}, amount }]                │
│       ▼                                                                         │
│  setBalances(response.data)                                                     │
│       │                                                                         │
│       ▼                                                                         │
│  Render Simplified Balances UI                                                  │
│  • Show "from → to: $amount" for each debt                                      │
│  • Show "Pay" button if currentUser === from                                    │
│  • Show "Pending" if currentUser === to                                         │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Security Architecture

### 9.1 Current Security Model
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        CURRENT SECURITY IMPLEMENTATION                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Authentication: Email-based (Simulated)                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  • No password required (MVP simplification)                             │   │
│  │  • User lookup by email only                                             │   │
│  │  • Session stored in LocalStorage                                        │   │
│  │  • No token expiration                                                   │   │
│  │                                                                          │   │
│  │  Vulnerability: Anyone with email can impersonate user                   │   │
│  │  Mitigation: Acceptable for demo/MVP, not production                     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Authorization: Client-side Enforcement                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  Settlement Button Logic (GroupDetails.jsx):                             │   │
│  │                                                                          │   │
│  │  {currentUser._id === debt.from.id ? (                                   │   │
│  │    <button onClick={handleSettle}>Pay</button>                           │   │
│  │  ) : (                                                                   │   │
│  │    <span>Pending</span>                                                  │   │
│  │  )}                                                                      │   │
│  │                                                                          │   │
│  │  Purpose: Only debtor can initiate settlement                            │   │
│  │  Limitation: No server-side validation                                   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Data Validation: Server-side                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  • Email uniqueness check on registration                                │   │
│  │  • EXACT split sum validation (must equal amount)                        │   │
│  │  • PERCENTAGE split sum validation (must equal 100)                      │   │
│  │  • Required field validation via Mongoose schema                         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  CORS Configuration                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  app.use(cors());  // Currently allows all origins                       │   │
│  │                                                                          │   │
│  │  Production recommendation:                                              │   │
│  │  app.use(cors({                                                          │   │
│  │    origin: ['https://expenseshare.vercel.app'],                          │   │
│  │    credentials: true                                                     │   │
│  │  }));                                                                    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Security Recommendations for Production
| Area | Current State | Recommended Improvement |
|------|---------------|------------------------|
| Authentication | Email lookup only | JWT + bcrypt password hashing |
| Session Management | LocalStorage | HttpOnly cookies with refresh tokens |
| Authorization | Client-side only | Server-side middleware validation |
| CORS | Allow all origins | Whitelist specific domains |
| Rate Limiting | None | Express-rate-limit middleware |
| Input Sanitization | Basic | mongo-sanitize + express-validator |
| HTTPS | Depends on deployment | Enforce HTTPS, HSTS headers |

---

## 10. Performance Considerations

### 10.1 Current Performance Characteristics
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         PERFORMANCE ANALYSIS                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Database Operations                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  Operation                    │ Complexity    │ Typical Latency          │   │
│  │  ─────────────────────────────┼───────────────┼────────────────────────  │   │
│  │  User lookup by email         │ O(1) indexed  │ < 5ms                    │   │
│  │  Get groups by userId         │ O(log n)      │ < 10ms                   │   │
│  │  Get expenses by groupId      │ O(log n)      │ < 10ms                   │   │
│  │  Calculate group balance      │ O(E × S)      │ 10-100ms (varies)        │   │
│  │  Add expense                  │ O(1)          │ < 20ms                   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Frontend Performance                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  Metric                       │ Target        │ Current (Estimated)      │   │
│  │  ─────────────────────────────┼───────────────┼────────────────────────  │   │
│  │  First Contentful Paint       │ < 1.8s        │ ~1.2s (Vite optimized)   │   │
│  │  Time to Interactive          │ < 3.8s        │ ~2.5s                    │   │
│  │  Bundle Size (gzipped)        │ < 200KB       │ ~180KB                   │   │
│  │  Animation Frame Rate         │ 60fps         │ 60fps (Framer Motion)    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Bottleneck: Balance Calculation                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  The getGroupBalance endpoint is the most expensive operation:           │   │
│  │                                                                          │   │
│  │  1. Fetches ALL expenses for a group                                     │   │
│  │  2. Iterates through each expense and split                              │   │
│  │  3. Runs debt simplification algorithm                                   │   │
│  │  4. Populates user names                                                 │   │
│  │                                                                          │   │
│  │  For a group with 100 expenses and 10 users:                             │   │
│  │  • ~100 expense documents fetched                                        │   │
│  │  • ~400 split iterations (avg 4 splits/expense)                          │   │
│  │  • ~10 user lookups for name population                                  │   │
│  │                                                                          │   │
│  │  Estimated latency: 50-150ms                                             │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Optimization Strategies

| Strategy | Implementation | Impact |
|----------|----------------|--------|
| **Database Indexing** | Add indexes on `group`, `payer`, `date` fields | 50-80% query improvemen