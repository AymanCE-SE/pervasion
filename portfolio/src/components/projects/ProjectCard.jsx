import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { selectLanguage } from '../../redux/slices/languageSlice';
import { FiArrowRight, FiEye, FiCalendar, FiUser } from 'react-icons/fi';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);

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
            src={project.image} 
            alt={language === 'en' ? project.title : project.titleAr} 
            className="project-image"
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
          <div className="card-badge">
            {t(`projects.categories.${project.category}`)}
          </div>
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
          <div className="project-meta">
            <div className="meta-item">
              <FiCalendar className="meta-icon" />
              <span>{project.date}</span>
            </div>
            <div className="meta-item">
              <FiUser className="meta-icon" />
              <span>{project.client}</span>
            </div>
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
