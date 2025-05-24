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
  clearCurrentProject,
  fetchCategories,
  selectAllCategories,
  selectCategoriesStatus,
  selectCategoriesError,
  createCategory
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
  const categories = useSelector(selectAllCategories);
  const categoriesStatus = useSelector(selectCategoriesStatus);
  const categoriesError = useSelector(selectCategoriesError);
  
  // Cleaned formData (no image/images)
  const [formData, setFormData] = useState({
    title: '',
    title_ar: '',
    description: '',
    description_ar: '',
    category: 1,
    client: '',
    date: '',
    featured: false
  });
  
  // File state
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  
  // Form validation state
  const [validated, setValidated] = useState(false);
  // Field-specific validation errors from backend
  const [fieldErrors, setFieldErrors] = useState({});
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryNameAr, setNewCategoryNameAr] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  
  // Fetch project data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchProjectById(id));
    }
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch, id, isEditMode]);
  
  // Fetch categories for select input
  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);
  
  // Populate form with project data when available
  useEffect(() => {
    if (isEditMode && project) {
      setFormData({
        title: project.title || '',
        title_ar: project.title_ar || '',
        description: project.description || '',
        description_ar: project.description_ar || '',
        category: project.category || 1,
        client: project.client || '',
        date: project.date || '',
        featured: project.featured || false
      });
      
      // Set image previews
      if (project.image) {
        setImagePreview(project.image);
      }
      
      // Set additional image previews
      if (project.images && project.images.length > 0) {
        setAdditionalImagePreviews(project.images);
      }
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
  
  // Handle main image file upload
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected main image file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      // Clear any previous image validation errors
      setFieldErrors(prev => ({...prev, image: null}));
      
      // Validate image file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        setFieldErrors(prev => ({
          ...prev, 
          image: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.'
        }));
        return;
      }
      
      // Validate image file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setFieldErrors(prev => ({
          ...prev, 
          image: 'Image file is too large. Maximum size is 5MB.'
        }));
        return;
      }
      
      // Store the file object itself
      setMainImageFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  
  // Handle additional images file upload
  const handleAdditionalImagesChange = (e) => {
    // Reset the input value to ensure onChange fires even if same files are selected again
    const inputElement = e.target;
    const files = Array.from(inputElement.files);
    inputElement.value = null;
    
    if (files.length > 0) {
      console.log(`Selected ${files.length} additional image files:`, 
        files.map(f => ({ name: f.name, type: f.type, size: f.size })));
      
      // Clear any previous additional images validation errors
      setFieldErrors(prev => ({...prev, additional_images: null}));
      
      // Validate image file types and sizes
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      const invalidFiles = [];
      
      // Check each file for validity
      files.forEach(file => {
        if (!validImageTypes.includes(file.type)) {
          invalidFiles.push(`${file.name}: Invalid file type`);
        } else if (file.size > maxSize) {
          invalidFiles.push(`${file.name}: File too large (max 5MB)`);
        }
      });
      
      // If there are invalid files, show error and return
      if (invalidFiles.length > 0) {
        setFieldErrors(prev => ({
          ...prev,
          additional_images: invalidFiles.join(', ')
        }));
        return;
      }
      
      // All files are valid, proceed
      setAdditionalImageFiles(prevFiles => [...prevFiles, ...files]);
      
      // Create preview URLs
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setAdditionalImagePreviews(prevPreviews => [...prevPreviews, ...previewUrls]);
    }
  };
  
  // Remove an additional image
  const removeAdditionalImage = (index) => {
    const newFiles = [...additionalImageFiles];
    newFiles.splice(index, 1);
    setAdditionalImageFiles(newFiles);
    
    const newPreviews = [...additionalImagePreviews];
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setAdditionalImagePreviews(newPreviews);
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
    setFieldErrors({});
    
    // Create FormData object for file uploads
    const formDataObj = new FormData();
    
    // Add basic form fields
    formDataObj.append('title', formData.title);
    formDataObj.append('title_ar', formData.title_ar);
    formDataObj.append('description', formData.description);
    formDataObj.append('description_ar', formData.description_ar);
    formDataObj.append('category', String(formData.category)); // should be the ID
    formDataObj.append('client', formData.client);
    formDataObj.append('date', formData.date);
    formDataObj.append('featured', formData.featured ? 'true' : 'false');
    
    // Skip image validation in edit mode if we already have an image preview
    // and no new file was selected
    const needsMainImage = !isEditMode || (!imagePreview && !mainImageFile);
    
    // Only validate main image if we're in create mode or if there's no existing image
    if (needsMainImage && !mainImageFile) {
      console.log('Main image validation failed: No image provided and one is required');
      setFieldErrors(prev => ({
        ...prev,
        image: 'Main image is required'
      }));
      return;
    }
    
    // Add main image if we have one
    if (mainImageFile instanceof File) {
      console.log('Adding main image to FormData:', {
        name: mainImageFile.name,
        type: mainImageFile.type,
        size: mainImageFile.size
      });
      formDataObj.append('image', mainImageFile);
    }
    
    // Add additional images - simplified approach
    if (additionalImageFiles && additionalImageFiles.length > 0) {
      console.log(`Adding ${additionalImageFiles.length} additional images to FormData`);
      
      // Use a simpler loop for appending files
      for (let i = 0; i < additionalImageFiles.length; i++) {
        const file = additionalImageFiles[i];
        if (file instanceof File) {
          console.log(`Additional image ${i}:`, {
            name: file.name,
            type: file.type,
            size: file.size
          });
          // Just append the file with no extra parameters
          formDataObj.append('additional_images', file);
        }
      }
    }
    
    // Log FormData for debugging
    console.log('Final FormData contents:');
    for (let [key, value] of formDataObj.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File (${value.name}, ${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    
    // Special handling for empty file inputs in edit mode
    // In edit mode, if we don't add any new files, we shouldn't include them in the FormData
    // This prevents 400 errors from Django when empty files are submitted
    
    console.log('Form submission in', isEditMode ? 'EDIT' : 'CREATE', 'mode');
    
    // Handle form submission with better error handling
    if (isEditMode) {
      // Log what's being sent for update
      console.log('Sending update request for project ID:', id);
      
      dispatch(updateProject({ id, projectData: formDataObj }))
        .unwrap()
        .then(() => {
          console.log('Project updated successfully');
          navigate('/admin/projects');
        })
        .catch(error => {
          console.error('Project update error:', error);
          
          // Check if the error is a validation error (object with field names as keys)
          if (error && typeof error === 'object' && !Array.isArray(error)) {
            // Format and display validation errors
            setFieldErrors(error);
          }
        });
    } else {
      // Create new project
      dispatch(createProject(formDataObj))
        .unwrap()
        .then(() => {
          console.log('Project created successfully');
          navigate('/admin/projects');
        })
        .catch(error => {
          console.error('Project creation error:', error);
          
          // Check if the error is a validation error (object with field names as keys)
          if (error && typeof error === 'object' && !Array.isArray(error)) {
            setFieldErrors(error);
          }
        });
    }
  };
  
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

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === '__new__') {
      setShowNewCategory(true);
    } else {
      setFormData({ ...formData, category: value });
      setShowNewCategory(false);
    }
  };

  const handleAddCategory = async () => {
    setCreatingCategory(true);
    try {
      const res = await dispatch(createCategory({
        name: newCategoryName,
        name_ar: newCategoryNameAr
      })).unwrap();
      // Set the new category as selected
      setFormData({ ...formData, category: res.id });
      setShowNewCategory(false);
      setNewCategoryName('');
      setNewCategoryNameAr('');
    } catch (err) {
      alert('Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
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
                {typeof error === 'object'
                  ? error.detail || error.message || JSON.stringify(error)
                  : error}
              </Alert>
            )}
            {categoriesError && (
              <Alert variant="danger" className="mt-2">
                {categoriesError}
              </Alert>
            )}
            <Form noValidate validated={validated} onSubmit={handleSubmit} encType="multipart/form-data">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="projectTitle">
                    <Form.Label>{t('admin.projectForm.title')} (English)</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      isInvalid={!!fieldErrors.title}
                      required
                    />
                    {fieldErrors.title && (
                      <Form.Control.Feedback type="invalid">
                        {Array.isArray(fieldErrors.title) ? fieldErrors.title[0] : fieldErrors.title}
                      </Form.Control.Feedback>
                    )}
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
                      name="title_ar"
                      value={formData.title_ar}
                      onChange={handleInputChange}
                      isInvalid={!!fieldErrors.title_ar}
                      required
                      placeholder="أدخل عنوان المشروع"
                      dir="rtl"
                    />
                    {fieldErrors.title_ar && (
                      <Form.Control.Feedback type="invalid">
                        {Array.isArray(fieldErrors.title_ar) ? fieldErrors.title_ar[0] : fieldErrors.title_ar}
                      </Form.Control.Feedback>
                    )}
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
                      isInvalid={!!fieldErrors.description}
                      required
                      placeholder="Enter project description"
                    />
                    {fieldErrors.description && (
                      <Form.Control.Feedback type="invalid">
                        {Array.isArray(fieldErrors.description) ? fieldErrors.description[0] : fieldErrors.description}
                      </Form.Control.Feedback>
                    )}
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
                      name="description_ar"
                      value={formData.description_ar}
                      onChange={handleInputChange}
                      isInvalid={!!fieldErrors.description_ar}
                      required
                      placeholder="أدخل وصف المشروع"
                      dir="rtl"
                    />
                    {fieldErrors.description_ar && (
                      <Form.Control.Feedback type="invalid">
                        {Array.isArray(fieldErrors.description_ar) ? fieldErrors.description_ar[0] : fieldErrors.description_ar}
                      </Form.Control.Feedback>
                    )}
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
                      onChange={handleCategoryChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                      <option value="__new__">+ Create new category</option>
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
                  type="file"
                  name="image"
                  onChange={handleMainImageChange}
                  accept="image/*"
                  isInvalid={!!fieldErrors.image}
                  required={!isEditMode || !imagePreview}
                />
                <Form.Text className="text-muted">
                  Upload the main image for the project (JPEG, PNG, GIF, WebP, max 5MB)
                </Form.Text>
                {fieldErrors.image && (
                  <div className="text-danger mt-1">
                    {Array.isArray(fieldErrors.image) ? fieldErrors.image[0] : fieldErrors.image}
                  </div>
                )}
                <Form.Control.Feedback type="invalid">
                  Main image is required
                </Form.Control.Feedback>
                {imagePreview && (
                  <div className="image-preview mt-2">
                    <img src={imagePreview} alt="Preview" />
                    {isEditMode && !mainImageFile && (
                      <div className="current-image-note">Current image (will not change unless you select a new file)</div>
                    )}
                  </div>
                )}
              </Form.Group>
              
              <Form.Group className="mb-4" controlId="projectImages">
                <Form.Label>{t('admin.projectForm.images')}</Form.Label>
                <Form.Control
                  type="file"
                  name="additionalImages"
                  onChange={handleAdditionalImagesChange}
                  accept="image/*"
                  multiple
                  isInvalid={!!fieldErrors.additional_images}
                  required={!isEditMode && additionalImagePreviews.length === 0}
                />
                <Form.Text className="text-muted">
                  Upload additional images for the project (JPEG, PNG, GIF, WebP, max 5MB each, hold Ctrl to select multiple files)
                </Form.Text>
                {fieldErrors.additional_images && (
                  <div className="text-danger mt-1">
                    {typeof fieldErrors.additional_images === 'string' 
                      ? fieldErrors.additional_images 
                      : Object.keys(fieldErrors.additional_images).map(key => {
                          const error = fieldErrors.additional_images[key];
                          return <div key={key}>{Array.isArray(error) ? error.join(', ') : String(error)}</div>;
                        })
                    }
                  </div>
                )}
                <Form.Control.Feedback type="invalid">
                  At least one additional image is required
                </Form.Control.Feedback>
                {additionalImagePreviews.length > 0 && (
                  <div className="images-preview mt-2">
                    {additionalImagePreviews.map((url, index) => (
                      <div key={index} className="preview-item">
                        <img src={url} alt={`Preview ${index + 1}`} />
                        <button 
                          type="button" 
                          className="remove-image-btn" 
                          onClick={() => removeAdditionalImage(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>
              
              {showNewCategory && (
                <div className="mt-2">
                  <Form.Control
                    type="text"
                    placeholder="New category name (English)"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                  />
                  <Form.Control
                    type="text"
                    placeholder="New category name (Arabic)"
                    value={newCategoryNameAr}
                    onChange={e => setNewCategoryNameAr(e.target.value)}
                  />
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={handleAddCategory}
                    disabled={creatingCategory || !newCategoryName || !newCategoryNameAr}
                  >
                    {creatingCategory ? 'Adding...' : 'Add Category'}
                  </Button>
                </div>
              )}
              
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
