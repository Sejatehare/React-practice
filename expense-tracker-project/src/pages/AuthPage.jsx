// pages/AuthPage.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setToken } from "../store/auth-slice";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import toast from "react-hot-toast";

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);

  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoadingLocal] = useState(false);
  const [profileStep, setProfileStep] = useState(false);

  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    if (authState.user) checkProfileComplete(authState.user.uid);
  }, [authState.user]);

  const checkProfileComplete = async (uid) => {
    const dbRef = ref(db, `users/${uid}`);
    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.name && userData.mobile) navigate("/"); 
        else setProfileStep(true);
      } else {
        setProfileStep(true);
      }
    } catch {
      toast.error("Error checking profile.");
    }
  };

  const handleSignup = async () => {
    setLoadingLocal(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      toast.success("Verification email sent! Check your inbox.");

      dispatch(setUser({ uid: user.uid, email: user.email }));
      dispatch(setToken(user.accessToken));
      setProfileStep(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleLogin = async () => {
    setLoadingLocal(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        toast.error("Please verify your email first!");
        await signOut(auth);
        setLoadingLocal(false);
        return;
      }

      dispatch(setUser({ uid: user.uid, email: user.email }));
      dispatch(setToken(user.accessToken));
      checkProfileComplete(user.uid);
    } catch (error) {
      toast.error(error.message);
      setLoadingLocal(false);
    }
  };

  const handleProfileSubmit = async () => {
    if (!name || !mobile) {
      toast.error("Please fill all fields!");
      return;
    }
    setLoadingLocal(true);
    try {
      const uid = authState.user.uid;
      await set(ref(db, `users/${uid}`), { name, mobile, email: authState.user.email });
      toast.success("Profile completed successfully!");
      navigate("/"); 
    } catch {
      toast.error("Failed to save profile.");
    } finally {
      setLoadingLocal(false);
    }
  };

  // Reusable input style
  const inputClass = "w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col gap-4">
        {profileStep ? (
          <>
            <h2 className="text-2xl font-bold text-center">Complete Your Profile</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className={inputClass}
            />
            <button
              onClick={handleProfileSubmit}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center">{isSignup ? "Sign Up" : "Login"}</h2>
            <input
              type="email"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            <button
              onClick={isSignup ? handleSignup : handleLogin}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
            </button>
            <p
              onClick={() => setIsSignup(!isSignup)}
              className="text-center text-sm text-indigo-500 cursor-pointer hover:underline"
            >
              {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
