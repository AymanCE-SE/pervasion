import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { register, selectAuthStatus, selectAuthError, selectIsAuthenticated, clearError } from '../../redux/slices/authSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { FaUser, FaLock, FaEnvelope, FaUserPlus } from 'react-icons/fa';
import './AuthPages.css';

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const darkMode = useSelector(selectDarkMode);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    // Clear any previous API errors when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      errors.username = t('validation.required');
    } else if (formData.username.length < 3) {
      errors.username = t('validation.usernameLength');
    }
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = t('validation.required');
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = t('validation.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('validation.emailInvalid');
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = t('validation.required');
    } else if (formData.password.length < 6) {
      errors.password = t('validation.passwordLength');
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('validation.passwordMatch');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const { confirmPassword, ...registrationData } = formData;
      registrationData.role = 'user'; // Set default role to user
      registrationData.createdAt = new Date().toISOString();
      
      dispatch(register(registrationData));
    }
  };
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Helmet>
        <title>{t('app.title')} - {t('auth.signup')}</title>
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
                          <FaUserPlus size={40} className="icon-gradient" />
                        </div>
                        <h2 className="auth-title">{t('auth.signup')}</h2>
                        <p className="auth-subtitle">{t('auth.createAccount')}</p>
                      </motion.div>
                    </div>
                    
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert variant="danger" className="mb-4">
                          {typeof error === 'string'
                            ? error
                            : error?.message ||
                              error?.detail ||
                              (Array.isArray(error) ? error.join(', ') : Object.entries(error).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; '))}
                        </Alert>
                      </motion.div>
                    )}
                    
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="signupUsername">
                        <Form.Label>{t('auth.username')}</Form.Label>
                        <div className="input-group">
                          <div className="input-group-text">
                            <FaUser />
                          </div>
                          <Form.Control
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            isInvalid={!!formErrors.username}
                            placeholder={t('auth.username')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.username}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="signupName">
                        <Form.Label>{t('auth.name')}</Form.Label>
                        <div className="input-group">
                          <div className="input-group-text">
                            <FaUser />
                          </div>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            isInvalid={!!formErrors.name}
                            placeholder={t('auth.name')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.name}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="signupEmail">
                        <Form.Label>{t('auth.email')}</Form.Label>
                        <div className="input-group">
                          <div className="input-group-text">
                            <FaEnvelope />
                          </div>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            isInvalid={!!formErrors.email}
                            placeholder={t('auth.email')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.email}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="signupPassword">
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
                            isInvalid={!!formErrors.password}
                            placeholder={t('auth.password')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.password}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="signupConfirmPassword">
                        <Form.Label>{t('auth.confirmPassword')}</Form.Label>
                        <div className="input-group">
                          <div className="input-group-text">
                            <FaLock />
                          </div>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            isInvalid={!!formErrors.confirmPassword}
                            placeholder={t('auth.confirmPassword')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.confirmPassword}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="primary" 
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
                              <FaUserPlus className="me-2" />
                              {t('auth.signup')}
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
                        {t('auth.alreadyHaveAccount')} <a href="/login">{t('auth.login')}</a>
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

export default SignupPage;
