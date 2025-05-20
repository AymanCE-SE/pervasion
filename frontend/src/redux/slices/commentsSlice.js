import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_CONFIG } from '../../config/api';

// Async thunk for fetching comments for a project
export const fetchCommentsByProjectId = createAsyncThunk(
  'comments/fetchByProjectId',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/comments/`, {
        params: {
          project: projectId,
          ordering: '-created_at'
        }
      });
      return response.data.results || [];
    } catch (error) {
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        request: error.request,
        message: error.message
      });
      
      let errorMessage = 'Failed to fetch comments';
      if (error.response) {
        // Server responded with a status other than 2xx
        errorMessage = error.response.data?.detail || 
                     error.response.data?.message || 
                     error.response.data?.errors || 
                     JSON.stringify(error.response.data) ||
                     `Server responded with status ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response received from server';
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for adding a comment
export const addComment = createAsyncThunk(
  'comments/addComment',
  async (commentData, { rejectWithValue }) => {
    try {
      console.log('Sending comment to API:', commentData);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      console.log('Using token:', token ? 'Token exists' : 'No token');

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest' // Add this to help identify AJAX requests
        },
        validateStatus: function (status) {
          return status < 500; // Reject only if the status code is greater than or equal to 500
        }
      };
      
      // Format the data to match the backend's expected format
      const formattedData = {
        project: commentData.projectId,
        content: commentData.content
      };
      
      console.log('Sending formatted data to API:', JSON.stringify(formattedData, null, 2));
      console.log('Sending to URL:', `${API_CONFIG.BASE_URL}/comments/`);
      
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/comments/`,
        formattedData,
        config
      );
      
      console.log('API response status:', response.status);
      console.log('API response data:', response.data);
      
      // If we get here but the status is an error, handle it
      if (response.status >= 400) {
        throw new Error(response.data?.detail || 'Failed to add comment');
      }
      
      return response.data;
    } catch (error) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Failed to add comment';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Please log in to post a comment.';
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid data. Please check your input.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response.data) {
          // Try to extract error message from response
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.non_field_errors) {
            errorMessage = error.response.data.non_field_errors[0];
          }
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for deleting a comment (for admin or comment owner)
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      await axios.delete(`${API_CONFIG.BASE_URL}/comments/${commentId}/`, config);
      return commentId;
    } catch (error) {
      let errorMessage = 'Failed to delete comment';
      
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = 'You do not have permission to delete this comment.';
        } else if (error.response.status === 404) {
          errorMessage = 'Comment not found or already deleted.';
        } else if (error.response.data) {
          errorMessage = error.response.data.detail || JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  comments: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearCommentsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchCommentsByProjectId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCommentsByProjectId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = action.payload;
      })
      .addCase(fetchCommentsByProjectId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch comments';
      })
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments.unshift(action.payload); // Add to the beginning of the array
      })
      .addCase(addComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to add comment';
      })
      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = state.comments.filter(comment => comment.id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete comment';
      });
  },
});

export const { clearCommentsError } = commentsSlice.actions;

export const selectAllComments = (state) => Array.isArray(state.comments.comments) ? state.comments.comments : [];
export const selectCommentsStatus = (state) => state.comments.status;
export const selectCommentsError = (state) => state.comments.error;

export default commentsSlice.reducer;
