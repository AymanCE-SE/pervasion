import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiCalendar, FiUser, FiTag, FiMapPin, FiAward, FiExternalLink } from 'react-icons/fi';

const ProjectInfo = ({ project, currentLanguage }) => {
  const { t } = useTranslation();
  const infoItems = [
    {
      icon: <FiCalendar className="me-2" />,
      label: 'projects.details.date',
      value: project.date || 'N/A'
    },
    {
      icon: <FiUser className="me-2" />,
      label: 'projects.details.client',
      value: project.client || 'N/A'
    },
    {
      icon: <FiTag className="me-2" />,
      label: 'projects.details.category',
      value: project.category_name || 'N/A'
    },
    {
      icon: <FiMapPin className="me-2" />,
      label: 'projects.details.location',
      value: project.location || 'N/A'
    },
    {
      icon: <FiAward className="me-2" />,
      label: 'projects.details.role',
      value: project.role || 'N/A'
    }
  ];

  return (
    <motion.div 
      className="project-info mb-4"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title mb-4">{t('projects.projectInfo')}</h5>
          <ul className="list-unstyled">
            {infoItems.map((item, index) => (
              <li key={index} className="mb-3">
                <div className="d-flex align-items-center">
                  <span className="text-muted me-2 d-flex align-items-center" style={{ minWidth: '24px' }}>
                    {item.icon}
                  </span>
                  <div className="flex-grow-1">
                    <small className="text-muted d-block">{t(item.label)}</small>
                    <span className="d-block">{item.value}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {project.website_url && (
            <div className="mt-4">
              <a 
                href={project.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline-primary w-100"
              >
                <FiExternalLink className="me-2" />
                {currentLanguage === 'ar' ? 'زيارة الموقع' : 'Visit Website'}
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectInfo;
