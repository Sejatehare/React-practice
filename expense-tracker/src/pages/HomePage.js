import React from "react";
import { useSelector } from "react-redux";
import ExpenseTracker from "../components/Dashboard/ExpenseTracker";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const profileCompleted = useSelector((state) => state.auth.profileCompleted);
  const navigate = useNavigate();

  const completeProfileHandler = () => {
    navigate("/complete-profile");
  };

  return (
    <section>
      {isLoggedIn ? (
        <>
          {!profileCompleted && (
            <div style={{ border: "1px solid orange", padding: "1rem", marginBottom: "1rem" }}>
              <p>Your profile is incomplete.</p>
              <button onClick={completeProfileHandler}>Complete Now</button>
            </div>
          )}
          {profileCompleted && <ExpenseTracker />}
        </>
      ) : (
        <h1>Welcome! Please login or sign up.</h1>
      )}
    </section>
  );
};

export default HomePage;
