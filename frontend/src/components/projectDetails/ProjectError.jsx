import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ProjectError = ({ error, onRetry }) => {
  const { t } = useTranslation();
  
  return (
    <Container className="py-5 text-center">
      <div className="error-container py-5">
        <h2 className="mb-4">{t('projects.details.error.title')}</h2>
        <p className="text-muted mb-4">
          {error?.detail || t('projects.details.error.message')}
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Button 
            variant="primary" 
            onClick={onRetry}
            className="px-4"
          >
            {t('common.retry')}
          </Button>
          <Button 
            variant="outline-secondary" 
            href="/projects"
            className="px-4"
          >
            {t('common.backToProjects')}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ProjectError;
