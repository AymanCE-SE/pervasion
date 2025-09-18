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
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaCheckCircle } from 'react-icons/fa';
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
    subject: '',
    message: '',
    userId: ''
  });
  
  // Form validation state
  const [validated, setValidated] = useState(false);
  
  // Pre-fill form data if user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Log user data for debugging
      console.log('Current user data:', currentUser);

      // Since we only have email in username, use it for email
      const email = currentUser.email;
      
      setFormData(prevState => ({
        ...prevState,
        name: '', // Leave name empty for user to fill
        email: email,
        userId: currentUser.id || ''
      }));

      // Don't validate yet since name is empty
      setValidated(false);
    } else {
      // Reset form for anonymous users
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        userId: ''
      });
      setValidated(false);
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

  // Reset form function
  const resetForm = () => {
    setFormData({
      name: isAuthenticated ? formData.name : '',
      email: isAuthenticated ? formData.email : '',
      subject: '',
      message: '',
      userId: isAuthenticated ? currentUser.id : ''
    });
    setValidated(false);
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
    
    // Clear previous validation state
    setValidated(false);
    
    const contactData = {
      ...formData,
      name: isAuthenticated ? formData.name : formData.name,
      email: isAuthenticated ? (currentUser.email || currentUser.username) : formData.email,
      userId: isAuthenticated ? currentUser.id : '',
      status: 'new'
    };
    
    try {
      await dispatch(submitContactForm(contactData)).unwrap();
      
      // Reset form on success
      setFormData({
        name: isAuthenticated ? formData.name : '',
        email: isAuthenticated ? formData.email : '',
        subject: '',
        message: '',
        userId: isAuthenticated ? currentUser.id : ''
      });
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        dispatch(clearContactStatus());
      }, 5000);
      
    } catch (error) {
      console.error('Contact form submission error:', error);
      setValidated(true);
    }
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
                      <p>{t('contact.data.address')}</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="icon-box">
                      <FaPhone />
                    </div>
                    <div className="info-text">
                      <h5>{t('contact.info.phone')}</h5>
                      {/* <p>+2 (11) 555-6666</p> */}
                      <p>{t('contact.data.phone1')}</p>
                      <p>{t('contact.data.phone2')}</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="icon-box">
                      <FaEnvelope />
                    </div>
                    <div className="info-text">
                      <h5>{t('contact.info.email')}</h5>
                      <p>{t('contact.data.email')}</p>
                    </div>
                  </div>
                  
                  <div className="map-container">
                    <iframe
                      src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Sharjah,UAE"
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
                  {contactStatus === 'succeeded' && successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Alert 
                        variant="success"
                        className="mb-4 d-flex align-items-center"
                      >
                        <div className="me-3">
                          <FaCheckCircle size={24} />
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold">Thank you!</h6>
                          <p className="mb-0">{successMessage}</p>
                        </div>
                      </Alert>
                    </motion.div>
                  )}
                  
                  {(contactStatus === 'failed' && contactError) && (
                    <Alert 
                      variant="danger"
                      className="mb-4"
                    >
                      {typeof contactError === 'object'
                        ? contactError.detail || contactError.message || JSON.stringify(contactError)
                        : contactError}
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
                        disabled={false}
                        className="bg-white"
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
                        disabled={isAuthenticated}
                        className={isAuthenticated ? 'bg-muted' : ''}
                      />
                      <Form.Control.Feedback type="invalid">
                        {t('contact.validation.invalidEmail')}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="contactSubject">
                      <Form.Label>{t('contact.form.subject')}</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder={t('contact.form.subject')}
                        className="bg-white text-dark"
                      />
                      <Form.Control.Feedback type="invalid">
                        {t('contact.validation.required')}
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
                        className="bg-white text-dark"
                      />
                      <Form.Control.Feedback type="invalid">
                        {t('contact.validation.required')}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button 
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
