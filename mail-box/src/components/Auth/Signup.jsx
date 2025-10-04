// src/components/Auth/Signup.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = email && password && confirmPassword;

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      try { await sendEmailVerification(user); } catch (err) { console.warn(err); }
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userUid", user.uid);
      console.log("User has successfully signed up");
      navigate("/homepage");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="w-full max-w-md bg-white/80 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Create Account</h2>
        <p className="text-sm text-gray-700 text-center mb-6">Sign up to access your mailbox</p>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="px-4 py-2 rounded-md border focus:outline-none" required />
          <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="px-4 py-2 rounded-md border focus:outline-none" required />
          <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className="px-4 py-2 rounded-md border focus:outline-none" required />
          <button type="submit" disabled={!isFormValid || loading} className={`py-2 rounded-md font-semibold ${(!isFormValid || loading) ? "bg-gray-400" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-700 mt-4">Already have an account? <span className="text-indigo-600 cursor-pointer" onClick={() => navigate("/login")}>Login</span></p>
      </div>
    </div>
  );
}
