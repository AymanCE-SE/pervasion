import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setError } from '../../redux/slices/errorSlice';
import { useTranslation } from 'react-i18next';

const GlobalErrorHandler = ({ children }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    // Handle uncaught errors
    const handleError = (error) => {
      console.error('Uncaught error:', error);
      dispatch(
        setError({
          message: error.message || t('error.unknownError'),
          stack: error.stack,
          timestamp: Date.now(),
        })
      );
    };

    // Handle unhandled promise rejections
    const handleRejection = (event) => {
      const error = event.reason || event;
      console.error('Unhandled rejection:', error);
      dispatch(
        setError({
          message: error.message || t('error.unhandledRejection'),
          stack: error.stack,
          timestamp: Date.now(),
        })
      );
    };

    // Add event listeners
    window.addEventListener('error', (event) => {
      handleError(event.error || event);
      return false; // Prevent default handler
    });

    window.addEventListener('unhandledrejection', handleRejection);

    // Clean up event listeners
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [dispatch, t]);

  return children;
};

export default GlobalErrorHandler;
