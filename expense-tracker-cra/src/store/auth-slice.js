import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  loading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action){ state.user = action.payload },
    setToken(state, action){ state.token = action.payload },
    setLoading(state, action){ state.loading = action.payload },
    logout(state){ state.user = null; state.token = null }
  }
});

export const { setUser, setToken, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
