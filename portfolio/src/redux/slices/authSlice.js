import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Check if user is already logged in from localStorage
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const token = localStorage.getItem('token') || null;

// Async thunk for registration
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Check if username already exists
      const usernameCheck = await axios.get(`${API_URL}/users?username=${userData.username}`);
      if (usernameCheck.data.length > 0) {
        return rejectWithValue('Username already exists');
      }
      
      // Check if email already exists
      const emailCheck = await axios.get(`${API_URL}/users?email=${userData.email}`);
      if (emailCheck.data.length > 0) {
        return rejectWithValue('Email already exists');
      }
      
      // Create new user with id and name
      // Note: JSON Server will automatically assign an ID if we don't provide one
      const newUser = {
        username: userData.username,
        password: userData.password,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'user',
        createdAt: new Date().toISOString()
      };
      
      const response = await axios.post(`${API_URL}/users`, newUser);
      
      // Create a token (this is just a simulation - in a real app, the server would generate this)
      const token = btoa(`${userData.username}:${userData.password}`);
      
      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = response.data;
      
      // Store user and token in localStorage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('token', token);
      
      return { user: userWithoutPassword, token };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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
      // Registration
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Registration failed';
      })
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
export const selectUserRole = (state) => state.auth.user?.role;

export default authSlice.reducer;
