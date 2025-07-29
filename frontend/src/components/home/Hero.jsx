import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { BsArrowRight } from 'react-icons/bs';
import './Hero.css';
import heroImg from "../../assets/Horses_in_Moonlight.png";

const Hero = () => {
  const { t, i18n } = useTranslation();
  const darkMode = useSelector(selectDarkMode);
  const isRTL = i18n.language === 'ar';

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
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  const blobVariants = {
    animate: {
      scale: [1, 1.05, 1],
      x: [0, 10, 0],
      y: [0, -10, 0],
      transition: {
        duration: 15,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  };

  // Floating card positions for LTR/RTL
  const cardPositions = isRTL
    ? [
        { x: 40, y: -40 },   // card-1
        { x: -60, y: 40 },   // card-2
        { x: 0, y: 100 },    // card-3
      ]
    : [
        { x: -40, y: -40 },
        { x: 60, y: 40 },
        { x: 0, y: 100 },
      ];

  // Animated particles
  const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 6 + 2;
      const startPosition = Math.random() * 100;
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;
      particles.push(
        <motion.div
          key={i}
          className="particle"
          style={{
            width: size,
            height: size,
            left: direction === 'horizontal' ? '-10px' : `${startPosition}%`,
            top: direction === 'vertical' ? '-10px' : `${startPosition}%`
          }}
          initial={{
            x: direction === 'horizontal' ? '0%' : '0%',
            y: direction === 'vertical' ? '0%' : '0%',
            opacity: 0
          }}
          animate={{
            x: direction === 'horizontal' ? '110vw' : '0%',
            y: direction === 'vertical' ? '110vh' : '0%',
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: duration,
            delay: delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      );
    }
    return particles;
  };

  return (
    <section className={`hero-section ${darkMode ? 'dark-mode' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Animated background blobs */}
      <div className="hero-bg">
        <motion.div
          className="blob blob-1"
          variants={blobVariants}
          animate="animate"
        />
        <motion.div
          className="blob blob-2"
          variants={blobVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div
          className="blob blob-3"
          variants={blobVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
      </div>

      {/* Animated particles */}
      <div className="particles-container">
        {generateParticles()}
      </div>

      {/* Grid pattern overlay */}
      <div className="grid-pattern"></div>

      <Container>
        <Row className="align-items-center hero-content">
          <Col lg={6} className="hero-text-col">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="hero-text"
            >
              <motion.div variants={itemVariants} className="hero-badge">
                <span>{t('hero.badge', 'Award-winning design studio')}</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="hero-title">
                {t('hero.titleStart', 'We create')} {' '}
                <span className="highlight">
                  {t('hero.titleHighlight', 'stunning designs')}
                  <motion.svg
                    className="highlight-underline"
                    width="100%"
                    height="8"
                    viewBox="0 0 100 8"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 1.4, duration: 1.2, ease: "easeInOut" }}
                  >
                    <defs>
                      <linearGradient id="heroStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2F3E49" />
                        <stop offset="100%" stopColor="#4FB0A8" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M0,4 Q25,8 50,4 T100,4"
                      fill="none"
                      stroke="url(#heroStrokeGradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </span> {' '}
                {t('hero.titleEnd', 'that tell your story')}
              </motion.h1>
              
              <motion.p variants={itemVariants} className="hero-subtitle">
                {t('hero.subtitle', 'Transform your brand with our expertise in visual communication and digital design. We blend aesthetics with strategy to create impactful experiences.')}
              </motion.p>
              
              <motion.div variants={itemVariants} className="hero-cta-container">
                <Button
                  as={Link}
                  to="/projects"
                  size="lg"
                  className="hero-cta" 
                >
                  {t('hero.cta', 'View Projects')} 
                  {isRTL ? <BsArrowRight className="icon-rtl" /> : <BsArrowRight className="ms-2" />}
                </Button>
                
                <Button
                  as={Link}
                  to="/contact"
                  variant="outline-primary"
                  size="lg"
                  className="hero-cta-secondary ms-3"
                >
                  {t('hero.ctaSecondary', 'Contact Us')}
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants} className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">{t('hero.yearsExperience', 'Years Experience')}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">250+</span>
                  <span className="stat-label">{t('hero.projectsCompleted', 'Projects Completed')}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">{t('hero.clientSatisfaction', 'Client Satisfaction')}</span>
                </div>
              </motion.div>
            </motion.div>
          </Col>
          
          <Col lg={6} className="hero-image-col">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="image-container"
            >
              <motion.div 
                className="hero-img-wrapper"
                whileHover={{ y: -8, transition: { duration: 0.4 } }}
              >
                <img
                  src={heroImg}
                  alt="Designer workspace"
                  className="hero-img"
                />
                <div className="img-overlay"></div>
                <span className="img-shine" />
                
                {/* Design elements overlay */}
                {/* <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="design-elements"
                >
                  <div className="design-circle"></div>
                  <div className="design-square"></div>
                  <div className="design-line"></div>
                  <div className="design-dot dot-1"></div>
                  <div className="design-dot dot-2"></div>
                  <div className="design-dot dot-3"></div>
                  </motion.div> */}
              </motion.div>
                  
              <motion.div 
                className="floating-card card-1"
                initial={{ opacity: 0, x: -40, y: -40, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  x: [-40, -30, -40],
                  y: [-40, -60, -40],
                  scale: [1, 1.08, 1],
                  transition: {
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
                whileHover={{
                  scale: 1.15,
                  rotate: -6,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="card-icon">🎨</div>
                <div className="card-text">{t('hero.card1', 'Brand Identity')}</div>
              </motion.div>

              <motion.div 
                className="floating-card card-2"
                initial={{ opacity: 0, x: 60, y: 40, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  x: [60, 80, 60],
                  y: [40, 20, 40],
                  scale: [1, 1.08, 1],
                  transition: {
                    duration: 4.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
                whileHover={{
                  scale: 1.15,
                  rotate: 6,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="card-icon">✨</div>
                <div className="card-text">{t('hero.card2', 'Web Design')}</div>
              </motion.div>

              <motion.div 
                className="floating-card card-3"
                initial={{ opacity: 0, x: 0, y: 100, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  x: [0, 20, 0],
                  y: [100, 120, 100],
                  scale: [1, 1.08, 1],
                  transition: {
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
                whileHover={{
                  scale: 1.15,
                  rotate: -3,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="card-icon">🖌️</div>
                <div className="card-text">{t('hero.card3', 'Print Media')}</div>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero;