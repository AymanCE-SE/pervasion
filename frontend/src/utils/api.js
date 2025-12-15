import axios from 'axios';
import { store } from '../redux/store';

// Use Vite env first, fallback to older REACT env, then localhost
// Use env-specified API in dev or when separate backend is used; otherwise
// default to a relative `/api` path so the client and API use same origin
const BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_URL)
  || process.env.REACT_APP_API_URL
  || '/api';

const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  },
  // allow cookies/auth to be sent when needed; backend allows credentials
  withCredentials: true,
});

// Request interceptor: auth + no-cache + cache-bust for GET
api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    config.headers['If-Modified-Since'] = '0';

    // add auth token if present
    const { auth } = store.getState();
    const token = auth?.token || localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // ensure urls end with a trailing slash to avoid 301 redirects (important for POSTs)
    if (config.url && typeof config.url === 'string') {
      // separate query string if present
      const parts = config.url.split('?');
      const path = parts[0];
      const qs = parts[1] ? `?${parts[1]}` : '';
      if (!path.endsWith('/')) {
        config.url = `${path}/${qs}`;
      }
    }

    // cache-bust GETs to avoid 304
    if ((config.method || '').toLowerCase() === 'get') {
      config.params = { ...(config.params || {}), _t: Date.now() };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: return full response (not response.data)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        // Only force logout/redirect if the request actually carried an auth token
        // or the caller explicitly expects auth (config.requireAuth)
        const req = error.config || {};
        const hadAuthHeader = !!(req.headers && (req.headers.Authorization || req.headers.authorization));
        const requiredAuth = !!req.requireAuth;

        if (hadAuthHeader || requiredAuth) {
          store.dispatch({ type: 'auth/logout' });
          window.location.href = '/login';
        } else {
          // For anonymous endpoints, just pass through the error object so UI can handle it
        }
      }
      return Promise.reject({
        status,
        message: data?.message || 'An error occurred',
        errors: data?.errors,
        data: data?.data || data,
      });
    } else if (error.request) {
      return Promise.reject({ status: 0, message: 'No response from server. Please check your connection.' });
    } else {
      return Promise.reject({ status: 0, message: error.message || 'Request failed' });
    }
  }
);

// API methods (keep existing apiService but adapt callers if needed)
export const apiService = {
  // Auth
  login: (credentials) => api.post('/auth/login', credentials).then(r => r.data),
  register: (userData) => api.post('/auth/register', userData).then(r => r.data),
  getProfile: () => api.get('/auth/profile').then(r => r.data),
  
  // Projects
  getProjects: (params = {}) => api.get('/projects', { params }).then(r => r.data),
  getProject: (id) => api.get(`/projects/${id}`).then(r => r.data),
  createProject: (data) => api.post('/projects', data).then(r => r.data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data).then(r => r.data),
  deleteProject: (id) => api.delete(`/projects/${id}`).then(r => r.data),
  
  // Users (admin only)
  getUsers: () => api.get('/users').then(r => r.data),
  getUser: (id) => api.get(`/users/${id}`).then(r => r.data),
  createUser: (data) => api.post('/users', data).then(r => r.data),
  updateUser: (id, data) => api.put(`/users/${id}`, data).then(r => r.data),
  deleteUser: (id) => api.delete(`/users/${id}`).then(r => r.data),
  
  // Uploads
  uploadFile: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      },
    }).then(r => r.data);
  },
};

// make axios instance available as named and default export to avoid import mismatches
// export { api };
export default api;
