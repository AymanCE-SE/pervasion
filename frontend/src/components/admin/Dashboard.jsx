import React, { useEffect } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects, selectAllProjects } from '../../redux/slices/projectsSlice';
import { fetchUsers, selectAllUsers } from '../../redux/slices/usersSlice';
import { fetchContacts, selectAllContacts } from '../../redux/slices/contactSlice';
import { selectUser } from '../../redux/slices/authSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { FaImages, FaUsers, FaEye, FaStar, FaCheck, FaTimes, FaEnvelope } from 'react-icons/fa';
import './Dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const projects = useSelector(selectAllProjects);
  const users = useSelector(selectAllUsers);
  const contacts = useSelector(selectAllContacts);
  const currentUser = useSelector(selectUser);
  const darkMode = useSelector(selectDarkMode);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchUsers());
    dispatch(fetchContacts());
  }, [dispatch]);
  
  // Calculate dashboard stats
  const totalProjects = projects.length;
  const featuredProjects = projects.filter(project => project.featured).length;
  const totalUsers = users.length;
  const totalMessages = contacts.length;
  const unreadMessages = contacts.filter(contact => !contact.is_read).length;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  // Determine category field based on language
  const { i18n } = useTranslation();
  const categoryField = i18n.language === 'ar' ? 'category_name_ar' : 'category_name';

  // Get recent projects sorted by date
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <>
      <Helmet>
        <title>{t('app.title')} - {t('admin.dashboard')}</title>
      </Helmet>

      <div className="dashboard-page">
        <div className="page-header">
          <h1>{t('admin.dashboard')}</h1>
          <p>{t('admin.welcome')}, {currentUser?.name || currentUser?.username}!</p>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Stats Cards */}
          <Row className="stats-cards">
            <Col md={6} lg={3} className="mb-4">
              <motion.div variants={itemVariants}>
                <Card className={`stat-card ${darkMode ? 'dark-mode' : ''}`}>
                  <Card.Body>
                    <div className="stat-icon projects-icon">
                      <FaImages />
                    </div>
                    <h3 className="stat-value">{totalProjects}</h3>
                    <p className="stat-label">{t('admin.projects')}</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            
            <Col md={6} lg={3} className="mb-4">
              <motion.div variants={itemVariants}>
                <Card className={`stat-card ${darkMode ? 'dark-mode' : ''}`}>
                  <Card.Body>
                    <div className="stat-icon featured-icon">
                      <FaStar />
                    </div>
                    <h3 className="stat-value">{featuredProjects}</h3>
                    <p className="stat-label">Featured Projects</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            
            <Col md={6} lg={3} className="mb-4">
              <motion.div variants={itemVariants}>
                <Card className={`stat-card ${darkMode ? 'dark-mode' : ''}`}>
                  <Card.Body>
                    <div className="stat-icon users-icon">
                      <FaUsers />
                    </div>
                    <h3 className="stat-value">{totalUsers}</h3>
                    <p className="stat-label">{t('admin.users')}</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            
            <Col md={6} lg={3} className="mb-4">
              <motion.div variants={itemVariants}>
                <Card className={`stat-card ${darkMode ? 'dark-mode' : ''}`}>
                  <Card.Body>
                    <div className="stat-icon messages-icon">
                      <FaEnvelope />
                    </div>
                    <h3 className="stat-value">
                      {totalMessages}
                      {unreadMessages > 0 && (
                        <Badge 
                          bg="warning" 
                          text="dark" 
                          className="ms-2 unread-badge"
                        >
                          {unreadMessages} new
                        </Badge>
                      )}
                    </h3>
                    <p className="stat-label">{t('admin.messages')}</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
          
          {/* Recent Projects */}
          <motion.div variants={itemVariants}>
            <Card className={`recent-card ${darkMode ? 'dark-mode' : ''}`}>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{t('admin.recentProjects')}</h5>
                <Link 
                  to="/admin/projects" 
                  className="btn btn-sm btn-primary"
                >
                  {t('admin.viewAll')}
                </Link>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th style={{ width: '50px' }}>#</th>
                        <th style={{ width: '80px' }}>Image</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th style={{ width: '100px' }}>Featured</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProjects.map((project) => (
                        <tr key={project.id}>
                          <td>{project.id}</td>
                          <td>
                            <div className="project-thumbnail">
                              <img 
                                src={project.image} 
                                alt={project.title}
                                className="img-fluid rounded"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            </div>
                          </td>
                          <td>
                            {i18n.language === 'ar' ? project.title_ar : project.title}
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {i18n.language === 'ar' ? 
                                project.category_name_ar : 
                                project.category_name}
                            </span>
                          </td>
                          <td>
                            {new Date(project.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            <Badge 
                              bg={project.featured ? 'success' : 'secondary'}
                              className="featured-badge"
                            >
                              {project.featured ? (
                                <><FaCheck className="me-1" /> Yes</>
                              ) : (
                                <><FaTimes className="me-1" /> No</>
                              )}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;
