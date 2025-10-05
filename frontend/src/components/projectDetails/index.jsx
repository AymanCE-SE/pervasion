import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../../../src/components/projects/ProjectDetails.css';

// Components
import ProjectHeader from './ProjectHeader';
import ProjectGallery from './ProjectGallery';
import ProjectInfo from './ProjectInfo';
import ProjectDescription from './ProjectDescription';
import RelatedProjects from './RelatedProjects';
import ProjectLoading from './ProjectLoading';
import ProjectError from './ProjectError';

// Redux
import { 
  fetchProjectById, 
  selectCurrentProject, 
  selectProjectStatus, 
  selectProjectError,
  selectAllProjects,
  clearCurrentProject
} from '../../redux/slices/projectsSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';

// Utils
import { getAbsoluteImageUrl } from '../../utils/imageUtils';

const ProjectDetails = () => {
  // Hooks
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const project = useSelector(selectCurrentProject);
  const status = useSelector(selectProjectStatus);
  const error = useSelector(selectProjectError);
  const allProjects = useSelector(selectAllProjects);
  const darkMode = useSelector(selectDarkMode);
  
  // Local state
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Derived state
  const currentLanguage = i18n.language;
  
  // Memoized project data
  const projectData = useMemo(() => {
    if (!project) return null;
    
    return {
      ...project,
      title: currentLanguage === 'ar' && project.title_ar ? project.title_ar : project.title,
      description: currentLanguage === 'ar' && project.description_ar ? project.description_ar : project.description,
      category_name: currentLanguage === 'ar' && project.category_name_ar 
        ? project.category_name_ar 
        : project.category_name,
      gallery: Array.isArray(project.images) ? project.images : [],
    };
  }, [project, currentLanguage]);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        await dispatch(fetchProjectById(id)).unwrap();
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      }
    };

    fetchProject();

    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch, id]);

  // Handle retry
  const handleRetry = useCallback(() => {
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Loading state
  if (status === 'loading' || !projectData) {
    return <ProjectLoading />;
  }

  // Error state
  if (error) {
    return <ProjectError error={error} onRetry={handleRetry} />;
  }

  // Main content
  return (
    <>
      <Helmet>
        <title>
          {currentLanguage === 'en' ? projectData.title : projectData.title_ar} | {t('app.title')}
        </title>
        <meta 
          name="description" 
          content={currentLanguage === 'en' 
            ? projectData.description?.substring(0, 160) || '' 
            : projectData.description_ar?.substring(0, 160) || ''} 
        />
      </Helmet>
      
      <section className={`project-details-page ${darkMode ? 'dark-mode' : ''}`}>
        <Container className="project-details-container">
          <div className="back-link-container">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="back-link-wrapper"
            >
              <Button 
                variant={darkMode ? 'outline-light' : 'outline-secondary'}
                onClick={handleBack}
                className="back-button"
              >
                <FiArrowLeft className="icon-left" />
                {t('common.back')}
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ProjectHeader 
              title={projectData.title}
              title_ar={projectData.title_ar}
              subtitle={projectData.subtitle}
              subtitle_ar={projectData.subtitle_ar}
              category={projectData.category}
              category_name={projectData.category_name}
              currentLanguage={currentLanguage}
            />
            
            <Row className="project-content">
              <Col lg={8} className="mb-4 mb-lg-0">
              <ProjectGallery 
                images={project.images} 
                mainImage={project.image}
                title={currentLanguage === 'en' ? project.title : project.title_ar} 
              />
                
                <ProjectDescription 
                  description={projectData.description}
                  description_ar={projectData.description_ar}
                  currentLanguage={currentLanguage}
                  projectId={projectData.id}
                />
              </Col>
              
              <Col lg={4}>
                <ProjectInfo 
                  project={projectData} 
                  currentLanguage={currentLanguage} 
                />
              </Col>
            </Row>
            
            <RelatedProjects 
              projects={allProjects}
              currentProjectId={projectData.id}
              currentLanguage={currentLanguage}
            />
          </motion.div>
        </Container>
      </section>
    </>
  );
};

export default ProjectDetails;
