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

export const fetchContacts = createAsyncThunk(
  'adminContacts/fetchContacts',
  async (_, { rejectWithValue, extra }) => {
    try {
      if (!extra?.api) throw new Error('API service not available');
      const response = await extra.api.get('/contacts/');
      return response.data; // Will include count, next, previous, and results
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || 'Failed to fetch contacts'
      );
    }
  }
);

export const markAsRead = createAsyncThunk(
  'contacts/markAsRead',
  async (contactId, { rejectWithValue, extra }) => {
    try {
      if (!extra?.api) throw new Error('API service not available');
      const response = await extra.api.patch(`/contacts/${contactId}/mark_as_read/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || 'Failed to mark message as read'
      );
    }
  }
);

// Add new action
export const deleteContact = createAsyncThunk(
  'adminContacts/deleteContact',
  async (contactId, { rejectWithValue, extra }) => {
    try {
      await extra.api.delete(`/contacts/${contactId}/`);
      return contactId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || 'Failed to delete contact'
      );
    }
  }
);

const initialState = {
  contacts: [], // Make sure this is an array
  status: 'idle',
  error: null
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
      .addCase(submitContactForm.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.successMessage = 'Your message has been sent successfully. We will get back to you soon!';
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to send message. Please try again.';
        state.successMessage = null;
      })
      .addCase(fetchContacts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contacts = action.payload.results; // Store just the results array
        state.error = null;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
      });
  },
});

export const { clearContactStatus } = contactSlice.actions;

export const selectContactStatus = (state) => state.contact.status;
export const selectContactError = (state) => state.contact.error;
export const selectContactSuccessMessage = (state) => state.contact.successMessage;
export const selectAllContacts = (state) => state.contact.contacts || [];
export const selectContactsStatus = (state) => state.contact.status;
export const selectContactsError = (state) => state.contact.error;

export default contactSlice.reducer;
