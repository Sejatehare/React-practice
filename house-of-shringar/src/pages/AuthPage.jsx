import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signup, sendPasswordReset } from "../api/authAPI";
import { setUserInDB, getUserFromDB } from "../api/dbAPI";
import { setAuth } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signup(email, password);
      await setUserInDB(data.localId, { email, role }, data.idToken);
      alert("Signup successful. Please login now.");
      setMode("login");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCS78u_o-JeNbkUlxgnGzjAAE1fREGlC3c`,
        { email, password, returnSecureToken: true }
      );

      const { idToken, localId } = res.data;
      const userData = await getUserFromDB(localId, idToken);

      if (!userData) {
        alert("No user record found in database.");
        return;
      }

      if (userData.role !== role) {
        alert(`This account is registered as '${userData.role}', not '${role}'.`);
        return;
      }

      dispatch(setAuth({ userId: localId, token: idToken, role: userData.role, email }));
      localStorage.setItem("user", JSON.stringify({ userId: localId, token: idToken, role: userData.role, email }));

      if (userData.role === "admin") navigate("/admin");
      else navigate("/user");
    } catch (error) {
      console.error("Login failed:", error);
      alert(error?.response?.data?.error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordReset(email);
      alert("Password reset email sent. Check your inbox.");
      setMode("login");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-silver-950 to-orange-100 p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl transition-all duration-300">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {mode === "login"
            ? "Welcome Back 👋"
            : mode === "signup"
            ? "Create an Account 🚀"
            : "Reset Your Password ✉️"}
        </h1>

        <div className="flex justify-between mb-6">
          {["login", "signup", "forgot"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`w-1/3 py-2 rounded-md font-medium transition-all ${
                mode === m
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {m === "login"
                ? "Login"
                : m === "signup"
                ? "Signup"
                : "Forgot"}
            </button>
          ))}
        </div>

        {mode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Role:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all shadow-md"
            >
              {loading ? "Signing..." : "Sign Up"}
            </button>
          </form>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Login as:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all shadow-md"
            >
              {loading ? "Logging..." : "Login"}
            </button>

            <p className="text-sm mt-2 text-center">
              Forgot password?{" "}
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-indigo-600 hover:underline"
              >
                Reset
              </button>
            </p>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all shadow-md"
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
