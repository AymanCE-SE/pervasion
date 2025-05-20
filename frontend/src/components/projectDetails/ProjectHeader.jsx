import React from 'react';
import { motion } from 'framer-motion';

const ProjectHeader = ({ title, title_ar, subtitle, subtitle_ar, category, category_name, currentLanguage }) => (
  <motion.div 
    className="project-header mb-4"
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <span className="project-category-badge mb-2 d-inline-block">
      {category_name || `projects.categories.${category}`}
    </span>
    <h1 className="project-title mb-3">
      {currentLanguage === 'ar' && title_ar ? title_ar : title}
    </h1>
    {subtitle && (
      <p className="project-subtitle text-muted">
        {currentLanguage === 'ar' && subtitle_ar ? subtitle_ar : subtitle}
      </p>
    )}
  </motion.div>
);

export default ProjectHeader;
