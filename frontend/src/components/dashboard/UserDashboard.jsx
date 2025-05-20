import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import './UserDashboard.css';

const UserDashboard = () => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);

  return (
    <section className={`user-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Row>
            <Col>
              <h1 className="dashboard-title">{t('dashboard.welcome')}</h1>
              <p className="dashboard-subtitle">{t('dashboard.userMessage')}</p>
            </Col>
          </Row>
          
          <Row className="mt-4">
            <Col md={6} lg={4} className="mb-4">
              <Card className="dashboard-card">
                <Card.Body>
                  <h5>{t('dashboard.myProfile')}</h5>
                  {/* Add user profile content */}
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={4} className="mb-4">
              <Card className="dashboard-card">
                <Card.Body>
                  <h5>{t('dashboard.myComments')}</h5>
                  {/* Add user comments content */}
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={4} className="mb-4">
              <Card className="dashboard-card">
                <Card.Body>
                  <h5>{t('dashboard.myMessages')}</h5>
                  {/* Add user messages content */}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </section>
  );
};

export default UserDashboard;