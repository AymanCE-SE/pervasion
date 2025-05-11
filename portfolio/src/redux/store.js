import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import api from '../services/api';
import themeReducer from './slices/themeSlice';
import languageReducer from './slices/languageSlice';
import projectsReducer from './slices/projectsSlice';
import usersReducer from './slices/usersSlice';
import authReducer from './slices/authSlice';
import commentsReducer from './slices/commentsSlice';
import contactReducer from './slices/contactSlice';
import errorReducer from './slices/errorSlice';

// Combine reducers
const rootReducer = (state = {}, action) => ({
  theme: themeReducer(state.theme, action),
  language: languageReducer(state.language, action),
  projects: projectsReducer(state.projects, action),
  users: usersReducer(state.users, action),
  auth: authReducer(state.auth, action),
  comments: commentsReducer(state.comments, action),
  contact: contactReducer(state.contact, action),
  error: errorReducer(state.error, action),
});

// Persist configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['theme', 'language', 'auth'], // Only persist these reducers
  version: 1,
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, (state, action) => {
  // Clear all persisted state on logout
  if (action.type === 'auth/logout/fulfilled' || action.type === 'auth/logout/rejected') {
    state = undefined;
  }
  return rootReducer(state, action);
});

// Custom middleware for API error handling
const apiErrorMiddleware = (store) => (next) => (action) => {
  if (action.type.endsWith('/rejected')) {
    const error = action.error?.message || 'An error occurred';
    console.error('API Error:', error);
    
    // Handle 401 Unauthorized
    if (action.error?.status === 401) {
      // Dispatch logout action if token is invalid
      store.dispatch({ type: 'auth/logout' });
    }
  }
  return next(action);
};

// Custom middleware for API calls
const apiMiddleware = (store) => (next) => (action) => {
  // Add API to the action's meta if it's a thunk
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState, { api });
  }
  return next(action);
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types in the serializable check
        ignoredActions: [
          'error/setError',
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/FLUSH',
          'persist/REGISTER',
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          'meta.arg',
          'payload.timestamp',
          'payload.config',
          'payload.request',
          'register',
          'rehydrate',
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'error.timestamp',
          'auth.user',
          'auth.loading',
          'auth.error',
        ],
      },
      // Disable immutability check in development for better performance
      immutableCheck: process.env.NODE_ENV !== 'production' ? {
        warnAfter: 128,
        ignoredPaths: ['some.nested.ignore.path']
      } : false,
    }).concat(apiErrorMiddleware, apiMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Expose store on window for API interceptors
if (typeof window !== 'undefined') {
  window.store = store;
}

export default store;
