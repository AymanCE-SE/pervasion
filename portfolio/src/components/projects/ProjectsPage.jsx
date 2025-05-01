import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchProjects, 
  setFilteredCategory, 
  selectFilteredProjects, 
  selectProjectStatus, 
  selectFilteredCategory 
} from '../../redux/slices/projectsSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import ProjectCard from './ProjectCard';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const projects = useSelector(selectFilteredProjects);
  const status = useSelector(selectProjectStatus);
  const currentCategory = useSelector(selectFilteredCategory);
  const darkMode = useSelector(selectDarkMode);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

  const handleCategoryChange = (category) => {
    dispatch(setFilteredCategory(category));
  };

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

  // Categories from the projects
  const categories = [
    'all',
    'branding',
    'ui-design',
    'social-media',
    'packaging',
    'print',
    'motion'
  ];

  return (
    <>
      <Helmet>
        <title>{t('app.title')} - {t('nav.projects')}</title>
        <meta name="description" content={t('projects.subtitle')} />
      </Helmet>

      <section className={`projects-page ${darkMode ? 'dark-mode' : ''}`}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header text-center"
          >
            <h1 className="page-title">{t('projects.title')}</h1>
            <p className="page-subtitle">{t('projects.subtitle')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="filter-buttons"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={currentCategory === category ? 'primary' : 'outline-primary'}
                className={`filter-btn ${currentCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {t(`projects.categories.${category}`)}
              </Button>
            ))}
          </motion.div>

          {status === 'loading' ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">{t('common.loading')}</span>
              </div>
            </div>
          ) : projects.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="projects-grid"
            >
              <Row>
                {projects.map((project) => (
                  <Col lg={4} md={6} key={project.id} className="mb-4">
                    <motion.div variants={itemVariants}>
                      <ProjectCard project={project} />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>
          ) : (
            <div className="text-center py-5">
              <p>{t('projects.noProjects')}</p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
};

export default ProjectsPage;
