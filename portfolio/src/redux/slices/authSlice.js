import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Check if user is already logged in from localStorage
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const token = localStorage.getItem('token') || null;

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // In a real application, this would be a proper authentication endpoint
      // For our JSON server demo, we'll simulate authentication by fetching users
      const response = await axios.get(`${API_URL}/users?username=${username}`);
      
      if (response.data.length === 0) {
        return rejectWithValue('User not found');
      }
      
      const user = response.data[0];
      
      if (user.password !== password) {
        return rejectWithValue('Invalid password');
      }
      
      // Create a token (this is just a simulation - in a real app, the server would generate this)
      const token = btoa(`${username}:${password}`);
      
      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = user;
      
      // Store user and token in localStorage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('token', token);
      
      return { user: userWithoutPassword, token };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
);

const initialState = {
  user: user,
  token: token,
  isAuthenticated: !!token,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      });
  },
});

export const { clearError } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
