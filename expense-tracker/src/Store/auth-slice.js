import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  token: null,
  email: null,
  userId: null,
  isLoggedIn: false,
  isPremium: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.userId = action.payload.userId;
      state.isLoggedIn = true;
      localStorage.setItem("userId", action.payload.userId);
    },
    logout(state) {
      state.token = null;
      state.email = null;
      state.userId = null;
      state.isLoggedIn = false;
      state.isPremium = false;
      localStorage.removeItem("userId");
    },
    activatePremium(state) {
      state.isPremium = true;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;