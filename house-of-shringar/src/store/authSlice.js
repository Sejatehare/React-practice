import { createSlice } from "@reduxjs/toolkit";

const saved = JSON.parse(localStorage.getItem("auth") || "null");

const initialState = saved || {
  token: null,
  userId: null,
  email: null,
  role: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      const { token, userId, email, role } = action.payload;
      state.token = token;
      state.userId = userId;
      state.email = email;
      state.role = role;
      state.isAuthenticated = true;
      localStorage.setItem("auth", JSON.stringify({
        token, userId, email, role, isAuthenticated: true
      }));
    },
    clearAuth(state) {
      state.token = null;
      state.userId = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("auth");
    },
    setRole(state, action) {
      state.role = action.payload;
      const stored = JSON.parse(localStorage.getItem("auth") || "{}");
      stored.role = action.payload;
      localStorage.setItem("auth", JSON.stringify(stored));
    }
  },
});

export const { setAuth, clearAuth, setRole } = authSlice.actions;
export default authSlice.reducer;
