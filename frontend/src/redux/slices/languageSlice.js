import { createSlice } from '@reduxjs/toolkit';

// Get language from localStorage or browser language
const getInitialLanguage = () => {
  const savedLang = localStorage.getItem('language');
  if (savedLang) {
    return savedLang;
  }
  
  // Default to browser language if available, otherwise 'en'
  const browserLang = navigator.language.split('-')[0];
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
