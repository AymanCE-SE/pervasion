import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './ProfilePage.css';

const ProfilePage = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const theme = useSelector((state) => state.theme);

  if (!user) {
    return (
      <div className={`profile-page ${theme.darkMode ? 'dark-mode' : ''}`}>
        <Container className="profile-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="profile-card">
              <Card.Body className="text-center">
                <h4>{t('profile.notLoggedIn')}</h4>
                <p>{t('profile.pleaseLogin')}</p>
              </Card.Body>
            </Card>
          </motion.div>
        </Container>
      </div>
    );
  }

  return (
    <div className={`profile-page ${theme.darkMode ? 'dark-mode' : ''}`}>
      <Container className="profile-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row className="justify-content-center">
          <Col >
            <Card className="profile-card">
              <Card.Header className="profile-header">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <h2 className="profile-title">{t('profile.title')}</h2>
                </motion.div>
              </Card.Header>
              <Card.Body className="profile-body">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="profile-avatar-section">
                    <div className="profile-avatar">
                      <span className="avatar-initials">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="profile-name">{user.name || user.username}</h3>
                    {user.role && (
                      <Badge 
                        bg={user.role === 'admin' ? 'danger' : user.role === 'staff' ? 'warning' : 'primary'} 
                        className="role-badge"
                      >
                        {user.role}
                      </Badge>
                    )}
                  </div>

                  <div className="profile-info-section">
                    <div className="info-item">
                      <label className="info-label">{t('profile.username')}</label>
                      <span className="info-value">{user.username}</span>
                    </div>

                    <div className="info-item">
                      <label className="info-label">{t('profile.email')}</label>
                      <span className="info-value">{user.email}</span>
                    </div>

                    {user.name && (
                      <div className="info-item">
                        <label className="info-label">{t('profile.fullName')}</label>
                        <span className="info-value">{user.name}</span>
                      </div>
                    )}

                    <div className="info-item">
                      <label className="info-label">{t('profile.accountType')}</label>
                      <div className="account-badges">
                        {user.is_superuser && (
                          <Badge bg="danger" className="account-badge">
                            {t('profile.superuser')}
                          </Badge>
                        )}
                        {user.is_staff && !user.is_superuser && (
                          <Badge bg="warning" className="account-badge">
                            {t('profile.staff')}
                          </Badge>
                        )}
                        {!user.is_staff && !user.is_superuser && (
                          <Badge bg="secondary" className="account-badge">
                            {t('profile.user')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </Container>
    </div>
  );
};

export default ProfilePage;