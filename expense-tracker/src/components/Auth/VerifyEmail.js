import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Store/AuthContext";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const verifyEmailHandler = () => {
    if (!authCtx.token) {
      alert("You must be logged in to verify your email.");
      return;
    }

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAl2_-4qrH9gTXCHoxpWVKvUtpgfgrcVTo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestType: "VERIFY_EMAIL",
          idToken: authCtx.token,
        }),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to send verification email.");
        }
      })
      .then((data) => {
        console.log("Verification email sent", data);
        alert("Verification link has been sent to your email.");
        navigate("/"); 
      })
      .catch((error) => {
        console.error("Verification error:", error);
        alert("Error: " + error.message);
      });
  };

  return (
    <div className="verify-email">
      <h2>Please verify your email</h2>
      <button onClick={verifyEmailHandler}>Send Verification Email</button>
    </div>
  );
};

export default VerifyEmail;
