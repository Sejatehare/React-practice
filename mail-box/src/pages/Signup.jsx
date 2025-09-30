import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import toast from "react-hot-toast";
import {auth} from "../firebase/firebase";

const SignupPage = () => {
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = email && password && confirmPassword;

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);
      toast.success("Verification email sent! Check your inbox.");

      console.log("User has successfully signed up");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-500">Sign up to get started 🚀</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClass}
        />

        <button
          onClick={handleSignup}
          disabled={!isFormValid || loading}
          className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition 
            ${
              !isFormValid || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
