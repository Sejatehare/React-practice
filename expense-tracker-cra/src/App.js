import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import { Toaster } from 'react-hot-toast';

function App(){
  const [dark, setDark] = useState(false);
  useEffect(()=>{ if(dark) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark') },[dark]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Toaster />
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl">ExpenseTracker</Link>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="px-3 py-1 rounded-md border">Auth</Link>
            <Link to="/profile" className="px-3 py-1 rounded-md bg-indigo-600 text-white">Profile</Link>
            <button onClick={()=>setDark(!dark)} className="px-3 py-1 rounded-md border">Toggle Dark</button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/auth" element={<AuthPage/>} />
          <Route path="/profile" element={<ProfilePage/>} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
