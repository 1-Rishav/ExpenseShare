import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import CreateUser from './components/CreateUser';
import GroupList from './components/GroupList';
import CreateGroup from './components/CreateGroup';
import GroupDetails from './components/GroupDetails';
import Login from './components/Login';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';

// Navbar Component (Internal to App for access to Location/User)
const Navbar = ({ user }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/' && !user;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isLanding ? 'bg-transparent py-6' : 'bg-white/80 backdrop-blur-md shadow-sm py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          ExpenseShare
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-slate-700 font-medium hidden md:inline">Hi, {user.name}</span>
              <Link to="/profile" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Profile</Link>
              <Link
                to="/create-group"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg text-sm"
              >
                + New Group
              </Link>
            </>
          ) : (
            !isLanding && (
              <>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium mr-4">Login</Link>
                <Link to="/create-user" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-md">Get Started</Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  return (
    <Router>
      <div className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Navbar user={user} />

        {/* Main Content Area */}
        <div className={user ? "pt-24 container mx-auto px-4" : ""}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={user ? <GroupList /> : <LandingPage />}
              />
              <Route path="/create-user" element={<CreateUser />} />
              <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

              {/* Protected Routes */}
              <Route path="/create-group" element={user ? <CreateGroup /> : <Navigate to="/login" />} />
              <Route path="/groups/:groupId" element={user ? <GroupDetails /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </Router>
  );
}

export default App;
