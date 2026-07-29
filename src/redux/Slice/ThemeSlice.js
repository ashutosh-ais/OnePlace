import { createSlice } from '@reduxjs/toolkit';
import { PRIMARY_OS } from '../../constants/color';

const initialState = {
  themeColor: PRIMARY_OS,
  colorMode: 'system', // 'light', 'dark', 'system'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeColor: (state, action) => {
      state.themeColor = action.payload;
    },
    setColorMode: (state, action) => {
      state.colorMode = action.payload;
    },
    setThemeFromDB: (state, action) => {
      if (action.payload.themeColor) {
        state.themeColor = action.payload.themeColor;
      }
      if (action.payload.colorMode) {
        state.colorMode = action.payload.colorMode;
      }
    },
  },
});

export const themeAction = themeSlice.actions;
export default themeSlice.reducer;
