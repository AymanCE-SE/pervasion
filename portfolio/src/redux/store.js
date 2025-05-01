import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import languageReducer from './slices/languageSlice';
import projectsReducer from './slices/projectsSlice';
import usersReducer from './slices/usersSlice';
import authReducer from './slices/authSlice';
import commentsReducer from './slices/commentsSlice';
import contactReducer from './slices/contactSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
    projects: projectsReducer,
    users: usersReducer,
    auth: authReducer,
    comments: commentsReducer,
    contact: contactReducer,
  },
});

export default store;
