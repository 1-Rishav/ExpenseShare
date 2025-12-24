<p align="center">
  <img src="https://raw.githubusercontent.com/vitejs/vite/main/docs/public/logo.svg" alt="Vite Logo" width="80" height="80"/>
</p>

<h1 align="center">💸 ExpenseShare Client</h1>

<p align="center">
  <strong>A modern, high-fidelity expense splitting application with premium animations and glassmorphism UI</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/TailwindCSS-4.1.18-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
</p>

---

## 📖 Description

ExpenseShare Client is a feature-rich, single-page application designed to simplify expense tracking and debt settlement among groups. Whether you're splitting bills with roommates, tracking trip expenses with friends, or managing shared costs with colleagues, ExpenseShare provides an intuitive and visually stunning interface.

The application features:
- **Snap-scroll landing page** with animated hero sections
- **Real-time balance calculations** with optimized debt settlement
- **Glassmorphism design** with backdrop blur effects
- **Smooth page transitions** using Framer Motion
- **Context-aware payment buttons** with 2-step confirmation
- **Responsive design** optimized for all devices

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center" width="120">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="48" height="48" alt="React" />
      <br><strong>React 19</strong>
      <br><sub>UI Library</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg" width="48" height="48" alt="Vite" />
      <br><strong>Vite 7</strong>
      <br><sub>Build Tool</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" width="48" height="48" alt="Tailwind CSS" />
      <br><strong>Tailwind CSS 4</strong>
      <br><sub>Styling</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://user-images.githubusercontent.com/38039349/60953119-d3c6f300-a2fc-11e9-9596-4978e5d52180.png" width="48" height="48" alt="Framer Motion" />
      <br><strong>Framer Motion</strong>
      <br><sub>Animations</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://greensock.com/uploads/monthly_2020_03/tweenmax.png.cf27916e926fbb328ff214f66b4c8429.png" width="48" height="48" alt="GSAP" />
      <br><strong>GSAP</strong>
      <br><sub>Advanced Animations</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://lucide.dev/logo.light.svg" width="48" height="48" alt="Lucide React" />
      <br><strong>Lucide React</strong>
      <br><sub>Icons</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://reactrouter.com/_brand/react-router-mark-color.svg" width="48" height="48" alt="React Router" />
      <br><strong>React Router 7</strong>
      <br><sub>Routing</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://axios-http.com/assets/logo.svg" width="48" height="48" alt="Axios" />
      <br><strong>Axios</strong>
      <br><sub>HTTP Client</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://fkhadra.github.io/react-toastify/img/favicon.ico" width="48" height="48" alt="React Toastify" />
      <br><strong>React Toastify</strong>
      <br><sub>Notifications</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/eslint/eslint-original.svg" width="48" height="48" alt="ESLint" />
      <br><strong>ESLint 9</strong>
      <br><sub>Linting</sub>
    </td>
  </tr>
</table>

---

## 📁 Project Structure

```
client/
│
├── 📂 public/                      # Static assets
│   └── vite.svg                    # Vite favicon
│
├── 📂 src/                         # Source code
│   │
│   ├── 📂 assets/                  # Application assets
│   │   └── react.svg               # React logo
│   │
│   ├── 📂 components/              # React components
│   │   ├── AddExpense.jsx          # 💰 Expense creation form with split options
│   │   ├── CreateGroup.jsx         # 👥 Group creation wizard with member selection
│   │   ├── CreateUser.jsx          # 📝 User registration with animated entry
│   │   ├── GroupDetails.jsx        # 📊 Group dashboard with expenses & balances
│   │   ├── GroupList.jsx           # 🏠 Main dashboard with stats & group cards
│   │   ├── LandingPage.jsx         # 🎨 GSAP-powered hero with snap scrolling
│   │   ├── Login.jsx               # 🔐 Login page with loading states
│   │   └── Profile.jsx             # 👤 Personal summary with settlements
│   │
│   ├── 📂 services/                # API layer
│   │   └── api.js                  # 🔌 Axios API functions
│   │
│   ├── App.jsx                     # 🚀 Root component with routes & navbar
│   ├── main.jsx                    # ⚡ Application entry point
│   └── index.css                   # 🎨 Global styles & blob animations
│
├── .gitignore                      # Git ignore rules
├── eslint.config.js                # ESLint configuration
├── index.html                      # HTML entry point
├── package.json                    # Dependencies & scripts
├── tailwind.config.js              # Tailwind CSS configuration
├── vite.config.js                  # Vite build configuration
└── README.md                       # 📖 This file
```

---

## 🧩 Components Overview

### 🎨 LandingPage.jsx
The public-facing landing page featuring:
- Full-screen snap scrolling sections
- Animated gradient blobs in background
- Framer Motion reveal animations
- Interactive feature cards
- Call-to-action sections with glassmorphism

### 🔐 Login.jsx
Secure authentication page with:
- Email-based login
- Loading spinner states
- Form validation
- Smooth scale animations on mount
- Link to registration

### 📝 CreateUser.jsx
User registration component featuring:
- Name and email input fields
- Icon-enhanced form inputs
- Slide-in entry animation
- Success toast notifications
- Redirect to login on completion

### 🏠 GroupList.jsx (Dashboard)
Main user dashboard displaying:
- Net balance summary card
- "Owed to You" and "You Owe" statistics
- Search functionality for groups
- Staggered card animations
- Group cards with member avatars
- Quick navigation to group details

### 👥 CreateGroup.jsx
Group creation wizard with:
- Group name input
- Multi-select member checkboxes
- User list fetched from API
- Success notifications

### 📊 GroupDetails.jsx
Comprehensive group management view:
- Collapsible expense form
- Recent expenses list with icons
- Simplified balance sidebar
- Context-aware "Pay" buttons
- 2-step settlement confirmation
- Real-time balance updates

### 💰 AddExpense.jsx
Expense creation form supporting:
- Description and amount fields
- Payer selection dropdown
- Three split methods:
  - **EQUAL** - Split equally among all members
  - **EXACT** - Specify exact amounts per person
  - **PERCENTAGE** - Split by percentage
- Dynamic split input fields

### 👤 Profile.jsx
Personal financial summary featuring:
- User info header with logout
- Total payable/receivable cards
- Groups list with navigation
- Settlement details with pay actions
- Glassmorphism card effects

---

## 🔌 API Services

Located in `src/services/api.js`:

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `loginUser` | POST | `/api/users/login` | Authenticate user by email |
| `registerUser` | POST | `/api/users` | Create new user account |
| `getUsers` | GET | `/api/users` | Fetch all users |
| `createGroup` | POST | `/api/groups` | Create expense group |
| `getGroups` | GET | `/api/groups` | Get user's groups |
| `getGroup` | GET | `/api/groups/:id` | Get single group details |
| `addExpense` | POST | `/api/expenses` | Add new expense |
| `getGroupExpenses` | GET | `/api/expenses/group/:id` | Get group expenses |
| `getGroupBalance` | GET | `/api/expenses/group/:id/balance` | Get simplified balances |
| `settleDebt` | POST | `/api/expenses/settle` | Record debt settlement |

---

## ✨ Key Features

### 🎭 Animation System
- **Page Transitions**: Smooth fade and slide using `AnimatePresence`
- **Staggered Lists**: Cards animate in sequence
- **Micro-interactions**: Hover effects on buttons and cards
- **Blob Animations**: CSS keyframe animations for background effects

### 🎨 Design System
- **Glassmorphism**: Backdrop blur with semi-transparent gradients
- **Color Palette**: Indigo/Purple primary with slate neutrals
- **Typography**: Font weights from medium to black
- **Shadows**: Layered shadows with color tints

### 🔒 Security Features
- LocalStorage-based session management
- Protected route guards
- Context-aware action buttons
- 2-step confirmation for payments

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Installation

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This installs all required packages including:
   - React & React DOM
   - Framer Motion & GSAP
   - Tailwind CSS
   - Axios & React Router
   - Lucide React icons
   - React Toastify

### Running the Application

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Open in browser**
   ```
   http://localhost:5173
   ```

> ⚠️ **Important**: Ensure the backend server is running on port `5001` before using the application.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

---

## 🔧 Configuration

### Vite Configuration (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Tailwind Configuration (`tailwind.config.js`)
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### API Base URL
The API base URL is configured in `src/services/api.js`:
```javascript
const API_URL = 'http://localhost:5001/api';
```

---

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px (single column layouts)
- **Tablet**: 768px - 1024px (2 column grids)
- **Desktop**: > 1024px (3 column grids, sidebars)

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
  Made with ❤️ using React + Vite + Tailwind CSS
</p>
