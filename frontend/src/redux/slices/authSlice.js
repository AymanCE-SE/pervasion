import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Get stored auth data from localStorage
const getStoredAuthData = () => {
  try {
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    let user = null;
    if (userJson) {
      try {
        user = JSON.parse(userJson);
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
    
    return {
      user,
      token,
      refreshToken
    };
  } catch (e) {
    console.error('Error getting stored auth data:', e);
    return { user: null, token: null, refreshToken: null };
  }
};

const { user: storedUser, token: storedToken, refreshToken: storedRefreshToken } = getStoredAuthData();

// Async thunk for registration
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { extra, rejectWithValue }) => {
    try {
      // Ensure field names match
      const registrationData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password_confirm: userData.password_confirm,
        name: userData.name
      };

      const response = await extra.apiService.auth.register(registrationData);
      
      return {
        message: response.data.message || 'Registration successful! Please check your email for verification.',
        email: userData.email
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Helper function to normalize user data
const normalizeUser = (userData, username) => {
  if (!userData) {
    return {
      id: null,
      username: username || '',
      email: username || '',
      name: '',
      role: 'user',
      is_staff: false,
      is_superuser: false
    };
  }
  
  return {
    id: userData.id,
    username: userData.username || username,
    email: userData.email || username,
    name: userData.name || userData.username || '',
    role: (userData.is_superuser || userData.is_staff) ? 'admin' : (userData.role || 'user'),
    is_staff: Boolean(userData.is_staff),
    is_superuser: Boolean(userData.is_superuser)
  };
};

// Helper function to handle login response
const handleLoginResponse = (responseData, email) => {
  const { access, refresh, user } = responseData;
  
  if (!access) {
    throw new Error('No access token received');
  }

  // Normalize user data
  const normalizedUser = {
    id: user?.id,
    email: user?.email || email,
    username: user?.username || email.split('@')[0], // Generate username from email if not provided
    name: user?.name || user?.username || email.split('@')[0],
    role: (user?.is_superuser || user?.is_staff) ? 'admin' : (user?.role || 'user'),
    is_staff: !!user?.is_staff,
    is_superuser: !!user?.is_superuser
  };

  console.log('Normalized user data:', normalizedUser);

  // Store in localStorage
  localStorage.setItem('user', JSON.stringify(normalizedUser));
  localStorage.setItem('token', access);
  if (refresh) {
    localStorage.setItem('refreshToken', refresh);
  }

  return {
    user: normalizedUser,
    token: access,
    refreshToken: refresh
  };
};

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue, extra }) => {
    console.log('Login thunk started with email:', email);
    
    try {
      if (!extra?.api) {
        const error = new Error('API service not available');
        console.error(error.message);
        throw error;
      }

      // Make login request with email instead of username
      const response = await extra.api.post('/auth/login/', { 
        email: email.trim(),
        password: password.trim()
      });

      console.log('Login response in thunk:', {
        hasData: !!response.data,
        hasUser: !!response.data?.user,
        hasToken: !!response.data?.access,
        responseData: response.data
      });

      if (!response.data) {
        const error = new Error('No data received from server');
        console.error(error.message);
        throw error;
      }

      // Check if user is verified before proceeding
      if (response.data?.user && !response.data.user.email_verified) {
        return rejectWithValue({
          detail: 'Please verify your email before logging in',
          email_unverified: true,
          email: email
        });
      }

      const result = handleLoginResponse(response.data, email);
      return result;
      
    } catch (error) {
      console.error('Login thunk error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
        stack: error.stack
      });
      
      return rejectWithValue({
        detail: error.response?.data?.detail || 
               error.response?.data?.message || 
               error.message || 
               'Login failed',
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
);

// Initial state
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
  verificationStatus: 'idle',
  verificationError: null,
  registrationSuccess: false,
  registrationEmail: null,
  isEmailVerified: false
};

// Add verification thunk
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { extra, rejectWithValue }) => {
    try {
      const response = await extra.apiService.auth.verifyEmail(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



// Update auth slice reducers
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearVerificationState: (state) => {
      state.verificationStatus = 'idle';
      state.verificationError = null;
      state.registrationSuccess = false;
      state.registrationEmail = null;
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
        state.error = null;
        state.registrationSuccess = true;
        state.registrationEmail = action.payload.email;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = {
          type: 'error',
          message: action.payload?.detail || 'Registration failed'
        };
      })
      // Verification
      .addCase(verifyEmail.pending, (state) => {
        state.verificationStatus = 'loading';
        state.verificationError = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.verificationStatus = 'succeeded';
        state.isEmailVerified = true;
        // Clear registration state after successful verification
        state.registrationSuccess = false;
        state.registrationEmail = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verificationStatus = 'failed';
        state.verificationError = action.payload;
        state.isEmailVerified = false;
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
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.isEmailVerified = action.payload.user.email_verified;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      });
  },
});

export const { clearError, clearVerificationState } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectRefreshToken = (state) => state.auth.refreshToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRole = (state) => state.auth.user?.role;
// Add these selectors after existing ones
export const selectVerificationStatus = (state) => state.auth.verificationStatus;
export const selectVerificationError = (state) => state.auth.verificationError;
export const selectRegistrationEmail = (state) => state.auth.registrationEmail;
export const selectRegistrationSuccess = (state) => state.auth.registrationSuccess;

export default authSlice.reducer;
