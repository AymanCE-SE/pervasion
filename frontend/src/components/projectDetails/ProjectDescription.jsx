import React from 'react';
import { motion } from 'framer-motion';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ProjectComments from '../projects/ProjectComments';

const ProjectDescription = ({ description, description_ar, currentLanguage, projectId }) => {
  const { t } = useTranslation();
  const displayDescription = currentLanguage === 'ar' && description_ar 
    ? description_ar 
    : description;

  if (!displayDescription) return null;

  return (
    <div className="project-description-container">
      <motion.div 
        className="project-description mb-5"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-4">
              {currentLanguage === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
            </h5>
            <div 
              className="project-content" 
              dangerouslySetInnerHTML={{ 
                __html: displayDescription.replace(/\n/g, '<br />') 
              }} 
            />
          </div>
        </div>
      </motion.div>

      {/* Comments Section */}
      <motion.div 
        className="comments-section mt-5"
        id="project-comments"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ProjectComments projectId={projectId} />
      </motion.div>
    </div>
  );
};

export default ProjectDescription;
