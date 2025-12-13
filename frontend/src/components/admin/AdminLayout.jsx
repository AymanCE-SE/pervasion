import React, { useEffect } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, logout } from '../../redux/slices/authSlice';
import { selectDarkMode, toggleTheme } from '../../redux/slices/themeSlice';
import { selectLanguage, toggleLanguage } from '../../redux/slices/languageSlice';
import { FaTachometerAlt, FaImages, FaUsers, FaSignOutAlt, FaHome, FaTags, FaEnvelope, FaFileAlt, FaMoon, FaSun, FaGlobe } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminLayout.css';

const AdminLayout = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [isAuthenticated, navigate, location]);
  
  // Check authentication periodically
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch(logout());
        navigate('/login');
      }
    };

    const interval = setInterval(checkAuth, 600000); // Check every 10 minutes
    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  // Get current active path
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Logout handler
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  // Toggle theme
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  // Toggle language
  const handleToggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    dispatch(toggleLanguage());
    i18n.changeLanguage(newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className={`admin-layout ${darkMode ? 'dark-mode' : ''}`}>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={i18n.language === 'ar'}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col md={3} lg={2} className="admin-sidebar">
            <div className="sidebar-header">
              <h3>{t('admin.dashboard')}</h3>
              <p>{t('admin.adminPanel')}</p>
            </div>

            {/* Theme and Language Toggles */}
            <div className="sidebar-controls">
              <Button
                variant="outline-secondary"
                size="sm"
                className="control-btn"
                onClick={handleToggleTheme}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                className="control-btn"
                onClick={handleToggleLanguage}
                title={language === 'en' ? 'Switch to العربية' : 'Switch to English'}
              >
                <FaGlobe className="me-1" />
                <span className="lang-badge">{language.toUpperCase()}</span>
              </Button>
            </div>
            
            <Nav className="flex-column sidebar-nav">
              <Nav.Link 
                as={Link} 
                to="/" 
              >
                <FaHome className="nav-icon" />
                <span>{t('admin.Home')}</span>
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/admin" 
                className={isActive('/admin') ? 'active' : ''}
              >
                <FaTachometerAlt className="nav-icon" />
                <span>{t('admin.dashboard')}</span>
              </Nav.Link>
              
              <Nav.Link 
                as={Link} 
                to="/admin/projects" 
                className={location.pathname.includes('/admin/projects') ? 'active' : ''}
              >
                <FaImages className="nav-icon" />
                <span>{t('admin.projects')}</span>
              </Nav.Link>
              
              <Nav.Link 
                as={Link} 
                to="/admin/categories" 
                className={location.pathname.includes('/admin/categories') ? 'active' : ''}
              >
                <FaTags className="nav-icon" />
                <span>{t('admin.categories') || 'Categories'}</span>
              </Nav.Link>

              <Nav.Link 
                as={Link} 
                to="/admin/users" 
                className={location.pathname.includes('/admin/users') ? 'active' : ''}
              >
                <FaUsers className="nav-icon" />
                <span>{t('admin.users')}</span>
              </Nav.Link>

              <Nav.Link 
                as={Link} 
                to="/admin/contacts" 
                className={location.pathname.includes('/admin/contacts') ? 'active' : ''}
              >
                <FaEnvelope className="nav-icon" />
                <span>{t('admin.contacts')}</span>
              </Nav.Link>

              <Nav.Link 
                as={Link} 
                to="/admin/job-applications" 
                className={isActive('/admin/job-applications') ? 'active' : ''}
              >
                <FaFileAlt className="nav-icon" />
                <span>{t('admin.jobApplications')}</span>
              </Nav.Link>

              <Nav.Link 
                as="button"
                onClick={handleLogout}
                className="logout-link"
                style={{ background: 'none', border: 'none', textAlign: 'left' }}
              >
                <FaSignOutAlt className="nav-icon" />
                <span>{t('admin.logout')}</span>
              </Nav.Link>
            </Nav>
          </Col>
          
          {/* Main Content */}
          <Col md={9} lg={10} className="admin-content">
            <div className="content-wrapper">
              <Outlet />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLayout;
