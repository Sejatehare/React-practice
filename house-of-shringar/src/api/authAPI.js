import axios from "axios";

const API_KEY = "AIzaSyCS78u_o-JeNbkUlxgnGzjAAE1fREGlC3c";
const AUTH_BASE = "https://identitytoolkit.googleapis.com/v1";

export async function signup(email, password) {
  const resp = await axios.post(`${AUTH_BASE}/accounts:signUp?key=${API_KEY}`, {
    email,
    password,
    returnSecureToken: true,
  });
  return resp.data; 
}

export async function login(email, password) {
  const resp = await axios.post(`${AUTH_BASE}/accounts:signInWithPassword?key=${API_KEY}`, {
    email,
    password,
    returnSecureToken: true,
  });
  return resp.data;
}

export async function sendPasswordReset(email) {
  const resp = await axios.post(`${AUTH_BASE}/accounts:sendOobCode?key=${API_KEY}`, {
    requestType: "PASSWORD_RESET",
    email,
  });
  return resp.data;
}

