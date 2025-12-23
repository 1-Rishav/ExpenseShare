# ExpenseShare Client

This is the high-fidelity frontend client for the ExpenseShare application. It leverages modern animation libraries to provide a premium, interactive user experience.

## Technology Stack

The client application uses a cutting-edge stack for optimal performance and interactions:

-   **React.js**: Component-based UI library.
-   **Vite**: Next-generation frontend tooling.
-   **Tailwind CSS**: Utility-first CSS framework for bespoke designs.
-   **Framer Motion**: Production-ready motion library for complex page transitions and layout animations.
-   **GSAP**: GreenSock Animation Platform for high-performance scripted animations (Landing Page).
-   **Lucide React**: Beautiful, consistent icon set.
-   **React Router DOM**: Client-side routing.
-   **Axios**: API integration.
-   **React Toastify**: polished notification system.

## Project Structure

```text
client/
├── public/
├── src/
│   ├── components/         
│   │   ├── AddExpense.jsx    # Animated expense form
│   │   ├── CreateGroup.jsx   # Group creation wizard
│   │   ├── CreateUser.jsx    # Registration page with entry animations
│   │   ├── GroupDetails.jsx  # Complex dashboard with sidebar and expense list
│   │   ├── GroupList.jsx     # Main User Dashboard with staggered card animations
│   │   ├── LandingPage.jsx   # Public landing page with GSAP hero animations
│   │   ├── Login.jsx         # Secure login page with loading states
│   │   └── Profile.jsx       # Personal financial summary with glassmorphism effects
│   ├── services/           
│   │   └── api.js            
│   ├── App.jsx             # Routes definition with AnimatePresence
│   ├── main.jsx            
│   └── index.css           # Global styles + Tailwind + Blob Animations
├── .gitignore              
├── index.html              
├── package.json            
├── postcss.config.js       
├── tailwind.config.js      
└── vite.config.js          
```

## Features & UX Improvements

1.  **Interactive Landing Page**: A dedicated GSAP-powered landing page for unauthenticated users featuring text reveals and moving background blobs.
2.  **Smooth Transitions**: Pages fade and slide in/out using `AnimatePresence`.
3.  **Micro-Interactions**: Buttons, cards, and inputs respond to hover and focus states with scale/shadow transforms.
4.  **Glassmorphism**: Use of backdrop-blur and semi-transparent gradients for a modern feel.
5.  **Smart Dashboard**: The main dashboard intelligently updates to show your groups and personal welcome message.
6.  **Secure & Strict Logic**: Payment buttons are context-aware, appearing only for the specific user who owes debt, with a 2-step confirmation to prevent errors.

## How to Run Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    # This installs framer-motion, gsap, lucide-react, etc.
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

3.  **Visit**: `http://localhost:5173` (Ensure Backend is running on port 5001).
