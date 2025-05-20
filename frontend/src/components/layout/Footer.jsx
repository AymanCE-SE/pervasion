import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { FaFacebookF, FaTwitter, FaInstagram, FaBehance, FaDribbble, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${darkMode ? 'dark-mode' : ''}`}>
      <Container>
        <Row className="footer-main">
          <Col lg={4} md={6} className="footer-info mb-4 mb-md-0">
            <h3 className="footer-title">{t('app.title')}</h3>
            <p>{t('app.description')}</p>
          </Col>
          
          <Col lg={4} md={6} className="footer-links mb-4 mb-md-0">
            <h4>{t('nav.home')}</h4>
            <ul>
              <li>
                <Link to="/">{t('nav.home')}</Link>
              </li>
              <li>
                <Link to="/projects">{t('nav.projects')}</Link>
              </li>
              <li>
                <Link to="/about">{t('nav.about')}</Link>
              </li>
              <li>
                <Link to="/contact">{t('nav.contact')}</Link>
              </li>
            </ul>
          </Col>
          
          <Col lg={4} md={12} className="footer-social">
            <h4>{t('footer.follow')}</h4>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://behance.net" target="_blank" rel="noopener noreferrer" aria-label="Behance">
                <FaBehance />
              </a>
              <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" aria-label="Dribbble">
                <FaDribbble />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </Col>
        </Row>
        
        <Row className="footer-bottom">
          <Col>
            <div className="copyright">
              &copy; {currentYear} {t('app.title')}. {t('footer.rights')}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
