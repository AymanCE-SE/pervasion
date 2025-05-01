import React, { useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects, selectAllProjects } from '../../redux/slices/projectsSlice';
import { fetchUsers, selectAllUsers } from '../../redux/slices/usersSlice';
import { selectUser } from '../../redux/slices/authSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { FaImages, FaUsers, FaEye, FaStar } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const projects = useSelector(selectAllProjects);
  const users = useSelector(selectAllUsers);
  const currentUser = useSelector(selectUser);
  const darkMode = useSelector(selectDarkMode);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchUsers());
  }, [dispatch]);
  
  // Calculate dashboard stats
  const totalProjects = projects.length;
  const featuredProjects = projects.filter(project => project.featured).length;
  const totalUsers = users.length;
  
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
                    <div className="stat-icon views-icon">
                      <FaEye />
                    </div>
                    <h3 className="stat-value">1,234</h3>
                    <p className="stat-label">Total Views</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
          
          {/* Recent Projects */}
          <motion.div variants={itemVariants}>
            <Card className={`recent-card ${darkMode ? 'dark-mode' : ''}`}>
              <Card.Header>
                <h5 className="mb-0">Recent Projects</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Featured</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.slice(0, 5).map((project) => (
                        <tr key={project.id}>
                          <td>{project.title}</td>
                          <td>{t(`projects.categories.${project.category}`)}</td>
                          <td>{new Date(project.date).toLocaleDateString()}</td>
                          <td>
                            <span className={`featured-badge ${project.featured ? 'featured' : 'not-featured'}`}>
                              {project.featured ? 'Yes' : 'No'}
                            </span>
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
