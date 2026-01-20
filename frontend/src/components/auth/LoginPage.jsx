import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { login, selectAuthStatus, selectAuthError, selectIsAuthenticated, selectUser, clearError } from '../../redux/slices/authSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { FaUser, FaLock, FaSignInAlt, FaEnvelope } from 'react-icons/fa';
import './AuthPages.css';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const darkMode = useSelector(selectDarkMode);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear any previous errors when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    dispatch(clearError());

    try {
      const result = await dispatch(login(formData)).unwrap();
      // Only navigate if login was successful
      if (result && result.user) {
        const isAdmin = result.user.role === 'admin' || result.user.is_staff || result.user.is_superuser;
        const redirectPath = isAdmin ? '/admin/dashboard' : '/';
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      // Just log the error, don't redirect
      console.error('Login failed:', err);
    }
  };
  
  // Redirect if authenticated and clear errors on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdmin = user.role === 'admin' || user.is_staff || user.is_superuser;
      const redirectPath = isAdmin ? '/admin/dashboard' : '/';
      navigate(redirectPath, { replace: true });
    }
    // Remove error clearing from here since we handle it in handleSubmit
  }, [isAuthenticated, user, navigate]);

  const getErrorMessage = (error) => {
    if (!error) return '';

    // Handle email verification error
    if (error.email_unverified) {
      return t('auth.errors.emailNotVerified');
    }

    // Handle specific error messages
    if (error.detail?.includes('No active account')) {
      return t('auth.errors.invalidCredentials');
    }

    // Handle other specific cases
    switch (error.status) {
      case 401:
        return t('auth.errors.invalidCredentials');
      case 400:
        return t('auth.errors.invalidInput');
      case 429:
        return t('auth.errors.tooManyAttempts');
      default:
        return error.detail || t('auth.errors.generic');
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('app.title')} - {t('auth.login')}</title>
      </Helmet>

      <section className={`auth-page ${darkMode ? 'dark-mode' : ''}`}>
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className={`auth-card ${darkMode ? 'dark-mode' : ''}`}>
                  <Card.Body className="auth-card-body">
                    <div className="text-center mb-4">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="auth-icon mb-3">
                          <FaSignInAlt size={40} />
                        </div>
                        <h2 className="auth-title">{t('auth.login')}</h2>
                        <p className="auth-subtitle">{t('auth.welcomeBack')}</p>
                      </motion.div>
                    </div>

                    {/* Continue as Guest / View Portfolio Button */}
                    <motion.div 
                      className="text-center mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <Button
                        variant="outline-secondary"
                        className="guest-button"
                        onClick={() => navigate('/')}
                      >
                        <FaUser className="me-2" />
                        {t('auth.continueAsGuest') || 'View Home Page'}
                      </Button>
                    </motion.div>
                    
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert variant="danger" className="mb-4">
                          <div className="error-details">
                            <div className="error-message">
                              {getErrorMessage(error)}
                            </div>
                          </div>
                        </Alert>
                      </motion.div>
                    )}
                    
                    {error?.email_unverified && (
                      <Alert variant="warning" className="mb-4">
                        <Alert.Heading>Email Not Verified</Alert.Heading>
                        <p>
                          Please verify your email address before logging in.
                          Check your email inbox for the verification link.
                        </p>
                      </Alert>
                    )}
                    
                    <Form onSubmit={handleSubmit}>
                      <Form.Group controlId="formEmail" className="mb-4">
                        <Form.Label className="form-label">
                          <FaEnvelope className="me-2" />
                          {t('auth.email')}
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t('auth.enterEmail')}
                          className="form-control-lg"
                          disabled={status === 'loading'}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="loginPassword">
                        <Form.Label>{t('auth.password')}</Form.Label>
                        <div className="input-group">
                          <div className="input-group-text">
                            <FaLock />
                          </div>
                          <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder={t('auth.password')}
                          />
                        </div>
                      </Form.Group>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          type="submit" 
                          className="auth-btn w-100"
                          disabled={status === 'loading'}
                        >
                          {status === 'loading' ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              {t('common.loading')}
                            </>
                          ) : (
                            <>
                              <FaSignInAlt className="me-2" />
                              {t('auth.login')}
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </Form>
                    
                    <div className="text-center mt-4">
                      <motion.p 
                        className="auth-link"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        {t('auth.noAccount')} <Link to="/signup">{t('auth.signup')}</Link>
                      </motion.p>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default LoginPage;
