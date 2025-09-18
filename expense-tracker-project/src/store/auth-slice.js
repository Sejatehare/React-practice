import { createSlice } from '@reduxjs/toolkit';

const userFromStorage = localStorage.getItem('user');
const tokenFromStorage = localStorage.getItem('token');

const initialState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  token: tokenFromStorage || null,
  loading: false,
  isAuthenticated: !!userFromStorage,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      const { uid, email, displayName } = action.payload;
      state.user = { uid, email, displayName };
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('token', state.token);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { setUser, setToken, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
