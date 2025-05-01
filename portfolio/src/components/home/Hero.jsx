import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { BsArrowRight } from 'react-icons/bs';
import './Hero.css';

const Hero = () => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);

  // Animation variants for staggered animations
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

  // Animation for the background shapes
  const shapeVariants = {
    animate: {
      scale: [1, 1.05, 1],
      rotate: [0, 5, 0],
      transition: {
        duration: 8,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  };

  // Animation for the floating elements
  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  };

  return (
    <section className={`hero-section ${darkMode ? 'dark-mode' : ''}`}>
      {/* Animated background shapes */}
      <div className="hero-bg">
        <motion.div
          className="shape shape-1"
          variants={shapeVariants}
          animate="animate"
        />
        <motion.div
          className="shape shape-2"
          variants={shapeVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div
          className="shape shape-3"
          variants={shapeVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
        <motion.div
          className="shape shape-4"
          variants={shapeVariants}
          animate="animate"
          transition={{ delay: 1.5 }}
        />
      </div>

      {/* Decorative elements */}
      <div className="decorative-elements">
        <motion.div 
          className="decorative-dot dot-1" 
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div 
          className="decorative-dot dot-2" 
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 0.5 }}
        />
        <motion.div 
          className="decorative-dot dot-3" 
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div 
          className="decorative-line line-1" 
        />
        <motion.div 
          className="decorative-line line-2" 
        />
      </div>

      <Container>
        <Row className="align-items-center hero-content">
          <Col lg={6} className="hero-text">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="hero-badge">
                <span>{t('home.hero.badge')}</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="hero-title">
                {t('home.hero.title')} <span className="highlight">{t('home.hero.titleHighlight')}</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="hero-subtitle">
                {t('home.hero.subtitle')}
              </motion.p>
              
              <motion.div variants={itemVariants} className="hero-cta-container">
                <Button
                  as={Link}
                  to="/projects"
                  variant="primary"
                  size="lg"
                  className="hero-cta"
                >
                  {t('home.hero.cta')} <BsArrowRight className="ms-2" />
                </Button>
                
                <Button
                  as={Link}
                  to="/contact"
                  variant="outline-primary"
                  size="lg"
                  className="hero-cta-secondary"
                >
                  {t('home.hero.ctaSecondary')}
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants} className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">{t('home.hero.yearsExperience')}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">250+</span>
                  <span className="stat-label">{t('home.hero.projectsCompleted')}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">{t('home.hero.clientSatisfaction')}</span>
                </div>
              </motion.div>
            </motion.div>
          </Col>
          
          <Col lg={6} className="hero-image">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="image-container"
            >
              <div className="hero-img-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Designer workspace"
                  className="hero-img"
                />
                <div className="img-overlay"></div>
              </div>
              
              <motion.div 
                className="floating-card card-1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <div className="card-icon">🎨</div>
                <div className="card-text">{t('home.hero.card1')}</div>
              </motion.div>
              
              <motion.div 
                className="floating-card card-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
              >
                <div className="card-icon">✨</div>
                <div className="card-text">{t('home.hero.card2')}</div>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero;
