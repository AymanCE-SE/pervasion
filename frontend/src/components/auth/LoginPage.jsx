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
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };
  
  // Redirect if authenticated and clear errors on mount
  useEffect(() => {
    if (isAuthenticated) {
      // If user is admin, redirect to dashboard, otherwise to home
      const redirectPath = user?.role === 'admin' || user?.is_staff || user?.is_superuser 
        ? '/admin/dashboard' 
        : '/';
      navigate(redirectPath);
    }
    // Clear errors on mount
    if (error) {
      dispatch(clearError());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, navigate, error, dispatch]);

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
                  <Card.Body className="p-4 p-md-5">
                    <div className="text-center mb-4">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="auth-icon mb-3">
                          <FaSignInAlt size={40} className="icon-gradient" />
                        </div>
                        <h2 className="auth-title">{t('auth.login')}</h2>
                        <p className="auth-subtitle">{t('auth.welcomeBack')}</p>
                      </motion.div>
                    </div>
                    
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert variant="danger" className="mb-4">
                          <div className="error-details">
                            <div className="error-message">
                              {typeof error === 'string'
                                ? error
                                : error?.detail ||
                                  error?.message ||
                                  (error?.non_field_errors ? error.non_field_errors.join(', ') : '') ||
                                  (Array.isArray(error) ? error.join(', ') : Object.entries(error).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; ')) ||
                                  t('auth.loginError')}
                            </div>
                            {process.env.NODE_ENV === 'development' && error?.data && (
                              <pre className="mt-2 mb-0 text-muted small">
                                {JSON.stringify(error.data, null, 2)}
                              </pre>
                            )}
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
