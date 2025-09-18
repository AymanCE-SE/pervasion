import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
import { FaQuoteLeft } from 'react-icons/fa';
import missionImg from '../../assets/mission.jpg'; 
import './MissionAmbitions.css';
const OurMission = () => {
  const { t } = useTranslation();

  return (
    <section className="mission-section">
      <Container className='mt-4'>
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mission-content"
            >
              <h2 className="section-title">
                {t('about.mission.title', 'Our Mission')}
              </h2>
              <div className="quote-wrapper">
                <FaQuoteLeft className="quote-icon" />
                <p className="mission-quote">
                  {t('about.mission.quote', 'Empowering brands through creative excellence and innovative solutions')}
                </p>
              </div>
              {/* <ul className="mission-points">
                {[1, 2, 3].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="mission-point-item"
                  >
                    <span className="point-dot"></span>
                    {t(`about.mission.point${item}`)}
                  </motion.li>
                ))}
              </ul> */}
            </motion.div>
          </Col>
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mission-image"
            >
              <img src={missionImg} alt="Our Mission" />
              <div className="image-overlay"></div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default OurMission;