import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import './OurValues.css';

const OurValues = () => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);

  const values = [
    {
      id: 1,
      image: '/images/values/partnership.jpg', 
      title: t('about.values.partnership.headline', 'partnership'),
      description: t('about.values.partnership.description', 'Pushing boundaries with creative solutions')
    },
    {
      id: 2,
      image: '/images/values/innovation.jpg',
      title: t('about.values.innovation.headline', 'Innovation'),
      description: t('about.values.innovation.description', 'Delivering outstanding quality in every project')
    },
    {
      id: 3,
      image: '/images/values/transparency.jpg',
      title: t('about.values.transparency.headline', 'transparency'),
      description: t('about.values.transparency.description', 'Building trust through honest relationships')
    },
    {
      id: 4,
      image: '/images/values/results.jpg',
      title: t('about.values.results.headline', 'results'),
      description: t('about.values.results.description', 'Working together to achieve greater results')
    }
  ];

  return (
    <section className={`values-section ${darkMode ? 'dark-mode' : ''}`}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-5"
        >
          <h2 className="section-title">{t('about.values.title', 'Our Values')}</h2>
          <p className="section-subtitle">
            {t('about.values.subtitle', 'The principles that guide our work')}
          </p>
        </motion.div>

        <Row className="g-4">
          {values.map((value, index) => (
            <Col key={value.id} lg={3} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="value-card"
              >
                <div className="value-image-wrapper">
                  <img src={value.image} alt={value.title} className="value-image" />
                  <div className="value-overlay"></div>
                </div>
                <div className="value-content">
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
                {/* <div className="value-number">0{value.id}</div> */}
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default OurValues;