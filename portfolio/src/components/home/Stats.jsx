import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { FaCheckCircle, FaUsers, FaClock, FaStar } from 'react-icons/fa';
import CountUp from 'react-countup';
import './Stats.css';

const Stats = () => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);
  const { scrollYProgress } = useScroll();
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const stats = [
    {
      icon: <FaCheckCircle />,
      value: 250,
      label: "projects.completed",
      color: "var(--primary-color)",
      gradientStart: "#38ef7d",
      gradientEnd: "#11998e"
    },
    {
      icon: <FaUsers />,
      value: 100,
      label: "clients.satisfied",
      color: "#2076e8",
      gradientStart: "#4e54c8",
      gradientEnd: "#8f94fb"
    },
    {
      icon: <FaClock />,
      value: 10,
      label: "years.experience",
      color: "#f857a6",
      gradientStart: "#f857a6",
      gradientEnd: "#ff5858"
    },
    {
      icon: <FaStar />,
      value: 15,
      label: "awards.won",
      color: "#ffd700",
      gradientStart: "#FFD700",
      gradientEnd: "#FFA500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { 
      y: 50,
      opacity: 0,
      scale: 0.8
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className={`stats-section ${darkMode ? 'dark-mode' : ''}`}>
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-100px" }}
          className="stats-grid-container"
        >
          <Row>
            {stats.map((stat, index) => (
              <Col key={index} md={6} lg={3} className="mb-4">
                <motion.div 
                  className="stats-grid-card"
                  variants={cardVariants}
                  style={{
                    background: `linear-gradient(135deg, ${stat.gradientStart}, ${stat.gradientEnd})`
                  }}
                >
                  <div className="stats-grid-content">
                    <motion.div 
                      className="stats-grid-icon"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.div className="stats-grid-value">
                      <CountUp
                        end={stat.value}
                        duration={2}
                        suffix="+"
                        enableScrollSpy
                      />
                    </motion.div>
                    <p className="stats-grid-label">{t(stat.label)}</p>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Container>
    </section>
  );
};

export default Stats;