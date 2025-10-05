import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
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
          window.location.href = '/login';
        }
      } else {
        // No refresh token, force logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
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
      try {
        const response = await api.post('/auth/login/', {
          email: credentials.email.trim(),
          password: credentials.password
        });
        
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        return response;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    register: async (userData) => {
      // Create a new object to avoid mutation
      const registrationData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password_confirm: userData.password_confirm,
        name: userData.name
      };

      const response = await api.post('/auth/register/', registrationData);
      return response;
    },
    getCurrentUser: async () => {
      const response = await api.get('/users/me/');
      return response;
    },
    verifyEmail: async (token) => {
      try {
        const response = await api.get(`/auth/verify-email/?token=${token}`, {
          headers: {
            'X-Requested-From': 'verify-email'
          }
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
  
  // Contact
  contact: {
    send: (data) => api.post('/contacts/', data).then(res => res.data)
  }
}
};

// Export both the raw API instance and the service methods
export { api, apiService };
export default apiService;
