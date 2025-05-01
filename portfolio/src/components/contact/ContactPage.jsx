import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import './ContactPage.css';

const ContactPage = () => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  // Form validation state
  const [validated, setValidated] = useState(false);
  
  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    error: false,
    message: ''
  });

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
    setSubmitting(true);
    
    try {
      // Send data to JSON Server
      await axios.post('http://localhost:5000/contact', formData);
      
      // Success message
      setSubmitStatus({
        success: true,
        error: false,
        message: t('contact.success')
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      setValidated(false);
    } catch (error) {
      // Error message
      setSubmitStatus({
        success: false,
        error: true,
        message: t('contact.error')
      });
    } finally {
      setSubmitting(false);
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setSubmitStatus({
          success: false,
          error: false,
          message: ''
        });
      }, 5000);
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
                      <p>{t('contact.info.addressValue')}</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="icon-box">
                      <FaPhone />
                    </div>
                    <div className="info-text">
                      <h5>{t('contact.info.phone')}</h5>
                      <p>{t('contact.info.phoneValue')}</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="icon-box">
                      <FaEnvelope />
                    </div>
                    <div className="info-text">
                      <h5>{t('contact.info.email')}</h5>
                      <p>{t('contact.info.emailValue')}</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="icon-box">
                      <i className="far fa-clock"></i>
                    </div>
                    <div className="info-text">
                      <h5>{t('contact.info.hours')}</h5>
                      <p>{t('contact.info.hoursValue')}</p>
                    </div>
                  </div>
                  
                  <div className="map-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.9503398796587!2d-73.9988097!3d40.7193213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a47df06b185%3A0xc80da61087762802!2sNew%20York%2C%20NY%2010012!5e0!3m2!1sen!2sus!4v1651234567890!5m2!1sen!2sus"
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
                  {(submitStatus.success || submitStatus.error) && (
                    <Alert 
                      variant={submitStatus.success ? 'success' : 'danger'}
                      className="mb-4"
                    >
                      {submitStatus.message}
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
                      disabled={submitting}
                    >
                      {submitting ? (
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
