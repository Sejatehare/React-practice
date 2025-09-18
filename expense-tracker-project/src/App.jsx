import './App.css'
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase/firebase";  
import { setUser, logout } from "./store/auth-slice";
import { toggleDarkMode } from './store/theme-slice';

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const darkMode = useSelector((state) => state.theme.darkMode);

  // ✅ Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || null,
          accessToken: user.accessToken,
        }));
      } else {
        dispatch(logout());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  // ✅ Dark mode toggle (persist in localStorage)
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ✅ Protected route wrapper
  const PrivateRoute = ({ children }) => 
    isAuth ? children : <Navigate to="/auth" replace />;

  // ✅ Handle sign out
  const handleSignOut = async () => {
    await signOut(auth);
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Toaster />
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl">ExpenseTracker</Link>
          <div className="flex items-center gap-3">
            {!isAuth && (
              <Link to="/auth" className="px-3 py-1 rounded-md border">
                Login
              </Link>
            )}
            {isAuth && (
              <Link to="/profile" className="px-3 py-1 rounded-md bg-indigo-600 text-white">
                Profile
              </Link>
            )}

            {/* ✅ Toggle Dark */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="px-3 py-1 rounded-md border"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            {/* ✅ Sign Out (only if logged in) */}
            {isAuth && (
              <button
                onClick={handleSignOut}
                className="px-3 py-1 rounded-md border text-red-500 hover:bg-red-100 dark:hover:bg-red-800"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/auth" element={isAuth ? <Navigate to="/" replace /> : <AuthPage />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to={isAuth ? "/" : "/auth"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
