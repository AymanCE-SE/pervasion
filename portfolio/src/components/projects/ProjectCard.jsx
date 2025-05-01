import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { selectLanguage } from '../../redux/slices/languageSlice';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
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
            <span className="view-project">{t('projects.viewProject')}</span>
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
            <div className="project-category">
              {t(`projects.categories.${project.category}`)}
            </div>
            <div className="project-client">
              <span className="meta-label">{t('projects.client')}:</span> {project.client}
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
