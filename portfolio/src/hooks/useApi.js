import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setError } from '../redux/slices/errorSlice';

/**
 * Custom hook to handle API calls with loading and error states
 * @param {Function} apiCall - The API call function (should return a promise)
 * @param {Object} options - Additional options
 * @param {boolean} options.showError - Whether to show error messages (default: true)
 * @returns {[Function, boolean, any, any]} - [execute, loading, data, error]
 */
const useApi = (apiCall, options = {}) => {
  const { showError = true } = options;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setLocalError] = useState(null);
  const dispatch = useDispatch();

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setLocalError(null);
      
      try {
        const response = await apiCall(...args);
        setData(response);
        return response;
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
        setLocalError(errorMessage);
        
        if (showError) {
          dispatch(
            setError({
              message: errorMessage,
              status: err.response?.status,
            })
          );
        }
        
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiCall, dispatch, showError]
  );

  return [execute, { loading, data, error }];
};

export default useApi;
