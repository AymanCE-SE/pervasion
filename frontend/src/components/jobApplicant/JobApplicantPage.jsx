import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { FaPaperPlane, FaCheckCircle, FaUserTie, FaBriefcase } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './JobApplicantPage.css';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import api from '../../utils/api';

const JobApplicantPage = () => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    city_country: '',
    position: '',
    work_type: '',
    years_of_experience: '', // will be one of: '0_1','1_3','3_5','5_plus'
    portfolio_link: '',
    tools: [], // array of strings
    worked_in_agency_before: false,
    about_you: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validated, setValidated] = useState(false);

  const positions = [
    { value: 'graphic_designer', label: t('jobApplicant.positions.graphic_designer') },
    { value: 'motion_designer', label: t('jobApplicant.positions.motion_designer') },
    { value: 'content_creator', label: t('jobApplicant.positions.content_creator') },
    { value: 'media_buyer', label: t('jobApplicant.positions.media_buyer') }
  ];

  const workTypes = [
    { value: 'full_time', label: 'Full-time' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'remote', label: 'Remote' },
    { value: 'internship', label: 'Internship' }
  ];

  const experienceOptions = [
    { value: '0_1', label: '<1' },
    { value: '1_3', label: '1–3' },
    { value: '3_5', label: '3–5' },
    { value: '5_plus', label: '5+' }
  ];

  const toolsOptions = [
    'Photoshop',
    'Illustrator',
    'After Effects',
    'Premiere',
    'Figma',
    'Meta ads Manager',
    'others'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'tools') {
      // checkbox group for tools
      setFormData(prev => {
        const set = new Set(prev.tools || []);
        if (checked) set.add(value); else set.delete(value);
        return { ...prev, tools: Array.from(set) };
      });
      if (fieldErrors.tools) setFieldErrors(prev => ({ ...prev, tools: '' }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.full_name || !formData.email || !formData.phone || !formData.position || !formData.about_you) {
      setValidated(true);
      toast.error(t('common.error') || 'Please fill required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        city_country: formData.city_country,
        position: formData.position,
        work_type: formData.work_type || null,
        years_of_experience: formData.years_of_experience || null,
        portfolio_link: formData.portfolio_link,
        tools: formData.tools,
        worked_in_agency_before: !!formData.worked_in_agency_before,
        about_you: formData.about_you
      };

      const res = await api.post('/job-applications/', payload);
      const successMsg = res?.data?.message || t('jobApplicant.success');
      toast.success(successMsg);
      console.log('Submission response:', res);
      setSuccess(true);
      console.log('Form submitted successfully');
      // reset form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        city_country: '',
        position: '',
        work_type: '',
        years_of_experience: '',
        portfolio_link: '',
        tools: [],
        worked_in_agency_before: false,
        about_you: ''
      });
      setFieldErrors({});
    } catch (err) {
      console.error('Submission error:', err);
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const mapped = {};
        Object.entries(data).forEach(([k,v]) => { mapped[k] = Array.isArray(v) ? v[0] : v; });
        setFieldErrors(mapped);
        if (data.detail) toast.error(data.detail);
      } else {
        toast.error(t('jobApplicant.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <>
      <Helmet>
        <title>{t('jobApplicant.title')} | {t('app.title')}</title>
        <meta name="description" content={t('jobApplicant.subtitle')} />
      </Helmet>

      <motion.div className="job-applicant-page" variants={containerVariants} initial="hidden" animate="visible">
        {/* Hero */}
        <header className={`job-hero ${darkMode ? 'dark-mode' : ''}`}>
          <Container>
            <div className="hero-inner text-center">
              <h1 className="hero-title">{t('jobApplicant.title')}</h1>
              <p className="hero-subtitle">{t('jobApplicant.heroSubtitle') || t('jobApplicant.subtitle')}</p>
            </div>
          </Container>
        </header>

         <Container>
          {/* top spacing */}
          <motion.div className="page-top-space" variants={itemVariants} />

           {success && (
             <motion.div className="success-alert" variants={itemVariants}>
               <Alert variant="success" className="d-flex align-items-center">
                 <FaCheckCircle className="me-2" size={20} />
                 <span>{t('jobApplicant.success')}</span>
               </Alert>
             </motion.div>
           )}

           {/* Form */}
           <Row className="justify-content-center">
             <Col lg={8}>
               <motion.div variants={itemVariants}>
                <Card className={`form-card ${darkMode ? 'dark-mode' : ''}`}>
                  <Card.Header className={`form-card-header ${darkMode ? 'dark-mode' : ''}`}>
                    <div className="header-row d-flex align-items-center gap-3">
                      <FaUserTie size={22} />
                      <div>
                        <div className="header-title">{t('jobApplicant.formHeader.title')}</div>
                        <div className="header-desc">{t('jobApplicant.formHeader.subtitle')}</div>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                     <Form noValidate validated={validated} onSubmit={handleSubmit}>
                      {/* Basic Information */}
                      <h5 className="section-heading mb-3">
                        <FaUserTie className="section-icon me-2" />{t('jobApplicant.sections.basicInformation')}
                      </h5>
                      <p className="section-desc mb-3">{t('jobApplicant.sections.basicInformationDesc')}</p>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="fullName">
                            <Form.Label>{t('jobApplicant.form.fullName')}</Form.Label>
                            <Form.Control name="full_name" value={formData.full_name} onChange={handleInputChange} isInvalid={!!fieldErrors.full_name} required placeholder={t('jobApplicant.form.placeholders.fullName')} />
                            {fieldErrors.full_name && <Form.Control.Feedback type="invalid">{fieldErrors.full_name}</Form.Control.Feedback>}
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="email">
                            <Form.Label>{t('jobApplicant.form.email')}</Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} isInvalid={!!fieldErrors.email} required placeholder={t('jobApplicant.form.placeholders.email')} />
                            {fieldErrors.email && <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>}
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="phone">
                            <Form.Label>{t('jobApplicant.form.phone')}</Form.Label>
                            <Form.Control name="phone" value={formData.phone} onChange={handleInputChange} isInvalid={!!fieldErrors.phone} required placeholder={t('jobApplicant.form.placeholders.phone')} />
                            {fieldErrors.phone && <Form.Control.Feedback type="invalid">{fieldErrors.phone}</Form.Control.Feedback>}
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="cityCountry">
                            <Form.Label>{t('jobApplicant.form.cityCountry')}</Form.Label>
                            <Form.Control name="city_country" value={formData.city_country} onChange={handleInputChange} placeholder={t('jobApplicant.form.placeholders.cityCountry')} />
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Professional Background */}
                      <h5 className="section-heading mb-3 mt-4">
                        <FaBriefcase className="section-icon me-2" />{t('jobApplicant.sections.professionalBackground')}
                      </h5>
                      <p className="section-desc mb-3">{t('jobApplicant.sections.professionalBackgroundDesc')}</p>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="position">
                            <Form.Label>{t('jobApplicant.form.position')}</Form.Label>
                            <Form.Select name="position" value={formData.position} onChange={handleInputChange} isInvalid={!!fieldErrors.position} required>
                              <option value="">{t('jobApplicant.form.selectPosition')}</option>
                              {positions.map(pos => <option key={pos.value} value={pos.value}>{pos.label}</option>)}
                            </Form.Select>
                            {fieldErrors.position && <Form.Control.Feedback type="invalid">{fieldErrors.position}</Form.Control.Feedback>}
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="workType">
                            <Form.Label>{t('jobApplicant.form.work_type')}</Form.Label>
                            <Form.Select name="work_type" value={formData.work_type} onChange={handleInputChange}>
                              <option value="">{t('jobApplicant.form.placeholders.work_type')}</option>
                              {workTypes.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="experience">
                            <Form.Label>{t('jobApplicant.form.experience')}</Form.Label>
                            <Form.Select name="years_of_experience" value={formData.years_of_experience} onChange={handleInputChange}>
                              <option value="">{t('jobApplicant.form.placeholders.experience')}</option>
                              {experienceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="portfolio">
                            <Form.Label>{t('jobApplicant.form.portfolio')}</Form.Label>
                            <Form.Control name="portfolio_link" type="url" value={formData.portfolio_link} onChange={handleInputChange} placeholder={t('jobApplicant.form.placeholders.portfolio')} />
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Tools checkboxes */}
                    <Form.Group className="mb-3" controlId="tools">
                      <Form.Label>{t('jobApplicant.form.tools')}</Form.Label>
                      <div className={`tools-grid ${darkMode ? 'dark-mode' : ''}`}>
                        {toolsOptions.map((tool, index) => (
                          <Form.Check
                            key={tool}
                            id={`tool-${index}`}
                            label={tool}
                            name="tools"
                            type="checkbox"
                            value={tool}
                            checked={formData.tools.includes(tool)}
                            onChange={handleInputChange}
                            className="tools-checkbox"
                          />
                        ))}
                      </div>
                    </Form.Group>

                      <Form.Group className="mb-3" controlId="agencyExperience">
                        <Form.Check type="checkbox" label={t('jobApplicant.form.workedInAgencyBefore')} name="worked_in_agency_before" checked={formData.worked_in_agency_before} onChange={handleInputChange} className="mt-2" />
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="aboutYou">
                        <Form.Label>{t('jobApplicant.form.aboutYou')}</Form.Label>
                        <Form.Control as="textarea" rows={4} name="about_you" value={formData.about_you} onChange={handleInputChange} isInvalid={!!fieldErrors.about_you} required placeholder={t('jobApplicant.form.placeholders.aboutYou')} />
                        {fieldErrors.about_you && <Form.Control.Feedback type="invalid">{fieldErrors.about_you}</Form.Control.Feedback>}
                      </Form.Group>

                      <div className="form-actions">
                        <Button variant="primary" type="submit" className="submit-btn" disabled={loading}>
                          {loading ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>{t('common.loading')}</> : <><FaPaperPlane className="me-2" />{t('jobApplicant.form.submit')}</>}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
               </motion.div>
             </Col>
           </Row>
         </Container>
       </motion.div>
     </>
   );
};

export default JobApplicantPage;