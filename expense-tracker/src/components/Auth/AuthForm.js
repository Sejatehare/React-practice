import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Store/AuthContext";
import { Link } from "react-router-dom";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const emailRef = useRef();
  const passRef = useRef();
  const confirmPassRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const switchModeHandler = () => {
    setIsLogin((prev) => !prev);
    setError(null);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passRef.current.value;

    if (!isLogin && password !== confirmPassRef.current.value) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    const url = isLogin
      ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAl2_-4qrH9gTXCHoxpWVKvUtpgfgrcVTo`
      : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAl2_-4qrH9gTXCHoxpWVKvUtpgfgrcVTo`;

    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Authentication failed.");
      }

      authCtx.login(data.idToken, email, data.localId);

      if (!isLogin) {
        await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAl2_-4qrH9gTXCHoxpWVKvUtpgfgrcVTo`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requestType: "VERIFY_EMAIL",
              idToken: data.idToken,
            }),
          }
        );
        alert("Verification email sent. Please check your inbox.");
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label>Email</label>
          <input type="email" required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label>Password</label>
          <input type="password" required ref={passRef} />
        </div>

        {isLogin && (
          <div style={{ marginTop: "10px" }}>
            <Link to="/forget-password">Forgot Password?</Link>
          </div>
        )}

        {!isLogin && (
          <div className={classes.control}>
            <label>Confirm Password</label>
            <input type="password" required ref={confirmPassRef} />
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className={classes.actions}>
          <button type="submit">
            {isLoading ? "Sending..." : isLogin ? "Login" : "Create Account"}
          </button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchModeHandler}
          >
            {isLogin ? "Create new account" : "Have an account? Login"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
