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
import { toast } from 'react-toastify';

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
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]); // new files previews (URLs)
  const [existingImages, setExistingImages] = useState([]); // [{ id, url }]
  const [deletedExistingImageIds, setDeletedExistingImageIds] = useState([]);
  const [imagePreview, setImagePreview] = useState(null); 

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
      
      // Existing gallery images: map to {id, url}
      if (project.images && project.images.length > 0) {
        setExistingImages(project.images.map(img => ({ id: img.id, url: img.image })));
      } else {
        setExistingImages([]);
      }

      // new-file previews should be empty initially in edit mode
      setAdditionalImagePreviews([]);
      setAdditionalImageFiles([]);
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
      // revoke previous object URL if it was created
      if (imagePreview && typeof imagePreview === 'string' && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }

      // Store the file object itself
      setMainImageFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  
  // Remove a new additional image (file selected in this session)
  const removeAdditionalImage = (index) => {
    const newFiles = [...additionalImageFiles];
    newFiles.splice(index, 1);
    setAdditionalImageFiles(newFiles);

    const newPreviews = [...additionalImagePreviews];
    // revoke object URL if applicable
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setAdditionalImagePreviews(newPreviews);
  };

  // Remove an existing image (already saved on server)
  const removeExistingImage = (id) => {
    if (!id) return;
    // mark for deletion
    setDeletedExistingImageIds(prev => [...prev, id]);
    // remove from existingImages state to update UI
    setExistingImages(prev => prev.filter(img => img.id !== id));
  };

  // Handle additional images file upload (new files)
  const handleAdditionalImagesChange = (e) => {
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

      // Create preview URLs for new files
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setAdditionalImagePreviews(prevPreviews => [...prevPreviews, ...previewUrls]);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    setFieldErrors({});
    
    const formDataObj = new FormData();
    
    // Add basic form fields first
    Object.keys(formData).forEach(key => {
      // Exclude image fields from basic data
      if (key !== 'image' && key !== 'additional_images') {
        formDataObj.append(key, formData[key]);
      }
    });

    // Handle main image - ensure it's a File object
    if (mainImageFile instanceof File) {
      console.log('Adding main image:', {
        name: mainImageFile.name,
        type: mainImageFile.type,
        size: mainImageFile.size
      });
      formDataObj.append('image', mainImageFile, mainImageFile.name);
    } else if (!isEditMode) {
      setFieldErrors(prev => ({
        ...prev,
        image: 'Main image is required'
      }));
      return;
    }

    // Handle additional images - ensure they're File objects
    if (additionalImageFiles?.length > 0) {
      console.log(`Adding ${additionalImageFiles.length} additional images`);
      additionalImageFiles.forEach((file, index) => {
        if (file instanceof File) {
          console.log(`Additional image ${index}:`, {
            name: file.name,
            type: file.type,
            size: file.size
          });
          formDataObj.append('additional_images', file, file.name);
        }
      });
    }

    // Handle deleted images in edit mode
    if (isEditMode && deletedExistingImageIds.length > 0) {
      formDataObj.append('deleted_image_ids', JSON.stringify(deletedExistingImageIds));
    }

    // Log final FormData for debugging
    for (let pair of formDataObj.entries()) {
      const value = pair[1] instanceof File 
        ? `File: ${pair[1].name} (${pair[1].type}, ${pair[1].size} bytes)`
        : pair[1];
      console.log(`${pair[0]}: ${value}`);
    }

    // Submit form with proper content type
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      if (isEditMode) {
        await dispatch(updateProject({ id, projectData: formDataObj })).unwrap();
        toast.success(t('admin.notifications.projectUpdateSuccess'));
      } else {
        await dispatch(createProject(formDataObj)).unwrap();
        toast.success(t('admin.notifications.projectCreateSuccess'));
      }
      navigate('/admin/projects');
    } catch (error) {
      toast.error(t(`admin.notifications.${isEditMode ? 'updateError' : 'createError'}`));
      setFieldErrors(error);
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

  // Cleanup object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      try {
        // revoke any created blob: URLs for additional previews
        additionalImagePreviews.forEach(url => {
          if (typeof url === 'string' && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
        // revoke main image preview if it is a blob URL
        if (imagePreview && typeof imagePreview === 'string' && imagePreview.startsWith('blob:')) {
          URL.revokeObjectURL(imagePreview);
        }
      } catch (err) {
        // noop
      }
    };
  }, [additionalImagePreviews, imagePreview]);

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
            <p>{t(isEditMode ? 'admin.projectForm.editMode' : 'admin.projectForm.createMode')}</p>
          </div>
          <Button 
            variant="outline-secondary" 
            className="back-btn"
            onClick={() => navigate('/admin/projects')}
          >
            <FaArrowLeft className="me-2" />
            {t('admin.projectForm.backToProjects')}
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
                      placeholder={t('admin.projectForm.placeholders.title')}
                    />
                    {fieldErrors.title && (
                      <Form.Control.Feedback type="invalid">
                        {Array.isArray(fieldErrors.title) ? fieldErrors.title[0] : fieldErrors.title}
                      </Form.Control.Feedback>
                    )}
                    <Form.Control.Feedback type="invalid">
                      {t('admin.projectForm.requiredField')}
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
                      placeholder={t('admin.projectForm.placeholders.titleAr')}
                      dir="rtl"
                    />
                    {fieldErrors.title_ar && (
                      <Form.Control.Feedback type="invalid">
                        {Array.isArray(fieldErrors.title_ar) ? fieldErrors.title_ar[0] : fieldErrors.title_ar}
                      </Form.Control.Feedback>
                    )}
                    <Form.Control.Feedback type="invalid">
                      {t('admin.projectForm.requiredField')}
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
                      placeholder={t('admin.projectForm.placeholders.description')}
                    />
                    {fieldErrors.description && (
                      <Form.Control.Feedback type="invalid">
                        {Array.isArray(fieldErrors.description) ? fieldErrors.description[0] : fieldErrors.description}
                      </Form.Control.Feedback>
                    )}
                    <Form.Control.Feedback type="invalid">
                      {t('admin.projectForm.requiredField')}
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
                      placeholder={t('admin.projectForm.placeholders.descriptionAr')}
                      dir="rtl"
                    />
                    {fieldErrors.description_ar && (
                      <Form.Control.Feedback type="invalid">
                        {Array.isArray(fieldErrors.description_ar) ? fieldErrors.description_ar[0] : fieldErrors.description_ar}
                      </Form.Control.Feedback>
                    )}
                    <Form.Control.Feedback type="invalid">
                      {t('admin.projectForm.requiredField')}
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
                      <option value="">{t('admin.projectForm.selectCategory')}</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                      <option value="__new__">{t('admin.projectForm.createNewCategory')}</option>
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
                      placeholder={t('admin.projectForm.placeholders.client')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {t('admin.projectForm.requiredField')}
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
                      {t('admin.projectForm.requiredField')}
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
                  {t('admin.projectForm.help.mainImage')}
                </Form.Text>
                {fieldErrors.image && (
                  <div className="text-danger mt-1">
                    {Array.isArray(fieldErrors.image) ? fieldErrors.image[0] : fieldErrors.image}
                  </div>
                )}
                <Form.Control.Feedback type="invalid">
                  {t('admin.projectForm.requiredField')}
                </Form.Control.Feedback>
                {imagePreview && (
                  <div className="image-preview mt-2">
                    <img src={imagePreview} alt="Preview" />
                    {isEditMode && !mainImageFile && (
                    <div className="current-image-note">
                      {t('admin.projectForm.help.currentImage')}
                    </div>
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
                {t('admin.projectForm.help.additionalImages')}
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
                  {t('admin.projectForm.atLeastOneAdditionalImage')}
                </Form.Control.Feedback>
                { (existingImages.length || additionalImagePreviews.length) && (
                  <div className="images-preview mt-2">
                    {existingImages.map((img) => (
                      <div key={`existing-${img.id}`} className="preview-item">
                        <img src={img.url} alt={`Existing ${img.id}`} />
                        <button type="button" className="remove-image-btn" onClick={() => removeExistingImage(img.id)}>
                          &times;
                        </button>
                      </div>
                    ))}
                    {additionalImagePreviews.map((url, index) => (
                      <div key={`new-${index}`} className="preview-item">
                        <img src={url} alt={`Preview ${index + 1}`} />
                        <button type="button" className="remove-image-btn" onClick={() => removeAdditionalImage(index)}>
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
                    placeholder={t('admin.projectForm.placeholders.newCategory')}
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                  />
                  <Form.Control
                    type="text"
                    placeholder={t('admin.projectForm.placeholders.newCategoryAr')}
                    value={newCategoryNameAr}
                    onChange={e => setNewCategoryNameAr(e.target.value)}
                    dir="rtl"
                  />
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={handleAddCategory}
                    disabled={creatingCategory || !newCategoryName || !newCategoryNameAr}
                  >
                    {creatingCategory ? t('common.adding') : t('admin.projectForm.addCategory')}
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
