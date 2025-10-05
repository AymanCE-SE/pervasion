import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiCalendar, FiUser, FiTag, FiExternalLink } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';

const ProjectInfo = ({ project, currentLanguage }) => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);

  const infoItems = [
    {
      icon: <FiCalendar className="info-icon" />,
      label: 'projects.details.date',
      value: project.date || 'N/A'
    },
    {
      icon: <FiUser className="info-icon" />,
      label: 'projects.details.client',
      value: project.client || 'N/A'
    },
    {
      icon: <FiTag className="info-icon" />,
      label: 'projects.details.category',
      value: project.category_name || 'N/A'
    }
  ];

  return (
    <motion.div 
      className={`project-info glass-card mb-4 ${darkMode ? 'dark-mode' : ''}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="info-container">
        <h5 className="info-title gradient-text">{t('projects.projectInfo')}</h5>
        <ul className="info-list">
          {infoItems.map((item, index) => (
            <motion.li 
              key={index} 
              className="info-item-wrapper"
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="info-content">
                <span className="icon-wrapper">
                  {item.icon}
                </span>
                <div className="info-text">
                  <small className="info-label">{t(item.label)}</small>
                  <span className="info-value">{item.value}</span>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default ProjectInfo;
