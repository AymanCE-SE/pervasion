import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearError } from '../../redux/slices/errorSlice';
import { useTranslation } from 'react-i18next';
import { Toast } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

const ErrorToast = () => {
  const { message, status, timestamp } = useSelector((state) => state.error);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShow(false);
        // Clear error from state after animation
        setTimeout(() => dispatch(clearError()), 300);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message, timestamp, dispatch]);

  const handleClose = () => {
    setShow(false);
    // Clear error from state after animation
    setTimeout(() => dispatch(clearError()), 300);
  };

  if (!message) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="error-toast-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Toast 
            onClose={handleClose} 
            show={show} 
            delay={3000} 
            autohide
            className="error-toast"
            bg="danger"
          >
            <Toast.Header closeButton>
              <strong className="me-auto">
                {status ? `${status} - ${t('error.error')}` : t('error.error')}
              </strong>
            </Toast.Header>
            <Toast.Body className="text-white">
              {message}
            </Toast.Body>
          </Toast>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorToast;
