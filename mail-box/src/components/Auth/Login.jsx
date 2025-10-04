// src/components/Auth/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userUid", user.uid);
      navigate("/homepage");
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="w-full max-w-md bg-white/80 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome back</h2>
        <p className="text-sm text-gray-700 text-center mb-6">Login to continue</p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="px-4 py-2 rounded-md border focus:outline-none" required />
          <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="px-4 py-2 rounded-md border focus:outline-none" required />
          <button type="submit" disabled={loading} className={`py-2 rounded-md font-semibold ${loading ? "bg-gray-400" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>{loading ? "Signing in..." : "Login"}</button>
        </form>
        <p className="text-sm text-center text-gray-700 mt-4">Don’t have an account? <span className="text-indigo-600 cursor-pointer" onClick={() => navigate("/signup")}>Sign up</span></p>
      </div>
    </div>
  );
}
