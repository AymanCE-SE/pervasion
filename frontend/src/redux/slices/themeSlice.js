import { createSlice } from '@reduxjs/toolkit';

// Get theme preference from localStorage or system preference
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('darkMode');

  // Env-driven defaults
  const envDefault = (import.meta && import.meta.env && import.meta.env.VITE_DEFAULT_THEME)
    ? String(import.meta.env.VITE_DEFAULT_THEME).toLowerCase()
    : null;
  const forceEnv = (import.meta && import.meta.env && String(import.meta.env.VITE_FORCE_DEFAULT_THEME).toLowerCase() === 'true');

  if (savedTheme !== null && !forceEnv) {
    return savedTheme === 'true';
  }

  if (envDefault === 'dark') return true;
  if (envDefault === 'light') return false;

  // Check system preference
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const initialState = {
  darkMode: getInitialTheme(),
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', action.payload);
    },
  },
});

export const { toggleTheme, setDarkMode } = themeSlice.actions;

export const selectDarkMode = (state) => state.theme.darkMode;

export default themeSlice.reducer;
