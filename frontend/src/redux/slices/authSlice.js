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
  async (userData, { rejectWithValue, extra }) => {
    try {
      if (!extra || (!extra.api && !extra.apiService)) {
        throw new Error('API service not available');
      }

      // Validate required fields
      const requiredFields = ['username', 'password', 'confirmPassword', 'email'];
      const missingFields = {};
      
      for (const field of requiredFields) {
        if (!userData[field]) {
          missingFields[field] = ['This field is required.'];
        }
      }
      
      if (Object.keys(missingFields).length > 0) {
        return rejectWithValue(missingFields);
      }

      // Prepare registration data
      const registerData = {
        username: userData.username,
        password: userData.password,
        password_confirm: userData.confirmPassword,  // Backend expects password_confirm
        email: userData.email,
        first_name: userData.name || '',
        last_name: userData.name || ''
      };

      console.log('Registration data:', { ...registerData, password: '[REDACTED]', password_confirm: '[REDACTED]' });

      try {
        // Try registration first
        let registerResponse = null;
        
        try {
          if (extra.apiService?.auth?.register) {
            console.log('Using apiService for registration');
            registerResponse = await extra.apiService.auth.register(registerData);
            console.log('apiService registration response:', registerResponse);
          } else if (extra.api) {
            console.log('Using direct API for registration');
            registerResponse = await extra.api.post('/auth/register/', registerData);
            console.log('Direct API registration response:', registerResponse);
          } else {
            throw new Error('No API service available');
          }

          // Log the response for debugging
          console.log('Registration response:', {
            status: registerResponse?.status,
            data: registerResponse?.data,
            headers: registerResponse?.headers
          });

        } catch (error) {
          console.error('Registration error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });

          // If username already exists or other validation errors
          if (error.response?.data) {
            return rejectWithValue(error.response.data);
          }
          throw error;
        }

        // Check if we have a valid response
        if (!registerResponse) {
          throw new Error('Registration failed - no response object');
        }

        // For apiService response
        if (registerResponse.data === undefined && registerResponse.username) {
          // apiService returned the data directly
          registerResponse = { data: registerResponse };
        }

        if (!registerResponse.data) {
          throw new Error('Registration failed - no response data');
        }

        // Registration successful, try to login
        const loginData = {
          username: userData.username,
          password: userData.password
        };

        try {
          let loginResponse = null;

          if (extra.apiService?.auth?.login) {
            loginResponse = await extra.apiService.auth.login(loginData);
          } else if (extra.api) {
            loginResponse = await extra.api.post('/auth/login/', loginData);
          }

          if (!loginResponse?.data) {
            throw new Error('Login failed after registration');
          }

          const { access, refresh } = loginResponse.data;

          // Get user data
          // Get user data with profile
          const userResponse = await extra.api.get('/users/me/', {
            headers: { 'Authorization': `Bearer ${access}` }
          });
          let user = userResponse.data;

          // Get profile data
          try {
            const profileResponse = await extra.api.get('/users/profile/', {
              headers: { 'Authorization': `Bearer ${access}` }
            });
            user = {
              ...user,
              ...profileResponse.data,
              email: user.email || userData.username
            };
          } catch (profileError) {
            console.warn('Error fetching profile after registration:', profileError);
            user = {
              ...user,
              email: userData.username
            };
          }

          // Store auth data
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', access);
          localStorage.setItem('refreshToken', refresh);

          return { user, token: access, refreshToken: refresh };
        } catch (loginError) {
          // If login fails after registration, return success
          return {
            detail: 'Account created successfully. Please try logging in.',
            registration_success: true
          };
        }
      } catch (error) {
        console.error('Registration error:', error.response?.data || error);
        return rejectWithValue({
          detail: error.message || 'Registration failed. Please try again.'
        });
      }
    } catch (error) {
      return rejectWithValue({
        detail: error.response?.data?.detail || error.message || 'Registration failed'
      });
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

      const result = handleLoginResponse(response.data, email);
      console.log('Login successful, user:', result.user);
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
  async (_, { getState, extra }) => {
    const { token } = getState().auth;
    
    try {
      if (extra?.api && token) {
        try {
          await extra.api.post('/auth/logout/', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } catch (error) {
          console.warn('Logout API error (proceeding with client-side logout):', error);
        }
      }
    } finally {
      // Clear all auth data from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }
);

// Initial state
const initialState = {
  user: storedUser ? {
    id: storedUser.id || null,
    username: storedUser.username || '',
    email: storedUser.email || '',
    name: storedUser.name || storedUser.username || '',
    role: (storedUser.is_superuser || storedUser.is_staff || storedUser.role === 'admin') 
      ? 'admin' 
      : (storedUser.role || 'user'),
    is_staff: Boolean(storedUser.is_staff),
    is_superuser: Boolean(storedUser.is_superuser)
  } : null,
  token: storedToken,
  refreshToken: storedRefreshToken,
  status: 'idle',
  error: null
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
        if (action.payload?.registration_success) {
          // Registration successful but login failed
          state.status = 'succeeded';
          state.error = {
            type: 'success',
            message: action.payload.detail
          };
        } else if (action.payload?.user) {
          // Registration and login both successful
          state.status = 'succeeded';
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;
          state.error = null;
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = {
          type: 'error',
          message: action.payload?.detail || 'Registration failed'
        };
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

export const { clearError } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectRefreshToken = (state) => state.auth.refreshToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRole = (state) => state.auth.user?.role;

export default authSlice.reducer;
