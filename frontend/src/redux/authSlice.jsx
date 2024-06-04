// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userEmail: null,
  },
  reducers: {
    setUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
    clearUserEmail: (state) => {
      state.userEmail = null;
    },
  },
});

export const { setUserEmail, clearUserEmail } = authSlice.actions;

export const selectUserEmail = (state) => state.auth.userEmail;

export default authSlice.reducer;
