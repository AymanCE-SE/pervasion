import React, { useEffect } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../redux/slices/authSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { FaTachometerAlt, FaImages, FaUsers, FaSignOutAlt, FaHome, FaTags } from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const darkMode = useSelector(selectDarkMode);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Get current active path
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className={`admin-layout ${darkMode ? 'dark-mode' : ''}`}>
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col md={3} lg={2} className="admin-sidebar">
            <div className="sidebar-header">
              <h3>{t('admin.dashboard')}</h3>
              <p>{t('admin.adminPanel')}</p>
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
              <span>{t('admin.categories')}</span>
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
                to="/admin/logout" 
                className="logout-link"
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
