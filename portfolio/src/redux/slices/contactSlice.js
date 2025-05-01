import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Async thunk for submitting contact form
export const submitContactForm = createAsyncThunk(
  'contact/submitForm',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/contact`, {
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'new' // new, read, replied
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  successMessage: null
};

export const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    clearContactStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.status = 'succeeded';
        state.successMessage = 'Your message has been sent successfully!';
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to send message. Please try again.';
      });
  },
});

export const { clearContactStatus } = contactSlice.actions;

export const selectContactStatus = (state) => state.contact.status;
export const selectContactError = (state) => state.contact.error;
export const selectContactSuccessMessage = (state) => state.contact.successMessage;

export default contactSlice.reducer;
