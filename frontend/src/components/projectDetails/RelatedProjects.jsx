import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProjectCard from '../projects/ProjectCard';

const RelatedProjects = ({ projects, currentProjectId, currentLanguage }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <motion.div 
      className="related-projects mt-5"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h4 className="mb-4">
        {currentLanguage === 'ar' ? 'مشاريع مشابهة' : 'Related Projects'}
      </h4>
      <div className="row g-4">
        {projects
          .filter(project => project.id !== currentProjectId)
          .slice(0, 3)
          .map((project) => (
            <div key={project.id} className="col-md-4">
              <ProjectCard 
                project={project} 
                currentLanguage={currentLanguage} 
              />
            </div>
          ))}
      </div>
      <div className="text-center mt-4">
        <Link to="/projects" className="btn btn-outline-primary">
          {currentLanguage === 'ar' ? 'عرض جميع المشاريع' : 'View All Projects'}
        </Link>
      </div>
    </motion.div>
  );
};

export default RelatedProjects;
