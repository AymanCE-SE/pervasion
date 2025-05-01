import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: 'en', // 'en' for English, 'ar' for Arabic
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    toggleLanguage: (state) => {
      state.language = state.language === 'en' ? 'ar' : 'en';
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;

export const selectLanguage = (state) => state.language.language;

export default languageSlice.reducer;
