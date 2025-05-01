import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Async thunks for API calls
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/projects/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/projects`, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/projects/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  projects: [],
  categories: [],
  currentProject: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filteredCategory: 'all',
};

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setFilteredCategory: (state, action) => {
      state.filteredCategory = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch projects';
      })
      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch project';
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create project';
      })
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.projects.findIndex((project) => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        state.currentProject = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update project';
      })
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = state.projects.filter((project) => project.id !== action.payload);
        if (state.currentProject && state.currentProject.id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete project';
      });
  },
});

export const { setFilteredCategory, clearCurrentProject } = projectsSlice.actions;

export const selectAllProjects = (state) => state.projects.projects;
export const selectProjectById = (state, projectId) => 
  state.projects.projects.find(project => project.id === projectId);
export const selectFilteredProjects = (state) => {
  const { projects, filteredCategory } = state.projects;
  return filteredCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === filteredCategory);
};
export const selectFeaturedProjects = (state) => 
  state.projects.projects.filter(project => project.featured);
export const selectProjectStatus = (state) => state.projects.status;
export const selectProjectError = (state) => state.projects.error;
export const selectCurrentProject = (state) => state.projects.currentProject;
export const selectFilteredCategory = (state) => state.projects.filteredCategory;

export default projectsSlice.reducer;
