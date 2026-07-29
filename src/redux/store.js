import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slice/AuthSlice';
import habitReducer from './Slice/HabitSlice';
import themeReducer from './Slice/ThemeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitReducer,
    theme: themeReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents warnings with navigation objects in state
    }),
});
