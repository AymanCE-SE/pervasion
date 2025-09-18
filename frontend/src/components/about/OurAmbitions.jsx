import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
import { FaQuoteLeft } from 'react-icons/fa';
import ambitionsImg from '../../assets/ambitions.jpg'; 
import './MissionAmbitions.css';

const OurAmbitions = () => {
  const { t } = useTranslation();

  return (
    <section className="ambitions-section">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="order-lg-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="ambitions-content"
            >
              <h2 className="section-title ">
                {t('about.ambitions.title', 'Our Ambitions')}
              </h2>
              <div className="quote-wrapper">
                <FaQuoteLeft className="quote-icon" />
                <p className="ambitions-quote">
                  {t('about.ambitions.quote', 'Pushing boundaries to redefine excellence in digital creativity')}
                </p>
              </div>
              {/* <div className="ambitions-goals">
                {[1, 2, 3].map((goal, index) => (
                  <motion.div
                    key={index}
                    className="goal-item"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="goal-icon">
                      <span className="goal-number">{index + 1}</span>
                    </div>
                    <div className="goal-text">
                      {t(`about.ambitions.goal${goal}`)}
                    </div>
                  </motion.div>
                ))}
              </div> */}
            </motion.div>
          </Col>
          <Col lg={6} className="order-lg-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="ambitions-image"
            >
              <img src={ambitionsImg} alt="Our Ambitions" />
              <div className="image-overlay"></div>
            </motion.div>
          </Col>
        </Row>
      </Container>
      <div className="connection-line"></div>
    </section>
  );
};

export default OurAmbitions;