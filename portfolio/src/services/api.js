import axios from 'axios';

// API URL constants
const API_URL = 'http://localhost:5000';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from Redux store if available
    try {
      const store = window.store;
      const token = store?.getState?.()?.auth?.token || localStorage.getItem('token');
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error in request interceptor:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Projects API
export const projectsAPI = {
  // Get all projects
  getAll: async () => {
    try {
      const response = await apiClient.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  // Get project by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  },
  
  // Create new project
  create: async (projectData) => {
    try {
      const response = await apiClient.post('/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  // Update project
  update: async (id, projectData) => {
    try {
      const response = await apiClient.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  },
  
  // Delete project
  delete: async (id) => {
    try {
      await apiClient.delete(`/projects/${id}`);
      return id;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }
};

// Users API
export const usersAPI = {
  // Get all users
  getAll: async () => {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  // Get user by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },
  
  // Create new user
  create: async (userData) => {
    try {
      const response = await apiClient.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  // Update user
  update: async (id, userData) => {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },
  
  // Delete user
  delete: async (id) => {
    try {
      await apiClient.delete(`/users/${id}`);
      return id;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    try {
      const response = await apiClient.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};

// Auth API
export const authAPI = {
  // Login
  login: async (credentials) => {
    try {
      // For JSON Server, we need to simulate authentication
      // by fetching the user with matching username
      const { username, password } = credentials;
      const response = await apiClient.get(`/users?username=${username}`);
      
      if (response.data.length === 0) {
        throw new Error('User not found');
      }
      
      const user = response.data[0];
      
      if (user.password !== password) {
        throw new Error('Invalid password');
      }
      
      // Create a token (this is just a simulation - in a real app, the server would generate this)
      const token = btoa(`${username}:${password}`);
      
      // Remove password from user object before returning
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }
};

// Contact API
export const contactAPI = {
  // Submit contact form
  submit: async (formData) => {
    try {
      const response = await apiClient.post('/contact', formData);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }
};

export default {
  projects: projectsAPI,
  users: usersAPI,
  categories: categoriesAPI,
  auth: authAPI,
  contact: contactAPI
};
