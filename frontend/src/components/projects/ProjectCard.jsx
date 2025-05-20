import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { selectLanguage } from '../../redux/slices/languageSlice';
import { FiArrowRight, FiEye, FiCalendar, FiUser } from 'react-icons/fi';
import { getAbsoluteImageUrl, getFallbackImageUrl } from '../../utils/imageUtils';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);

  // Format date based on current language
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy', {
        locale: language === 'ar' ? ar : enUS
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if formatting fails
    }
  };

  // Get localized category name
  const getCategoryName = () => {
    if (!project) return '';
    return language === 'ar' && project.category_name_ar 
      ? project.category_name_ar 
      : project.category_name || '';
  };

  // Get localized title
  const getTitle = () => {
    if (!project) return '';
    return language === 'ar' && project.title_ar 
      ? project.title_ar 
      : project.title || '';
  };

  // Get localized description
  const getDescription = () => {
    if (!project) return '';
    const desc = language === 'ar' 
      ? (project.description_ar || project.description || '')
      : (project.description || '');
    return desc.length > 100 ? `${desc.substring(0, 100)}...` : desc;
  };

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -15,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="project-card-container"
    >
      <Card 
        className={`project-card ${darkMode ? 'dark-mode' : ''}`}
        as={Link} 
        to={`/projects/${project.id}`}
      >
        <div className="card-img-wrapper">
          <Card.Img 
            variant="top" 
            src={getAbsoluteImageUrl(project.image)} 
            alt={getTitle()} 
            className="project-image"
            onError={(e) => {
              console.error('Image failed to load:', getAbsoluteImageUrl(project.image));
              e.target.src = getFallbackImageUrl();
            }}
          />
          <div className="card-overlay">
            <motion.div 
              className="overlay-content"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="view-project">
                {t('projects.viewProject')}
                <FiEye className="icon-right" />
              </span>
            </motion.div>
          </div>
          {project.category_name && (
            <div className="card-badge">
              {getCategoryName()}
            </div>
          )}
        </div>
        <Card.Body>
          <Card.Title>{getTitle()}</Card.Title>
          <Card.Text>{getDescription()}</Card.Text>
          <div className="project-meta">
            <div className="meta-item">
              <FiCalendar className="meta-icon" />
              <span>{formatDate(project.date)}</span>
            </div>
            {project.client && (
              <div className="meta-item">
                <FiUser className="meta-icon" />
                <span>{project.client}</span>
              </div>
            )}
          </div>
          <motion.div 
            className="card-footer"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="view-details">{t('projects.viewDetails')}</span>
            <FiArrowRight className="arrow-icon" />
          </motion.div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
