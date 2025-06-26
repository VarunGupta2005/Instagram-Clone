import { createSlice } from '@reduxjs/toolkit';

// Check for system preference, but don't use localStorage here.
// Redux-persist will handle the storage.
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

const initialState = {
  mode: prefersDarkMode ? 'dark' : 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    // Optional: A way to set it directly if needed
    setTheme: (state, action) => {
      state.mode = action.payload; // 'light' or 'dark'
    }
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;