import React from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ProjectLoading = () => {
  const { t } = useTranslation();
  
  return (
    <Container className="py-5">
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center w-100">
          <div className="mb-4">
            <Spinner 
              animation="border" 
              variant="primary" 
              style={{ width: '3rem', height: '3rem' }} 
            />
          </div>
          <h3 className="mb-3">{t('common.loading')}</h3>
          <p className="text-muted mb-4">{t('projects.details.loading')}</p>
          <div className="progress" style={{ height: '4px', maxWidth: '300px', margin: '0 auto' }}>
            <div 
              className="progress-bar progress-bar-striped progress-bar-animated" 
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProjectLoading;
