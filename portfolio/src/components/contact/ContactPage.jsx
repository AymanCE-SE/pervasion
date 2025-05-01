import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { selectIsAuthenticated, selectUser } from '../../redux/slices/authSlice';
import { 
  submitContactForm, 
  clearContactStatus,
  selectContactStatus, 
  selectContactError, 
  selectContactSuccessMessage 
} from '../../redux/slices/contactSlice';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';
import './ContactPage.css';

const ContactPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectUser);
  const contactStatus = useSelector(selectContactStatus);
  const contactError = useSelector(selectContactError);
  const successMessage = useSelector(selectContactSuccessMessage);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    userId: ''
  });
  
  // Form validation state
  const [validated, setValidated] = useState(false);
  
  // Pre-fill form data if user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setFormData(prevState => ({
        ...prevState,
        name: currentUser.name || '',
        email: currentUser.email || '',
        userId: currentUser.id || ''
      }));
    }
  }, [isAuthenticated, currentUser]);
  
  // Clear contact status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearContactStatus());
    };
  }, [dispatch]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Form validation
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    
    // Add timestamp and status to form data
    const contactData = {
      ...formData,
      status: 'new'
    };
    
    dispatch(submitContactForm(contactData))
      .unwrap()
      .then(() => {
        // Reset form on success
        setFormData({
          name: isAuthenticated ? (currentUser.name || '') : '',
          email: isAuthenticated ? (currentUser.email || '') : '',
          message: '',
          userId: isAuthenticated ? (currentUser.id || '') : ''
        });
        setValidated(false);
        
        // Clear status after 5 seconds
        setTimeout(() => {
          dispatch(clearContactStatus());
        }, 5000);
      });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <>
      <Helmet>
        <title>{t('app.title')} - {t('nav.contact')}</title>
        <meta name="description" content={t('contact.subtitle')} />
      </Helmet>

      <section className={`contact-page ${darkMode ? 'dark-mode' : ''}`}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header text-center"
          >
            <h1 className="page-title">{t('contact.title')}</h1>
            <p className="page-subtitle">{t('contact.subtitle')}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="contact-content"
          >
            <Row>
              <Col lg={5} className="mb-4 mb-lg-0">
                <motion.div variants={itemVariants} className="contact-info">
                  <h3>{t('contact.info.title')}</h3>
                  <p>{t('contact.subtitle')}</p>
                  
                  <div className="info-item">
                    <div className="icon-box">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="info-text">
                      <h5>{t('contact.info.address')}</h5>
                      <p>123 Design Street, Creative City, 10001</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="icon-box">
                      <FaPhone />
                    </div>
                    <div className="info-text">
                      <h5>{t('contact.info.phone')}</h5>
                      <p>+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="icon-box">
                      <FaEnvelope />
                    </div>
                    <div className="info-text">
                      <h5>{t('contact.info.email')}</h5>
                      <p>info@pervasion.com</p>
                    </div>
                  </div>
                  
                  <div className="map-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596552044!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1612345678901!5m2!1sen!2s"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Location Map"
                    ></iframe>
                  </div>
                </motion.div>
              </Col>
              
              <Col lg={7}>
                <motion.div variants={itemVariants} className="contact-form">
                  {(contactStatus === 'succeeded' && successMessage) && (
                    <Alert 
                      variant="success"
                      className="mb-4"
                    >
                      {successMessage}
                    </Alert>
                  )}
                  
                  {(contactStatus === 'failed' && contactError) && (
                    <Alert 
                      variant="danger"
                      className="mb-4"
                    >
                      {contactError}
                    </Alert>
                  )}
                  
                  {isAuthenticated && (
                    <Alert variant="info" className="mb-4">
                      <FaUser className="me-2" />
                      {t('contact.loggedInAs')} <strong>{currentUser.name || currentUser.username}</strong>
                    </Alert>
                  )}
                  
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="contactName">
                      <Form.Label>{t('contact.form.name')}</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder={t('contact.form.name')}
                        disabled={isAuthenticated && currentUser.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {t('contact.validation.required')}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="contactEmail">
                      <Form.Label>{t('contact.form.email')}</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder={t('contact.form.email')}
                        disabled={isAuthenticated && currentUser.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {t('contact.validation.invalidEmail')}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="contactMessage">
                      <Form.Label>{t('contact.form.message')}</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder={t('contact.form.message')}
                      />
                      <Form.Control.Feedback type="invalid">
                        {t('contact.validation.required')}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="submit-btn"
                      disabled={contactStatus === 'loading'}
                    >
                      {contactStatus === 'loading' ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {t('common.loading')}
                        </>
                      ) : (
                        t('contact.form.submit')
                      )}
                    </Button>
                  </Form>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>
    </>
  );
};

export default ContactPage;
