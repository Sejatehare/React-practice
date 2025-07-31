import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
  token: "",
  email: "",
  userId: "",
  isLoggedIn: false,
  login: (token, email, userId) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  const userIsLoggedIn = !!token;

  const loginHandler = (token, email, userId) => {
    setToken(token);
    setEmail(email);
    setUserId(userId);
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("userId", userId);
  };

  const logoutHandler = () => {
    setToken(null);
    setEmail(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
  };

  const contextValue = {
    token,
    email,
    userId,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
