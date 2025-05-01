import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchProjectById, 
  createProject, 
  updateProject,
  selectCurrentProject, 
  selectProjectStatus,
  selectProjectError,
  clearCurrentProject
} from '../../redux/slices/projectsSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import './ProjectForm.css';

const ProjectForm = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isEditMode = !!id;
  const project = useSelector(selectCurrentProject);
  const status = useSelector(selectProjectStatus);
  const error = useSelector(selectProjectError);
  const darkMode = useSelector(selectDarkMode);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    category: 'branding',
    image: '',
    images: [],
    client: '',
    date: '',
    featured: false
  });
  
  // Form validation state
  const [validated, setValidated] = useState(false);
  
  // Fetch project data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchProjectById(id));
    } else {
      dispatch(clearCurrentProject());
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch, id, isEditMode]);
  
  // Populate form with project data when available
  useEffect(() => {
    if (isEditMode && project) {
      setFormData({
        title: project.title || '',
        titleAr: project.titleAr || '',
        description: project.description || '',
        descriptionAr: project.descriptionAr || '',
        category: project.category || 'branding',
        image: project.image || '',
        images: project.images || [],
        client: project.client || '',
        date: project.date || '',
        featured: project.featured || false
      });
    }
  }, [isEditMode, project]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle images array input change
  const handleImagesChange = (e) => {
    const imagesString = e.target.value;
    const imagesArray = imagesString.split(',').map(url => url.trim());
    setFormData({
      ...formData,
      images: imagesArray
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Form validation
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    
    // Prepare data for submission
    const projectData = {
      ...formData,
      // Ensure images is an array
      images: Array.isArray(formData.images) 
        ? formData.images 
        : formData.images.split(',').map(url => url.trim())
    };
    
    if (isEditMode) {
      dispatch(updateProject({ id, projectData }))
        .unwrap()
        .then(() => {
          navigate('/admin/projects');
        });
    } else {
      dispatch(createProject(projectData))
        .unwrap()
        .then(() => {
          navigate('/admin/projects');
        });
    }
  };
  
  // Categories for select dropdown
  const categories = [
    'branding',
    'ui-design',
    'social-media',
    'packaging',
    'print',
    'motion'
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>
          {isEditMode 
            ? `${t('admin.edit')} ${t('admin.projects')}` 
            : `${t('admin.addNew')} ${t('admin.projects')}`}
          {' '} | {t('app.title')}
        </title>
      </Helmet>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="project-form-page"
      >
        <div className="page-header">
          <div>
            <h1>
              {isEditMode 
                ? `${t('admin.edit')} ${t('admin.projects')}` 
                : `${t('admin.addNew')} ${t('admin.projects')}`}
            </h1>
            <p>{isEditMode ? 'Update project details' : 'Create a new project'}</p>
          </div>
          <Button 
            variant="outline-secondary" 
            className="back-btn"
            onClick={() => navigate('/admin/projects')}
          >
            <FaArrowLeft className="me-2" />
            Back to Projects
          </Button>
        </div>
        
        <Card className={`form-card ${darkMode ? 'dark-mode' : ''}`}>
          <Card.Body>
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}
            
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="projectTitle">
                    <Form.Label>{t('admin.projectForm.title')} (English)</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter project title"
                    />
                    <Form.Control.Feedback type="invalid">
                      Project title is required
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="projectTitleAr">
                    <Form.Label>{t('admin.projectForm.title')} (Arabic)</Form.Label>
                    <Form.Control
                      type="text"
                      name="titleAr"
                      value={formData.titleAr}
                      onChange={handleInputChange}
                      required
                      placeholder="أدخل عنوان المشروع"
                      dir="rtl"
                    />
                    <Form.Control.Feedback type="invalid">
                      Arabic project title is required
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="projectDescription">
                    <Form.Label>{t('admin.projectForm.description')} (English)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter project description"
                    />
                    <Form.Control.Feedback type="invalid">
                      Project description is required
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="projectDescriptionAr">
                    <Form.Label>{t('admin.projectForm.description')} (Arabic)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="descriptionAr"
                      value={formData.descriptionAr}
                      onChange={handleInputChange}
                      required
                      placeholder="أدخل وصف المشروع"
                      dir="rtl"
                    />
                    <Form.Control.Feedback type="invalid">
                      Arabic project description is required
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="projectCategory">
                    <Form.Label>{t('admin.projectForm.category')}</Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {t(`projects.categories.${category}`)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="projectClient">
                    <Form.Label>{t('admin.projectForm.client')}</Form.Label>
                    <Form.Control
                      type="text"
                      name="client"
                      value={formData.client}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter client name"
                    />
                    <Form.Control.Feedback type="invalid">
                      Client name is required
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="projectDate">
                    <Form.Label>{t('admin.projectForm.date')}</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Project date is required
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="projectFeatured">
                    <Form.Check
                      type="checkbox"
                      label={t('admin.projectForm.featured')}
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="mt-4"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3" controlId="projectImage">
                <Form.Label>{t('admin.projectForm.image')}</Form.Label>
                <Form.Control
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter main image URL"
                />
                <Form.Control.Feedback type="invalid">
                  Main image URL is required
                </Form.Control.Feedback>
                {formData.image && (
                  <div className="image-preview mt-2">
                    <img src={formData.image} alt="Preview" />
                  </div>
                )}
              </Form.Group>
              
              <Form.Group className="mb-4" controlId="projectImages">
                <Form.Label>{t('admin.projectForm.images')}</Form.Label>
                <Form.Control
                  type="text"
                  name="images"
                  value={Array.isArray(formData.images) ? formData.images.join(', ') : formData.images}
                  onChange={handleImagesChange}
                  required
                  placeholder="Enter additional image URLs (comma separated)"
                />
                <Form.Control.Feedback type="invalid">
                  At least one additional image URL is required
                </Form.Control.Feedback>
                {formData.images && formData.images.length > 0 && (
                  <div className="images-preview mt-2">
                    {(Array.isArray(formData.images) ? formData.images : formData.images.split(',').map(url => url.trim()))
                      .filter(url => url) // Filter out empty strings
                      .map((url, index) => (
                        <div key={index} className="preview-item">
                          <img src={url} alt={`Preview ${index + 1}`} />
                        </div>
                      ))}
                  </div>
                )}
              </Form.Group>
              
              <div className="form-actions">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/admin/projects')}
                  className="me-2"
                >
                  {t('admin.cancel')}
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  className="save-btn"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" />
                      {t('admin.save')}
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </motion.div>
    </>
  );
};

export default ProjectForm;
