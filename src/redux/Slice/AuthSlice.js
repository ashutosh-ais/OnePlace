import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  is_guest: false,
  user_id: null,
  phone_number: null,
  access_token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.is_guest = action.payload.is_guest || false;
      state.user_id = action.payload.user_id || null;
      state.phone_number = action.payload.phone_number || null;
      state.access_token = action.payload.access_token || null;
    },
    logout: () => {
      return initialState;
    },
  },
});

export const authAction = authSlice.actions;
export default authSlice.reducer;
