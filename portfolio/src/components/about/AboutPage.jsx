import React from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { selectLanguage } from '../../redux/slices/languageSlice';
import './AboutPage.css';

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
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
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

            <Row className="skills-section">
              <Col lg={12}>
                <motion.div variants={itemVariants}>
                  <h3 className="section-subtitle">{t('about.skills.title')}</h3>
                </motion.div>
                
                <Row>
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
            </Row>

            <Row className="stats-section">
              <Col lg={12}>
                <motion.div variants={itemVariants}>
                  <h3 className="section-subtitle">{t('about.experience.title')}</h3>
                </motion.div>
                
                <Row className="text-center">
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
          </motion.div>
        </Container>
      </section>
    </>
  );
};

export default AboutPage;
