import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    // 'Content-Type': 'application/json'
  },
  withCredentials: true // Important for CORS with credentials
});

// Add request interceptor for auth token
api.interceptors.request.use(config => {
  const path = config.url;
  const method = config.method?.toUpperCase();

  // Only GET requests to /projects and /categories are public
  const publicEndpoints = [
    { path: '/projects', method: 'GET' },
    { path: '/categories', method: 'GET' }
  ];
  const isPublicEndpoint = publicEndpoints.some(
    ep => path.startsWith(ep.path) && method === ep.method
  );

  const token = localStorage.getItem('token');
  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, error => Promise.reject(error));

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.post('http://localhost:8000/api/auth/refresh/', {
            refresh: refreshToken
          });
          const newAccess = res.data.access;
          localStorage.setItem('token', newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, force logout
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/admin/login';
        }
      } else {
        // No refresh token, force logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Create API service with methods for different endpoints
const apiService = {
  // Projects
  projects: {
    getAll: () => api.get('/projects/').then(res => res.data),
    getById: (id) => api.get(`/projects/${id}/`).then(res => res.data),
    create: (data) => api.post('/projects/', data).then(res => res.data),
    update: (id, data) => api.patch(`/projects/${id}/`, data).then(res => res.data),
    delete: (id) => api.delete(`/projects/${id}/`).then(res => res.data)
  },
  
  // Categories
  categories: {
    getAll: () => api.get('/categories/')
      .then(res => Array.isArray(res.data) ? res.data : (res.data.results || [])),
    getById: (id) => api.get(`/categories/${id}/`).then(res => res.data)
  },
  
  // Auth
  auth: {
    login: async (credentials) => {
      console.log('Login attempt with email:', credentials.email);

      try {
        const response = await api.post('/auth/login/', {
          email: credentials.email.trim(),
          password: credentials.password
        });
        
        console.log('Login response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data ? {
            ...response.data,
            access: response.data.access ? '[TOKEN_RECEIVED]' : 'NO_TOKEN',
            refresh: response.data.refresh ? '[REFRESH_TOKEN_RECEIVED]' : 'NO_REFRESH_TOKEN',
            user: response.data.user ? '[USER_DATA_RECEIVED]' : 'NO_USER_DATA'
          } : 'NO_DATA'
        });
        
        if (!response.data) {
          throw new Error('No data received from server');
        }
        
        return response;
      } catch (error) {
        console.error('Login error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data
          }
        });
        throw error;
      }
    },
    register: async (userData) => {
      // Create a new object to avoid mutation
      const registrationData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password_confirm: userData.password_confirm, // This was being transformed incorrectly
        name: userData.name
      };

      console.log('API Service: Registering user with data:', {
        ...registrationData,
        password: '[REDACTED]',
        password_confirm: '[REDACTED]'
      });

      const response = await api.post('/auth/register/', registrationData);
      return response;
    },
    getCurrentUser: async () => {
      const response = await api.get('/users/me/');
      return response;
    },
    verifyEmail: (token) => api.get(`/auth/verify-email/?token=${token}`)
  },
  
  // Contact
  contact: {
    send: (data) => api.post('/contacts/', data).then(res => res.data)
  }
};

// Export both the raw API instance and the service methods
export { api, apiService };
export default apiService;
