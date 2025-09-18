import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../Store/auth-slice";
import { toast } from "react-toastify";

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const switchAuthModeHandler = () => setIsLogin((prev) => !prev);

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (!enteredEmail || !enteredPassword) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const url = isLogin
        ? "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAl2_-4qrH9gTXCHoxpWVKvUtpgfgrcVTo"
        : "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAl2_-4qrH9gTXCHoxpWVKvUtpgfgrcVTo";

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Authentication failed!");
      }

      const data = await response.json();
      dispatch(authActions.login({ token: data.idToken, userId: data.localId }));

      toast.success(isLogin ? "Login successful!" : "Account created!");
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
    setIsLoading(false);
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              ref={emailInputRef}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              ref={passwordInputRef}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={switchAuthModeHandler}
            className="text-blue-600 hover:underline ml-1"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </section>
  );
};

export default AuthForm;
