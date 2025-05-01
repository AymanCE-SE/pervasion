import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
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
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiUser, 
  FiTag, 
  FiExternalLink, 
  FiLink, 
  FiMapPin, 
  FiAward, 
  FiEye,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import ProjectComments from './ProjectComments';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const project = useSelector(selectCurrentProject);
  const status = useSelector(selectProjectStatus);
  const error = useSelector(selectProjectError);
  const allProjects = useSelector(selectAllProjects);
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);

  useEffect(() => {
    dispatch(fetchProjectById(id));
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  // Reset active index when project changes
  useEffect(() => {
    setActiveIndex(0);
  }, [project?.id]);

  // Make sure project has all required properties
  const ensureProjectData = (project) => {
    if (!project) return null;
    
    return {
      ...project,
      gallery: project.gallery || project.images || [],
      website: project.website || '',
      location: project.location || '',
      award: project.award || '',
      description: project.description || '',
      descriptionAr: project.descriptionAr || '',
      titleAr: project.titleAr || project.title || '',
    };
  };

  // Ensure project data is complete
  const projectData = project ? ensureProjectData(project) : null;

  // Get related projects (same category)
  const relatedProjects = projectData 
    ? allProjects.filter(p => p.category === projectData.category && p.id !== projectData.id).slice(0, 3) 
    : [];

  // Get more projects (different category)
  const moreProjects = projectData
    ? allProjects.filter(p => p.category !== projectData.category && p.id !== projectData.id)
        .sort(() => 0.5 - Math.random()) // Shuffle array
        .slice(0, 3) // Get first 3 items
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

  const imageVariants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  if (status === 'loading') {
    return (
      <div className={`loading-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {t('common.loading')}
        </motion.p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className={`error-container ${darkMode ? 'dark-mode' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>{t('common.error')}</h3>
          <p>{error}</p>
          <Button 
            variant={darkMode ? "outline-light" : "primary"} 
            onClick={() => navigate('/projects')}
            className="action-button"
          >
            <FiArrowLeft className="icon-left" />
            {t('common.backToProjects')}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={`error-container ${darkMode ? 'dark-mode' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>{t('projects.noProjects')}</h3>
          <Button 
            variant={darkMode ? "outline-light" : "primary"} 
            onClick={() => navigate('/projects')}
            className="action-button"
          >
            <FiArrowLeft className="icon-left" />
            {t('common.backToProjects')}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {language === 'en' ? projectData.title : projectData.titleAr} | {t('app.title')}
        </title>
        <meta 
          name="description" 
          content={language === 'en' ? projectData.description.substring(0, 160) : projectData.descriptionAr.substring(0, 160)} 
        />
      </Helmet>
      
      <section className={`project-details-page ${darkMode ? 'dark-mode' : ''}`}>
        <Container className="project-details-container">
          <div className="back-link-container">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/projects" className="back-link">
                <FiArrowLeft className="icon-left" />
                {t('common.backToProjects')}
              </Link>
            </motion.div>
          </div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="project-header">
              <span className="project-category-badge">
                {t(`projects.categories.${projectData.category}`)}
              </span>
              <h1 className="project-title">
                {language === 'en' ? projectData.title : projectData.titleAr}
              </h1>
            </motion.div>
            
            <Row className="project-content">
              <Col lg={8} className="mb-4 mb-lg-0">
                <motion.div variants={itemVariants} className="project-gallery">
                  <Carousel 
                    activeIndex={activeIndex}
                    onSelect={handleSelect}
                    className="custom-carousel"
                    indicators={true}
                    interval={5000}
                    prevIcon={<div className="carousel-control-icon prev"><FiChevronLeft /></div>}
                    nextIcon={<div className="carousel-control-icon next"><FiChevronRight /></div>}
                  >
                    {projectData.gallery.map((image, index) => (
                      <Carousel.Item key={index}>
                        <div className="carousel-img-wrapper">
                          <motion.img
                            variants={imageVariants}
                            src={image}
                            alt={`${language === 'en' ? projectData.title : projectData.titleAr} - ${index + 1}`}
                            className="carousel-img"
                            loading="lazy"
                          />
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <div className="image-counter">
                    {activeIndex + 1} / {projectData.gallery.length}
                  </div>
                </motion.div>
              </Col>
              
              <Col lg={4}>
                <motion.div variants={itemVariants} className="project-info">
                  <div className="info-item">
                    <FiUser className="info-icon" />
                    <div>
                      <h5>{t('projects.client')}</h5>
                      <p>{projectData.client}</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FiCalendar className="info-icon" />
                    <div>
                      <h5>{t('projects.date')}</h5>
                      <p>{new Date(projectData.date).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA')}</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FiTag className="info-icon" />
                    <div>
                      <h5>{t('projects.category')}</h5>
                      <p>{t(`projects.categories.${projectData.category}`)}</p>
                    </div>
                  </div>

                  {projectData.location && (
                    <div className="info-item">
                      <FiMapPin className="info-icon" />
                      <div>
                        <h5>{t('projects.location')}</h5>
                        <p>{projectData.location}</p>
                      </div>
                    </div>
                  )}

                  {projectData.award && (
                    <div className="info-item">
                      <FiAward className="info-icon" />
                      <div>
                        <h5>{t('projects.award')}</h5>
                        <p>{projectData.award}</p>
                      </div>
                    </div>
                  )}

                  {projectData.website && (
                    <div className="info-item">
                      <FiExternalLink className="info-icon" />
                      <div>
                        <h5>{t('projects.website')}</h5>
                        <a href={projectData.website} target="_blank" rel="noopener noreferrer" className="website-link">
                          {projectData.website.replace(/(^\w+:|^)\/\//, '')}
                        </a>
                      </div>
                    </div>
                  )}

                  {projectData.website && (
                    <motion.a 
                      href={projectData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="visit-website-btn"
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiEye className="icon-left" />
                      {t('projects.visitWebsite')}
                    </motion.a>
                  )}
                </motion.div>
              </Col>
            </Row>

            <motion.div variants={itemVariants} className="project-description">
              <h3>{t('projects.projectDescription')}</h3>
              <div className="description-content">
                {language === 'en' 
                  ? projectData.description.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  : projectData.descriptionAr.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                }
              </div>
            </motion.div>

            {/* Project Comments Section */}
            <ProjectComments projectId={id} />

            {/* Related Projects Section */}
            {relatedProjects.length > 0 && (
              <motion.div variants={itemVariants} className="related-projects">
                <h3>{t('projects.relatedProjects')}</h3>
                <p className="section-subtitle">{t('projects.similarCategory')}</p>
                <Row>
                  {relatedProjects.map((relatedProject) => {
                    // Ensure related project data has all required properties
                    const safeRelatedProject = ensureProjectData(relatedProject);
                    return (
                      <Col md={4} key={safeRelatedProject.id} className="mb-4">
                        <motion.div
                          whileHover={{ 
                            y: -10,
                            transition: { duration: 0.3 }
                          }}
                        >
                          <Link to={`/projects/${safeRelatedProject.id}`} className="related-project-card">
                            <div className="related-img-wrapper">
                              <img 
                                src={safeRelatedProject.image || safeRelatedProject.gallery?.[0] || ''}
                                alt={language === 'en' ? safeRelatedProject.title : safeRelatedProject.titleAr} 
                                className="related-img"
                                loading="lazy"
                              />
                              <div className="related-overlay">
                                <FiLink className="related-icon" />
                              </div>
                            </div>
                            <h5>{language === 'en' ? safeRelatedProject.title : safeRelatedProject.titleAr}</h5>
                            <span className="related-category">
                              {t(`projects.categories.${safeRelatedProject.category}`)}
                            </span>
                          </Link>
                        </motion.div>
                      </Col>
                    );
                  })}
                </Row>
              </motion.div>
            )}

            {moreProjects.length > 0 && (
              <motion.div variants={itemVariants} className="more-projects">
                <h3>{t('projects.moreProjects')}</h3>
                <p className="section-subtitle">{t('projects.exploreMore')}</p>
                <Row>
                  {moreProjects.map((moreProject) => {
                    // Ensure more project data has all required properties
                    const safeMoreProject = ensureProjectData(moreProject);
                    return (
                      <Col md={4} key={safeMoreProject.id} className="mb-4">
                        <motion.div
                          whileHover={{ 
                            y: -10,
                            transition: { duration: 0.3 }
                          }}
                        >
                          <Link to={`/projects/${safeMoreProject.id}`} className="related-project-card">
                            <div className="related-img-wrapper">
                              <img 
                                src={safeMoreProject.image || safeMoreProject.gallery?.[0] || ''}
                                alt={language === 'en' ? safeMoreProject.title : safeMoreProject.titleAr} 
                                className="related-img"
                                loading="lazy"
                              />
                              <div className="related-overlay">
                                <FiLink className="related-icon" />
                              </div>
                            </div>
                            <h5>{language === 'en' ? safeMoreProject.title : safeMoreProject.titleAr}</h5>
                            <span className="related-category">
                              {t(`projects.categories.${safeMoreProject.category}`)}
                            </span>
                          </Link>
                        </motion.div>
                      </Col>
                    );
                  })}
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
