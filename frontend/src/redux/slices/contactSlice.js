import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for submitting contact form
export const submitContactForm = createAsyncThunk(
  'contact/submitForm',
  async (formData, { rejectWithValue, extra }) => {
    try {
      // Check if extra exists before using it
      if (!extra || !extra.api) {
        throw new Error('API service not available');
      }
      
      const response = await extra.api.post('/contacts/', {
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'new' // new, read, replied
      });
      return response.data;
    } catch (error) {
      // Format error message
      const errorData = error.response?.data;
      const errorMessage = typeof errorData === 'object'
        ? errorData.detail || errorData.message || JSON.stringify(errorData)
        : error.message || 'Failed to send message';
      
      return rejectWithValue(errorMessage);
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
        state.error = typeof action.payload === 'string'
          ? action.payload
          : 'Failed to send message. Please try again.';
      });
  },
});

export const { clearContactStatus } = contactSlice.actions;

export const selectContactStatus = (state) => state.contact.status;
export const selectContactError = (state) => state.contact.error;
export const selectContactSuccessMessage = (state) => state.contact.successMessage;

export default contactSlice.reducer;
