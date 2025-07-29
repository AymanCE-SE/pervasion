import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { FaCheckCircle, FaUsers, FaClock, FaStar } from 'react-icons/fa';
import CountUp from 'react-countup';
import './Stats.css';

const statsData = [
  {
    icon: <FaCheckCircle />,
    value: 250,
    label: "projects.completed",
  },
  {
    icon: <FaUsers />,
    value: 100,
    label: "clients.satisfied",
  },
  {
    icon: <FaClock />,
    value: 10,
    label: "years.experience",
  },
  {
    icon: <FaStar />,
    value: 15,
    label: "awards.won",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18 }
  }
};

const cardVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.92 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 16
    }
  }
};

const Stats = () => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);

  return (
    <section className={`stats-section${darkMode ? ' dark-mode' : ''}`}>
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="stats-grid-container"
        >
          <Row>
            {statsData.map((stat, idx) => (
              <Col key={idx} md={6} lg={3} className="mb-4">
                <motion.div
                  className="stats-grid-card"
                  variants={cardVariants}
                  whileHover={{ scale: 1.045, boxShadow: darkMode 
                    ? "0 16px 48px var(--shadow-dark)" 
                    : "0 16px 48px var(--shadow-md)" }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                >
                  <motion.div
                    className="stats-grid-icon"
                    whileHover={{ rotate: 360, scale: 1.13 }}
                    transition={{ duration: 0.7, type: "spring" }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="stats-grid-value">
                    <CountUp
                      end={stat.value}
                      duration={2}
                      suffix="+"
                      enableScrollSpy
                    />
                  </div>
                  <div className="stats-grid-label">
                    {t(stat.label)}
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