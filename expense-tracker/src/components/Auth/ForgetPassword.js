import React, { useRef } from "react";
import classes from "./ForgetPassword.css";

const ForgetPassword = () => {
  const emailRef = useRef();

  const resetPassword = async () => {
    const email = emailRef.current.value;
    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=YOUR_KEY",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestType: "PASSWORD_RESET", email }),
        }
      );
      if (!res.ok) throw new Error("Failed to send reset email");
      alert("Password reset link sent!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <input type="email" placeholder="Enter email" ref={emailRef} className={classes.forgetpassword}/>
      <button onClick={resetPassword}>Reset Password</button>
    </div>
  );
};

export default ForgetPassword;
