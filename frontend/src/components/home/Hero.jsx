import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { BsArrowRight } from 'react-icons/bs';
import heroImg from "../../assets/Horses_in_Moonlight.png";
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

      <Container>
        <Row className="hero-row">
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-content"
            >
              <div className="hero-badge">
                <span className="badge-dot"></span>
                {t('hero.badge', 'Award-winning design studio')}
              </div>

              <h1 className="hero-title">
                {t('hero.titleStart', 'We create')}
                {/* <span className="gradient-text"> {t('hero.titleHighlight', 'stunning designs')} </span> */}
                {t('hero.titleEnd', 'that tell your story')}
              </h1>

              <p className="hero-description">
                {t('hero.subtitle')}
              </p>

              <div className="hero-actions">
                <Button as={Link} to="/projects" className="cta-primary">
                  {t('hero.cta')}
                  <BsArrowRight className={isRTL ? 'icon-rtl' : 'ms-2'} />
                </Button>
                <Button as={Link} to="/contact" className="cta-secondary">
                  {t('hero.ctaSecondary')}
                </Button>
              </div>
            </motion.div>
          </Col>

          <Col lg={6}>
            <motion.div
              className="hero-image-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="image-container">
                <img src={heroImg} alt="Horse brand" className="hero-image" />
                <div className="effect-circle"></div>
                <div className="effect-dots"></div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero;