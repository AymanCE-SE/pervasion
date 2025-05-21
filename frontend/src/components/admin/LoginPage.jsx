import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { login, selectAuthStatus, selectAuthError, selectIsAuthenticated, clearError } from '../../redux/slices/authSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import './LoginPage.css';

const LoginPage = () => {
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
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Helmet>
        <title>{t('app.title')} - {t('admin.login')}</title>
      </Helmet>

      <section className={`login-page ${darkMode ? 'dark-mode' : ''}`}>
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className={`login-card ${darkMode ? 'dark-mode' : ''}`}>
                  <Card.Body className="p-4 p-md-5">
                    <div className="text-center mb-4">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="login-icon mb-3">
                          <FaSignInAlt size={40} className="icon-gradient" />
                        </div>
                        <h2 className="login-title">{t('admin.login')}</h2>
                        <p className="login-subtitle">{t('app.title')}</p>
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
                            : error?.detail ||
                              error?.message ||
                              (error?.non_field_errors ? error.non_field_errors.join(', ') : '') ||
                              (Array.isArray(error) ? error.join(', ') : Object.entries(error).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; ')) ||
                              t('admin.loginError')}
                        </Alert>
                      </motion.div>
                    )}
                    
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-4" controlId="loginUsername">
                        <Form.Label>{t('admin.username')}</Form.Label>
                        <div className="input-group">
                          <div className="input-group-text">
                            <FaUser />
                          </div>
                          <Form.Control
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            placeholder={t('admin.username')}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="loginPassword">
                        <Form.Label>{t('admin.password')}</Form.Label>
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
                            placeholder={t('admin.password')}
                          />
                        </div>
                      </Form.Group>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="primary" 
                          type="submit" 
                          className="login-btn w-100"
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
                              {t('admin.login')}
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </Form>
                    
                    <div className="text-center mt-4">
                      <motion.p 
                        className="login-info"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        <small>
                          Demo credentials: admin / admin123
                        </small>
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
