import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects, selectFeaturedProjects, selectProjectStatus } from '../../redux/slices/projectsSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { selectLanguage } from '../../redux/slices/languageSlice';
import './FeaturedProjects.css';

const FeaturedProjects = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const featuredProjects = useSelector(selectFeaturedProjects);
  const status = useSelector(selectProjectStatus);
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className={`featured-projects-section ${darkMode ? 'dark-mode' : ''}`}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-header text-center"
        >
          <h2 className="section-title">{t('projects.title')}</h2>
          <p className="section-subtitle">{t('projects.subtitle')}</p>
        </motion.div>

        {status === 'loading' ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">{t('common.loading')}</span>
            </div>
          </div>
        ) : featuredProjects.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="featured-projects-container"
          >
            <Row>
              {featuredProjects.map((project) => (
                <Col lg={4} md={6} key={project.id} className="mb-4">
                  <motion.div variants={itemVariants}>
                    <Card 
                      className={`project-card ${darkMode ? 'dark-mode' : ''}`}
                      as={Link} 
                      to={`/projects/${project.id}`}
                    >
                      <div className="card-img-wrapper">
                        <Card.Img 
                          variant="top" 
                          src={project.image} 
                          alt={language === 'en' ? project.title : project.titleAr} 
                          className="project-image"
                        />
                      </div>
                      <Card.Body>
                        <Card.Title>
                          {language === 'en' ? project.title : project.titleAr}
                        </Card.Title>
                        <Card.Text>
                          {language === 'en' 
                            ? project.description.substring(0, 100) + '...' 
                            : project.descriptionAr.substring(0, 100) + '...'}
                        </Card.Text>
                        <div className="project-category">
                          {t(`projects.categories.${project.category}`)}
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
            
            <motion.div 
              variants={itemVariants}
              className="text-center mt-5"
            >
              <Link to="/projects" className="view-all-btn">
                {t('projects.viewProject')}
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <div className="text-center py-5">
            <p>{t('projects.noProjects')}</p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default FeaturedProjects;
