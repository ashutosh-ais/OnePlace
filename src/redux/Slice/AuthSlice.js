import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  is_guest: false,
  customer_id: null,
  access_token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.is_guest = action.payload.is_guest || false;
      state.customer_id = action.payload.customer_id || null;
      state.access_token = action.payload.access_token || null;
    },
    logout: state => {
      return initialState;
    },
  },
});

export const authAction = authSlice.actions;
export default authSlice.reducer;
