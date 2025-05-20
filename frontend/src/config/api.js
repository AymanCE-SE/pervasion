// API Configuration
export const API_CONFIG = {
  // Base URL for all API requests
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  
  // Default request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Default headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Authentication
  AUTH: {
    // Token storage key
    TOKEN_KEY: 'auth_token',
    // Token type (e.g., 'Bearer', 'JWT')
    TOKEN_TYPE: 'Bearer',
    // Token header name
    HEADER_NAME: 'Authorization',
  },
  
  // Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login/',
      REGISTER: '/auth/register/',
      LOGOUT: '/auth/logout/',
      REFRESH: '/auth/token/refresh/',
      ME: '/auth/me/',
    },
    PROJECTS: {
      BASE: '/projects/',
      DETAIL: (id) => `/projects/${id}/`,
    },
    USERS: {
      BASE: '/users/',
      DETAIL: (id) => `/users/${id}/`,
      ME: '/users/me/',
    },
    // Add more endpoints as needed
  },
  
  // Error codes that should trigger a logout
  LOGOUT_CODES: [401, 403],
  
  // Enable/disable request/response logging
  DEBUG: import.meta.env.DEV,
};

export default API_CONFIG;
