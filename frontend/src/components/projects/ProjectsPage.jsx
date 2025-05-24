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
  selectFilteredCategory, 
  selectCategoriesStatus,
  selectAllCategories,
  fetchCategories
} from '../../redux/slices/projectsSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import ProjectCard from './ProjectCard';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const projects = useSelector(selectFilteredProjects);
  const status = useSelector(selectProjectStatus);
  const categoriesStatus = useSelector(selectCategoriesStatus);
  const categories = useSelector(selectAllCategories);
  const currentCategory = useSelector(selectFilteredCategory);
  const darkMode = useSelector(selectDarkMode);
  const currentLanguage = i18n.language; // Get current language code (e.g., 'en', 'ar')

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, categoriesStatus, dispatch]);

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

  // Create categories array with 'all' option and dynamic categories
  const allCategories = React.useMemo(() => {
    const baseCategories = [{ 
      id: 'all',
      name: 'All',
      name_ar: 'الكل'
    }];
    
    if (Array.isArray(categories) && categories.length > 0) {
      // Map API categories to the expected format
      const apiCategories = categories.map(cat => ({
        id: String(cat.id), // Keep as string to match the filter comparison
        name: cat.name,
        name_ar: cat.name_ar
      }));
      return [...baseCategories, ...apiCategories];
    }
    
    return baseCategories;
  }, [categories]);
  
  // Track language changes
  React.useEffect(() => {
    // Refresh UI when language changes
  }, [currentLanguage]);
  
  // Filter projects by selected category
  const filteredProjects = React.useMemo(() => {
    if (!currentCategory || currentCategory === 'all') {
      return projects;
    }
    // Convert project.category to string for comparison since currentCategory is a string
    return projects.filter(project => String(project.category) === currentCategory);
  }, [projects, currentCategory]);
  
  // Get the current language for category names
  const getCategoryName = (category) => {
    if (!category) return '';
    if (category.id === 'all') {
      return currentLanguage === 'ar' ? 'الكل' : 'All';
    }
    return currentLanguage === 'ar' && category.name_ar 
      ? category.name_ar 
      : (category.name || category.id);
  };

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
            {categoriesStatus === 'loading' ? (
              <div>Loading categories...</div>
            ) : categoriesStatus === 'failed' ? (
              <div>Error loading categories</div>
            ) : (
              allCategories.map((category) => (
              <Button
                key={category.id}
                variant={currentCategory === category.id ? 'primary' : 'outline-primary'}
                className={`filter-btn ${currentCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
                disabled={categoriesStatus === 'loading'}
              >
                {getCategoryName(category)}
              </Button>
            ))
            )}
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
