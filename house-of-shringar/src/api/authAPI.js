import axios from "axios";

const API_KEY = "AIzaSyCS78u_o-JeNbkUlxgnGzjAAE1fREGlC3c";

const AUTH_BASE_URL =
  "https://identitytoolkit.googleapis.com/v1";

const authRequest = async (endpoint, payload) => {
  try {
    const { data } = await axios.post(
      `${AUTH_BASE_URL}/${endpoint}?key=${API_KEY}`,
      payload
    );

    return data;
  } catch (error) {
    console.error(
      "Firebase Auth Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const signup = (email, password) =>
  authRequest("accounts:signUp", {
    email,
    password,
    returnSecureToken: true,
  });

export const login = (email, password) =>
  authRequest("accounts:signInWithPassword", {
    email,
    password,
    returnSecureToken: true,
  });

export const sendPasswordReset = (email) =>
  authRequest("accounts:sendOobCode", {
    requestType: "PASSWORD_RESET",
    email,
  });