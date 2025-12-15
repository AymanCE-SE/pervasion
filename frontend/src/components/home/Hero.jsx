import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { BsArrowRight } from 'react-icons/bs';
import heroImg from "/hero.jpg";
import './Hero.css';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const darkMode = useSelector(selectDarkMode);
  const isRTL = i18n.language === 'ar';

  return (
    <section className={`hero-section ${darkMode ? 'dark-mode' : ''}`}>
      <div className="hero-background">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
      </div>

      {/* Add mobile background image */}
      <div className="hero-mobile-background d-lg-none"></div>

      <Container>
        <Row className="hero-row">
          <Col lg={6} className="hero-text-col">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-content"
            >
              <div className="hero-badge">
                <span className="badge-dot"></span>
                {t('hero.badge', 'slogan design studio')}
              </div>

              <h1 className="hero-title">
                {t('hero.titleStart', 'We create')}
                {t('hero.titleEnd', 'that tell your story')}
              </h1>

              <p className="hero-description">
                {t('hero.subtitle')}
              </p>
            </motion.div>
          </Col>

          {/* Desktop only image */}
          <Col lg={6} className="hero-image-col d-none d-lg-block">
            <motion.div
              className="hero-image-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="image-container">
                <img src={heroImg} alt="Horse brand" className="hero-image" />
                <div className="effect-rectangular"></div>
                <div className="effect-dots"></div>
              </div>
            </motion.div>
          </Col>

          {/* Remove mobile image column since it's now a background */}

          {/* Actions column */}
          <Col xs={12} lg={6} className="hero-actions-col">
            <div className="hero-actions">
              <Button as={Link} to="/projects" className="cta-primary">
                {t('hero.cta')}
                <BsArrowRight className={isRTL ? 'icon-rtl' : 'ms-2'} />
              </Button>
              <Link to="/contact" className="cta-secondary" role="button" aria-label={t('hero.ctaSecondary')}>
                {t('hero.ctaSecondary')}
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero;