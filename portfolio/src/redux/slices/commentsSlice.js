import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Async thunk for fetching comments for a project
export const fetchCommentsByProjectId = createAsyncThunk(
  'comments/fetchByProjectId',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/comments?projectId=${projectId}&_sort=createdAt&_order=desc`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for adding a comment
export const addComment = createAsyncThunk(
  'comments/addComment',
  async (commentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/comments`, {
        ...commentData,
        createdAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for deleting a comment (for admin or comment owner)
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/comments/${commentId}`);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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

export const selectAllComments = (state) => state.comments.comments;
export const selectCommentsStatus = (state) => state.comments.status;
export const selectCommentsError = (state) => state.comments.error;

export default commentsSlice.reducer;
