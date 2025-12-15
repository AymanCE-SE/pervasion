import { createSlice } from '@reduxjs/toolkit';

// Environment-driven defaults
const DEFAULT_LANGUAGE = (import.meta && import.meta.env && import.meta.env.VITE_DEFAULT_LANGUAGE) || null;
const FORCE_DEFAULT_LANGUAGE = (import.meta && import.meta.env && String(import.meta.env.VITE_FORCE_DEFAULT_LANGUAGE).toLowerCase() === 'true');

// Get language from localStorage, i18next storage, env default, or browser language
const getInitialLanguage = () => {
  const savedLang = localStorage.getItem('language') || localStorage.getItem('i18nextLng');
  if (savedLang && !FORCE_DEFAULT_LANGUAGE) {
    return savedLang;
  }

  if (DEFAULT_LANGUAGE) {
    if (FORCE_DEFAULT_LANGUAGE) {
      localStorage.setItem('language', DEFAULT_LANGUAGE);
      localStorage.setItem('i18nextLng', DEFAULT_LANGUAGE);
    }
    return DEFAULT_LANGUAGE;
  }

  const browserLang = (navigator && navigator.language) ? navigator.language.split('-')[0] : 'en';
  return ['ar', 'en'].includes(browserLang) ? browserLang : 'en';
};

const initialState = {
  language: getInitialLanguage(),
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      const newLang = action.payload;
      if (['ar', 'en'].includes(newLang)) {
        state.language = newLang;
        localStorage.setItem('language', newLang);
        localStorage.setItem('i18nextLng', newLang);
      }
    },
    toggleLanguage: (state) => {
      const newLang = state.language === 'en' ? 'ar' : 'en';
      state.language = newLang;
      localStorage.setItem('language', newLang);
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;

export const selectLanguage = (state) => state.language.language;

export default languageSlice.reducer;
