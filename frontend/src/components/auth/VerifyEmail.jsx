import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { verifyEmail } from '../../redux/slices/authSlice';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  
  const verificationStatus = useSelector(state => state.auth.verificationStatus);
  const verificationError = useSelector(state => state.auth.verificationError);
  
  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token && !verificationAttempted) {
      setVerificationAttempted(true);
      dispatch(verifyEmail(token))
        .unwrap()
        .catch(error => {
          console.error('Verification error:', error);
        });
    }
  }, [dispatch, location, verificationAttempted]);
  
  useEffect(() => {
    if (verificationStatus === 'succeeded') {
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [verificationStatus, navigate]);

  return (
    <Container className="auth-page py-5">
      <motion.div
        className="auth-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {verificationStatus === 'loading' && (
          <div className="text-center">
            <Spinner animation="border" />
            <p className="mt-3">Verifying your email...</p>
          </div>
        )}

        {verificationStatus === 'succeeded' && (
          <Alert variant="success">
            <Alert.Heading>Email Verified!</Alert.Heading>
            <p>Your email has been successfully verified. You will be redirected to login...</p>
          </Alert>
        )}

        {verificationStatus === 'failed' && (
          <Alert variant="danger">
            <Alert.Heading>Verification Failed</Alert.Heading>
            <p>{verificationError?.detail || 'Failed to verify email. Please try again.'}</p>
            <div className="mt-3">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
            </div>
          </Alert>
        )}
      </motion.div>
    </Container>
  );
};

export default VerifyEmail;