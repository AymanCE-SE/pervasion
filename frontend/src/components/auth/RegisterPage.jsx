import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { register, selectAuthStatus, selectAuthError, selectIsAuthenticated, clearError } from '../../redux/slices/authSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { FaUser, FaLock, FaEnvelope, FaUserPlus } from 'react-icons/fa';
import './AuthPages.css';

const RegisterPage = () => {
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
    password: '',
    confirmPassword: '',
    name: ''
  });
  
  // Form validation state
  const [validated, setValidated] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Check if passwords match when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        setPasswordsMatch(value === formData.confirmPassword);
      } else {
        setPasswordsMatch(formData.password === value);
      }
    }
    
    // Clear any previous errors when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Validate form
    if (form.checkValidity() === false || !passwordsMatch) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Log form data before submission
    console.log('Form data being submitted:', {
      username: formData.username,
      email: formData.email,
      password: '[REDACTED]',
      confirmPassword: '[REDACTED]',
      name: formData.name
    });
    
    // Verify passwords match before submission
    if (formData.password !== formData.confirmPassword) {
      console.error('Passwords do not match!');
      setPasswordsMatch(false);
      setValidated(true);
      return;
    }
    
    // Dispatch register action
    dispatch(register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      name: formData.name
    }));
  };
  
  // Redirect if already authenticated and clear errors on mount
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    // Clear errors on mount
    if (error) {
      dispatch(clearError());
    }
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
      <Helmet>
        <title>{t('app.title')} - {t('auth.register')}</title>
      </Helmet>
      
      <section className={`auth-page ${darkMode ? 'dark-mode' : ''}`}>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
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
                        <h2 className="auth-title">{t('auth.register')}</h2>
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
                          {typeof error === 'string' ? error : 
                           error.detail ? error.detail : 
                           error.non_field_errors ? error.non_field_errors.join(', ') : 
                           Object.entries(error).map(([key, value]) => 
                             `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
                           ).join('; ') || 'An error occurred. Please try again.'}
                        </Alert>
                      </motion.div>
                    )}
                    
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-4" controlId="registerUsername">
                            <Form.Label>{t('auth.username')}</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text"><FaUser /></span>
                              <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder={t('auth.usernamePlaceholder')}
                                required
                                minLength="3"
                              />
                              <Form.Control.Feedback type="invalid">
                                {t('auth.usernameRequired')}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-4" controlId="registerEmail">
                            <Form.Label>{t('auth.email')}</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text"><FaEnvelope /></span>
                              <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder={t('auth.emailPlaceholder')}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {t('auth.validEmailRequired')}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-4" controlId="registerName">
                        <Form.Label>{t('auth.name')}</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={t('auth.namePlaceholder')}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t('auth.nameRequired')}
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-4" controlId="registerPassword">
                            <Form.Label>{t('auth.password')}</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text"><FaLock /></span>
                              <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder={t('auth.passwordPlaceholder')}
                                required
                                minLength="8"
                              />
                              <Form.Control.Feedback type="invalid">
                                {t('auth.passwordRequirements')}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-4" controlId="registerConfirmPassword">
                            <Form.Label>{t('auth.confirmPassword')}</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text"><FaLock /></span>
                              <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder={t('auth.confirmPasswordPlaceholder')}
                                required
                                isInvalid={validated && !passwordsMatch}
                              />
                              <Form.Control.Feedback type="invalid">
                                {t('auth.passwordsMustMatch')}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <div className="d-grid gap-2 mt-4">
                        <Button 
                          variant="primary" 
                          type="submit" 
                          size="lg"
                          disabled={status === 'loading'}
                        >
                          {status === 'loading' ? t('common.loading') : t('auth.register')}
                        </Button>
                      </div>
                    </Form>
                    
                    <div className="text-center mt-4">
                      <p>
                        {t('auth.alreadyHaveAccount')} <Link to="/login" className="auth-link">{t('auth.login')}</Link>
                      </p>
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

export default RegisterPage;
