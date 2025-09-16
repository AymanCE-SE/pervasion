import React, { useState } from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { selectLanguage } from '../../redux/slices/languageSlice';
import './AboutPage.css';
import OurPartners from './OurPartners';
import aboutImg from '../../assets/aboutImg.jpeg';
import { FaBullhorn, FaChartLine, FaPalette, FaSearch } from 'react-icons/fa';
const AboutPage = () => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);

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

  // Skills data
  const skills = [
    { name: 'branding', level: 95 },
    { name: 'ui', level: 90 },
    { name: 'print', level: 85 },
    { name: 'motion', level: 80 },
    { name: 'illustration', level: 75 },
    { name: 'photography', level: 70 },
  ];

  // Experience stats
  const stats = [
    { name: 'years', value: 5 },
    { name: 'clients', value: 50 },
    { name: 'projects', value: 120 },
  ];

  // Services data
  const services = [
    {
      icon: <FaPalette />,
      headline: t('home.services.branding.headline', 'Branding & Visual Identity'),
      children: [
        t('home.services.branding.branch1', 'Logo Design'),
        t('home.services.branding.branch2', 'Complete Brand Identity'),
        t('home.services.branding.branch3', 'Company Profiles & Presentations'),
        t('home.services.branding.branch4', 'Business Cards & Print Materials'),
        t('home.services.branding.branch5', 'Packaging & Label Design'),
      ],
    },
    {
      icon: <FaBullhorn />,
      headline: t('home.services.social.headline', 'Social Media Marketing'),
      children: [
        t('home.services.social.branch1', 'Social Media Account Setup'),
        t('home.services.social.branch2', 'Creative & Engaging Content Writing'),
        t('home.services.social.branch3', 'Regular Post Design & Publishing'),
        t('home.services.social.branch4', 'Monthly Performance Reports'),
      ],
    },
    {
      icon: <FaSearch />,
      headline: t('home.services.seo.headline', 'SEO & Content Marketing'),
      children: [
        t('home.services.seo.branch1', 'Website Analysis'),
        t('home.services.seo.branch2', 'Keyword Research'),
        t('home.services.seo.branch3', 'SEO-Friendly Article Writing'),
        t('home.services.seo.branch4', 'Image & Metadata Optimization'),
      ],
    },
    {
      icon: <FaChartLine />,
      headline: t('home.services.growth.headline', 'Growth Strategy'),
      children: [
        t('home.services.growth.branch1', 'Comprehensive Marketing Plans'),
        t('home.services.growth.branch2', 'Brand Strategy Consulting'),
        t('home.services.growth.branch3', 'Integration with Analytics & Tracking Tools'),
        t('home.services.growth.branch4', 'Ongoing Brand Support'),
      ],
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = idx => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <>
      <Helmet>
        <title>{t('app.title')} - {t('nav.about')}</title>
        <meta name="description" content={t('about.subtitle')} />
      </Helmet>

      <section className={`about-page ${darkMode ? 'dark-mode' : ''}`}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header text-center"
          >
            <h1 className="page-title">{t('about.title')}</h1>
            <p className="page-subtitle">{t('about.subtitle')}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="about-content"
          >
            <Row className="align-items-center">
              <Col lg={6} className="mb-4 mb-lg-0">
                <motion.div variants={itemVariants} className="about-image">
                  <img 
                    src={aboutImg} 
                    alt={t('about.title')}
                    className="img-fluid"
                  />
                </motion.div>
              </Col>
              
              <Col lg={6}>
                <motion.div variants={itemVariants} className="about-text">
                  <h2>{t('about.title')}</h2>
                  <p>{t('about.bio')}</p>
                </motion.div>
              </Col>
            </Row>
            
            <Row className="services-section">
              <Col lg={12}>
                <motion.div variants={itemVariants}>
                  <h3 className="section-subtitle">{t('home.services.title', 'Our Services')}</h3>
                </motion.div>
                <Row className='mt-3'>
                  {services.map((service, idx) => (
                    <Col md={6} lg={4} key={idx} className="mb-4">
                      <motion.div
                        variants={itemVariants}
                        className={`service-card${openIndex === idx ? ' open' : ''}`}
                        onClick={() => handleToggle(idx)}
                        tabIndex={0}
                        role="button"
                        aria-expanded={openIndex === idx}
                        onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') handleToggle(idx); }}
                      >
                        <div className="service-headline d-flex align-items-center justify-content-between">
                          <div>

                          <span className="service-icon ">{service.icon} </span>
                          <span className='ms-2'>{service.headline}</span>
                          </div>

                          <span className={`service-arrow${openIndex === idx ? ' rotated' : ''}`}>▼</span>
                        </div>
                        <motion.ul
                          className="service-list"
                          initial={false}
                          animate={openIndex === idx ? "open" : "closed"}
                          variants={{
                            open: {
                              height: "auto",
                              opacity: 1,
                              transition: {
                                when: "beforeChildren",
                                staggerChildren: 0.12,
                              },
                            },
                            closed: {
                              height: 0,
                              opacity: 0,
                              transition: {
                                when: "afterChildren",
                                staggerChildren: 0,
                                staggerDirection: -1,
                              },
                            },
                          }}
                          style={{ overflow: 'hidden', marginTop: openIndex === idx ? '1rem' : 0 }}
                        >
                          <AnimatePresence initial={false}>
                            {openIndex === idx &&
                              service.children.map((child, cidx) => (
                                <motion.li
                                  key={cidx}
                                  className="service-list-item"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ duration: 1, ease: 'easeInOut', delay: cidx * 0.1 }}
                                >
                                  <span className="service-dot"></span>
                                  {child}
                                </motion.li>
                              ))}
                          </AnimatePresence>
                        </motion.ul>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>

            {/* <Row className="skills-section ">
              <Col lg={12}>
                <motion.div variants={itemVariants}>
                  <h3 className="section-subtitle">{t('about.skills.title')}</h3>
                </motion.div>
                
                <Row className="mt-3 ">
                  {skills.map((skill, index) => (
                    <Col md={6} key={index} className="mb-4">
                      <motion.div 
                        variants={itemVariants}
                        className="skill-item"
                      >
                        <div className="skill-info">
                          <h5>{t(`about.skills.${skill.name}`)}</h5>
                          <span>{skill.level}%</span>
                        </div>
                        <ProgressBar 
                          now={skill.level} 
                          className={`skill-progress ${darkMode ? 'dark-mode' : ''}`}
                        />
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row> */}

            <Row className="stats-section m-1 py-5">
              <Col lg={12}>
                <motion.div variants={itemVariants}>
                  <h3 className="section-subtitle">{t('about.experience.title')}</h3>
                </motion.div>
                
                <Row className="text-center mt-3">
                  {stats.map((stat, index) => (
                    <Col md={4} key={index}>
                      <motion.div 
                        variants={itemVariants}
                        className="stat-item"
                      >
                        <div className="stat-value">{stat.value}+</div>
                        <div className="stat-name">{t(`about.experience.${stat.name}`)}</div>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
            
            <OurPartners />

          </motion.div>
        </Container>
      </section>
    </>
  );
};

export default AboutPage;
