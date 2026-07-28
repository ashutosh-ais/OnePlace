import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slice/AuthSlice';
import habitReducer from './Slice/HabitSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents warnings with navigation objects in state
    }),
});
