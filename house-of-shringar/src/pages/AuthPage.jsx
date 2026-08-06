import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {signup, login, sendPasswordReset} from "../api/authAPI";

import {setUserInDB,getUserFromDB} from "../api/dbAPI";

import { setAuth } from "../store/authSlice";

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none";

  const buttonClass =
    "w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-60";

  const selectClass =
    "border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500";

  const titles = {
    login: "Welcome Back 👋",
    signup: "Create an Account 🚀",
    forgot: "Reset Your Password ✉️",
  };

  const executeRequest = async (callback) => {
    setLoading(true);

    try {
      await callback();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.error?.message ||
          err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const saveUser = (user) => {
    dispatch(setAuth(user));
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleSignup = (e) => {
    e.preventDefault();

    executeRequest(async () => {
      const data = await signup(email, password);

      await setUserInDB(
        data.localId,
        { email, role },
        data.idToken
      );

      alert("Signup successful. Please login.");

      setMode("login");
      setPassword("");
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    executeRequest(async () => {
      const { idToken, localId } = await login(
        email,
        password
      );

      const user = await getUserFromDB(
        localId,
        idToken
      );

      if (!user) {
        return alert("No user record found.");
      }

      if (user.role !== role) {
        return alert(
          `This account is registered as '${user.role}', not '${role}'.`
        );
      }

      const authData = {
        userId: localId,
        token: idToken,
        role: user.role,
        email,
      };

      saveUser(authData);

      navigate(
        user.role === "admin"
          ? "/admin"
          : "/user"
      );
    });
  };

  const handleForgot = (e) => {
    e.preventDefault();

    executeRequest(async () => {
      await sendPasswordReset(email);

      alert(
        "Password reset email sent successfully."
      );

      setMode("login");
    });
  };

  const renderEmailInput = () => (
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Email"
      className={inputClass}
      required
    />
  );

  const renderPasswordInput = () => (
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Password"
      className={inputClass}
      required
    />
  );

  const renderRoleSelect = (label) => (
    <div className="flex items-center justify-between">
      <span className="text-gray-700">
        {label}
      </span>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className={selectClass}
      >
        <option value="user">
          User
        </option>

        <option value="admin">
          Admin
        </option>
      </select>
    </div>
  );

  const renderButton = (
    text,
    loadingText
  ) => (
    <button
      type="submit"
      disabled={loading}
      className={buttonClass}
    >
      {loading ? loadingText : text}
    </button>
  );

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-silver-950 to-orange-100 p-4">
      <div className="w-full max-w-md card p-4 fade-up backdrop-blur-lg transition-all duration-300">

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {titles[mode]}
        </h1>

        <div className="flex justify-between mb-6">
          {[
            {
              value: "login",
              label: "Login",
            },
            {
              value: "signup",
              label: "Signup",
            },
            {
              value: "forgot",
              label: "Forgot",
            },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`w-1/3 py-2 rounded-md font-medium transition-all ${
                mode === value
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "signup" && (
          <form
            onSubmit={handleSignup}
            className="space-y-4"
          >
            {renderEmailInput()}
            {renderPasswordInput()}
            {renderRoleSelect("Role:")}
            {renderButton(
              "Sign Up",
              "Signing..."
            )}
          </form>
        )}

        {mode === "login" && (
          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >
            {renderEmailInput()}
            {renderPasswordInput()}
            {renderRoleSelect("Login as:")}
            {renderButton(
              "Login",
              "Logging..."
            )}
          </form>
        )}

        {mode === "forgot" && (
          <form
            onSubmit={handleForgot}
            className="space-y-4"
          >
            {renderEmailInput()}
            {renderButton(
              "Send Reset Email",
              "Sending..."
            )}
          </form>
        )}

      </div>
    </div>
  );
}