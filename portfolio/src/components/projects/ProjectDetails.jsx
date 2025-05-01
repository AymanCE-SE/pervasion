import React, { useEffect } from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchProjectById, 
  selectCurrentProject, 
  selectProjectStatus, 
  selectProjectError,
  selectAllProjects
} from '../../redux/slices/projectsSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { selectLanguage } from '../../redux/slices/languageSlice';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const project = useSelector(selectCurrentProject);
  const status = useSelector(selectProjectStatus);
  const error = useSelector(selectProjectError);
  const allProjects = useSelector(selectAllProjects);
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);

  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  // Get related projects (same category)
  const relatedProjects = project 
    ? allProjects.filter(p => p.category === project.category && p.id !== project.id).slice(0, 3) 
    : [];

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  if (status === 'loading') {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-center py-5">
        <h3>{t('common.error')}</h3>
        <p>{error}</p>
        <Button variant="primary" onClick={() => navigate('/projects')}>
          {t('common.backToHome')}
        </Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-5">
        <h3>{t('projects.noProjects')}</h3>
        <Button variant="primary" onClick={() => navigate('/projects')}>
          {t('common.backToHome')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {language === 'en' ? project.title : project.titleAr} | {t('app.title')}
        </title>
        <meta 
          name="description" 
          content={language === 'en' ? project.description.substring(0, 160) : project.descriptionAr.substring(0, 160)} 
        />
      </Helmet>

      <section className={`project-details-page ${darkMode ? 'dark-mode' : ''}`}>
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="project-details-container"
          >
            <motion.div variants={itemVariants} className="back-link-container">
              <Link to="/projects" className="back-link">
                &larr; {t('common.backToHome')}
              </Link>
            </motion.div>

            <motion.h1 variants={itemVariants} className="project-title">
              {language === 'en' ? project.title : project.titleAr}
            </motion.h1>

            <Row className="project-content">
              <Col lg={8}>
                <motion.div variants={itemVariants} className="project-gallery">
                  <Carousel fade indicators={true} interval={5000}>
                    {project.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img
                          className="d-block w-100 carousel-img"
                          src={image}
                          alt={`${language === 'en' ? project.title : project.titleAr} - ${index + 1}`}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </motion.div>
              </Col>

              <Col lg={4}>
                <motion.div variants={itemVariants} className="project-info">
                  <div className="info-item">
                    <h5>{t('projects.client')}</h5>
                    <p>{project.client}</p>
                  </div>
                  
                  <div className="info-item">
                    <h5>{t('projects.date')}</h5>
                    <p>{new Date(project.date).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA')}</p>
                  </div>
                  
                  <div className="info-item">
                    <h5>{t('projects.category')}</h5>
                    <p>{t(`projects.categories.${project.category}`)}</p>
                  </div>
                </motion.div>
              </Col>
            </Row>

            <motion.div variants={itemVariants} className="project-description">
              <h3>{t('projects.subtitle')}</h3>
              <p>{language === 'en' ? project.description : project.descriptionAr}</p>
            </motion.div>

            {relatedProjects.length > 0 && (
              <motion.div variants={itemVariants} className="related-projects">
                <h3>{t('projects.relatedProjects')}</h3>
                <Row>
                  {relatedProjects.map((relatedProject) => (
                    <Col md={4} key={relatedProject.id} className="mb-4">
                      <Link to={`/projects/${relatedProject.id}`} className="related-project-card">
                        <div className="related-img-wrapper">
                          <img 
                            src={relatedProject.image} 
                            alt={language === 'en' ? relatedProject.title : relatedProject.titleAr} 
                            className="related-img"
                          />
                        </div>
                        <h5>{language === 'en' ? relatedProject.title : relatedProject.titleAr}</h5>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </motion.div>
            )}
          </motion.div>
        </Container>
      </section>
    </>
  );
};

export default ProjectDetails;
