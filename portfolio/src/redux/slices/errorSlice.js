import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  status: null,
  timestamp: null,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.message = action.payload.message;
      state.status = action.payload.status;
      state.timestamp = Date.now();
    },
    clearError: (state) => {
      state.message = null;
      state.status = null;
      state.timestamp = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;

export const selectError = (state) => state.error;

export default errorSlice.reducer;
