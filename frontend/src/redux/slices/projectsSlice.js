import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

// Async thunks for API calls
// Async thunk to fetch all categories
export const fetchCategories = createAsyncThunk(
  'projects/fetchCategories',
  async (_, { rejectWithValue, extra }) => {
    try {
      if (!extra || (!extra.api && !extra.apiService)) {
        throw new Error('API service not available');
      }

      let data = null;

      // Try apiService first
      if (extra.apiService?.categories?.getAll) {
        try {
          data = await extra.apiService.categories.getAll();
        } catch (e) {
          console.warn('ApiService failed, falling back to direct API call:', e);
        }
      }

      // Fallback to direct API
      if (!data && extra.api) {
        const response = await extra.api.get('/categories/');
        // Handle paginated response (results array) or direct array
        data = response.data.results || response.data;
      }

      if (!data) {
        throw new Error('Failed to fetch categories');
      }
      
      // Ensure we have an array
      if (!Array.isArray(data)) {
        console.error('Expected categories to be an array, got:', data);
        data = [];
      }

      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return rejectWithValue({
        detail: error.response?.data?.detail || error.message || 'Failed to fetch categories'
      });
    }
  }
);

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue, extra }) => {
    try {
      let data = null;
      if (extra?.apiService?.projects?.getAll) {
        try {
          data = await extra.apiService.projects.getAll();
        } catch (e) {
          // fallback
        }
      }
      if (!data && extra?.api) {
        const response = await extra.api.get('/projects/');
        data = response.data;
      }
      if (!data) throw new Error('Failed to fetch projects');
      // Handle paginated and non-paginated
      return data.results || data;
    } catch (error) {
      return rejectWithValue({
        detail: error.response?.data?.detail || error.message || 'Failed to fetch projects'
      });
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id, { rejectWithValue, extra }) => {
    try {
      let data = null;
      if (extra?.apiService?.projects?.getById) {
        try {
          data = await extra.apiService.projects.getById(id);
        } catch (e) {}
      }
      if (!data && extra?.api) {
        const response = await extra.api.get(`/projects/${id}/`);
        data = response.data;
      }
      if (!data) throw new Error('Failed to fetch project');
      return data;
    } catch (error) {
      return rejectWithValue({
        detail: error.response?.data?.detail || error.message || 'Failed to fetch project'
      });
    }
  }
);

// Add a custom error handler
const handleApiError = (error, fallbackMessage) => {
  console.error('API Error:', {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message
  });
  
  return error.response?.data || { 
    detail: error.message || fallbackMessage 
  };
};

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue, extra }) => {
    try {
      if (!extra?.api) {
        throw new Error('API client not available');
      }

      const isFormData = projectData instanceof FormData;
      const config = {
        headers: {
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
        }
      };

      const response = await extra.api.post('/projects/', projectData, config);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error; // Network or other errors
      }
      return rejectWithValue(handleApiError(error, 'Failed to create project'));
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue, extra }) => {
    try {
      let data = null;
      const isFormData = projectData instanceof FormData;
      
      // Log what we're sending to help with debugging
      console.log(`Updating project ${id} with FormData:`, isFormData);
      
      if (isFormData) {
        // For debugging - log files in FormData
        if (process.env.NODE_ENV !== 'production') {
          console.log('FormData contents for update:');
          for (let [key, value] of projectData.entries()) {
            if (value instanceof File) {
              console.log(`${key}: File (${value.name}, ${value.type}, ${value.size} bytes)`);
            } else {
              console.log(`${key}: ${value}`);
            }
          }
        }
      }
      
      if (extra?.apiService?.projects?.update) {
        try {
          data = await extra.apiService.projects.update(id, projectData);
        } catch (e) {
          console.warn('ApiService update failed, falling back to direct API');
        }
      }
      
      if (!data && extra?.api) {
        // Configure request properly for FormData
        const config = isFormData ? {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        } : { 
          headers: { 'Content-Type': 'application/json' } 
        };
        
        console.log('Sending update request with config:', {
          url: `/projects/${id}/`,
          method: 'PATCH',
          isFormData,
          headers: config.headers
        });
        
        const response = await extra.api.patch(`/projects/${id}/`, projectData, config);
        data = response.data;
      }
      
      if (!data) throw new Error('Failed to update project');
      return data;
    } catch (error) {
      console.error('Project update error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      return rejectWithValue(
        error.response?.data || { detail: error.message || 'Failed to update project' }
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue, extra }) => {
    try {
      let success = false;
      if (extra?.apiService?.projects?.delete) {
        try {
          await extra.apiService.projects.delete(id);
          success = true;
        } catch (e) {}
      }
      if (!success && extra?.api) {
        await extra.api.delete(`/projects/${id}/`);
        success = true;
      }
      if (!success) throw new Error('Failed to delete project');
      return id;
    } catch (error) {
      return rejectWithValue({
        detail: error.response?.data?.detail || error.message || 'Failed to delete project'
      });
    }
  }
);

export const createCategory = createAsyncThunk(
  'projects/createCategory',
  async (categoryData, { rejectWithValue, extra }) => {
    try {
      let data = null;
      if (extra?.apiService?.categories?.create) {
        try {
          data = await extra.apiService.categories.create(categoryData);
        } catch (e) {}
      }
      if (!data && extra?.api) {
        const response = await extra.api.post('/categories/', categoryData);
        data = response.data;
      }
      if (!data) throw new Error('Failed to create category');
      return data;
    } catch (error) {
      return rejectWithValue({
        detail: error.response?.data?.detail || error.message || 'Failed to create category'
      });
    }
  }
);

export const updateCategory = createAsyncThunk(
  'projects/updateCategory',
  async ({ id, data }, { rejectWithValue, extra }) => {
    try {
      if (!extra?.api) throw new Error('API client not available');
      const res = await extra.api.put(`/categories/${id}/`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'projects/deleteCategory',
  async (id, { rejectWithValue, extra }) => {
    try {
      if (!extra?.api) throw new Error('API client not available');
      await extra.api.delete(`/categories/${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  projects: [],
  status: 'idle',
  error: null,
  categories: [],
  categoriesStatus: 'idle',
  categoriesError: null,
  currentProject: null,
  filteredCategory: 'all'
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
    // Add resetFormState reducer
    resetFormState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.currentProject = null;
    },
    // Add action to reset form state
    // resetFormState: (state) => {
    //   state.error = null;
    //   state.status = 'idle';
    // },
    // Add action to handle file validation errors
    setFileErrors: (state, action) => {
      state.error = action.payload;
    },
    cleanupProjectState: (state) => {
      state.error = null;
      state.status = 'idle';
      state.currentProject = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = 'loading';
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded';
        state.categories = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = 'failed';
        state.categoriesError = action.payload?.detail || 'Failed to fetch categories';
      })
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle both array and paginated responses
        state.projects = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload.results || []);
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.detail || action.error.message;
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
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects.push(action.payload);
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create project';
      })
      // Update project
      .addCase(updateProject.pending, (state, action) => {
        state.status = 'loading';
        // Store previous state for rollback
        state.previousState = {
          projects: [...state.projects],
          currentProject: state.currentProject
        };
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
        state.error = action.payload;
        // Rollback on failure
        if (state.previousState) {
          state.projects = state.previousState.projects;
          state.currentProject = state.previousState.currentProject;
        }
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
      })
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.categoriesStatus = 'loading';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded';
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.categoriesStatus = 'failed';
        state.categoriesError = action.payload?.detail || 'Failed to create category';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.categories.findIndex(c => String(c.id) === String(action.payload.id));
        if (idx !== -1) state.categories[idx] = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.categoriesError = action.payload || action.error.message;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.categoriesStatus = 'loading';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => String(c.id) !== String(action.payload));
        state.categoriesStatus = 'succeeded';
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.categoriesStatus = 'failed';
        state.categoriesError = action.payload || action.error.message;
      });
  },
});

export const { setFilteredCategory, clearCurrentProject, resetFormState } = projectsSlice.actions;

// Base selectors
const selectProjectsState = state => state.projects;
const selectProjectsArray = state => state.projects.projects || [];
// const selectCategoriesArray = state => state.projects.categories || [];

// Memoized selector for all projects
export const selectAllProjects = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.projects || []
);

// Memoized selector for a specific project by ID
export const selectProjectById = createSelector(
  [selectProjectsArray, (state, projectId) => projectId],
  (projects, projectId) => projects.find(project => project.id === projectId) || null
);

// Memoized selector for filtered projects
export const selectFilteredProjects = createSelector(
  [selectProjectsArray, state => state.projects.filteredCategory],
  (projects, filteredCategory) => {
    if (!filteredCategory || filteredCategory === 'all') {
      return projects;
    }
    // Convert both to string for comparison
    return projects.filter(project => 
      String(project.category) === String(filteredCategory)
    );
  }
);

// Memoized selector for featured projects
export const selectFeaturedProjects = createSelector(
  [selectProjectsArray],
  (projects) => projects.filter(project => project.featured)
);

// Status and error selectors
// Status and error selectors
export const selectProjectStatus = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.status
);

export const selectCategoriesStatus = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.categoriesStatus
);

export const selectCategoriesError = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.categoriesError
);

// Select all categories
export const selectAllCategories = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.categories || []
);

export const selectProjectError = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.error
);

export const selectCurrentProject = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.currentProject
);

export const selectFilteredCategory = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.filteredCategory
);





export default projectsSlice.reducer;
