import axios from 'axios';
import store from '../redux/store';
import { selectRefreshToken } from '../redux/slices/authSlice';

const API_URL = 'http://localhost:8000/api';

/**
 * Refreshes the access token using the refresh token
 * @returns {Promise<string>} The new access token
 */
export const refreshAccessToken = async () => {
  try {
    // Get the refresh token from the Redux store
    const refreshToken = selectRefreshToken(store.getState());
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    // Send a request to refresh the token
    const response = await axios.post(`${API_URL}/auth/refresh/`, {
      refresh: refreshToken
    });
    
    // Extract the new access token
    const { access } = response.data;
    
    // Update the token in localStorage
    localStorage.setItem('token', access);
    
    return access;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // If refresh fails, clear authentication data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    // Force reload to reset the application state
    window.location.href = '/login';
    throw error;
  }
};

/**
 * Creates an axios instance with authentication and token refresh handling
 */
export const createAuthenticatedAxiosInstance = () => {
  const instance = axios.create();
  
  // Add request interceptor to add the token to all requests
  instance.interceptors.request.use(
    async (config) => {
      // Get the token from localStorage (it might have been updated)
      let token = localStorage.getItem('token');
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Add response interceptor to handle token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If the error is due to an expired token and we haven't tried to refresh yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Refresh the token
          const newToken = await refreshAccessToken();
          
          // Update the request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          // Retry the request
          return axios(originalRequest);
        } catch (refreshError) {
          // If refresh fails, redirect to login
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
  
  return instance;
};

// Export a pre-configured instance
export const authAxios = createAuthenticatedAxiosInstance();
