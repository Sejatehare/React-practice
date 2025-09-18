import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  mobile: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      return { ...state, ...action.payload };
    },
    clearUser() {
      return { name: "", email: "", mobile: "" };
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
