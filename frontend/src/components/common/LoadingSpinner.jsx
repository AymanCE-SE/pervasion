import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useAppSettings } from '../../hooks/useAppSettings';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', variant = 'primary', fullPage = false, message }) => {
  const { darkMode } = useAppSettings();
  
  const spinner = (
    <div className={`loading-spinner ${fullPage ? 'full-page' : ''} ${darkMode ? 'dark' : 'light'}`}>
      <Spinner 
        animation="border" 
        role="status"
        variant={variant}
        style={{
          width: size === 'sm' ? '1.5rem' : size === 'lg' ? '3rem' : '2rem',
          height: size === 'sm' ? '1.5rem' : size === 'lg' ? '3rem' : '2rem',
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      {message && <div className="loading-message">{message}</div>}
    </div>
  );

  return spinner;
};

export default LoadingSpinner;
