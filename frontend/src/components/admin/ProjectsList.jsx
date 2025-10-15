import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Table, Badge, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchProjects, 
  deleteProject,
  selectAllProjects, 
  selectProjectStatus,
  selectProjectError,
  selectAllCategories
} from '../../redux/slices/projectsSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { selectLanguage } from '../../redux/slices/languageSlice';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './ProjectsList.css';
import { toast } from 'react-toastify';

const ProjectsList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const projects = useSelector(selectAllProjects);
  const status = useSelector(selectProjectStatus);
  const error = useSelector(selectProjectError);
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);
  const categories = useSelector(selectAllCategories);
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  
  // Fetch projects on component mount and when navigating back to this page
  useEffect(() => {
    // Always fetch projects when component mounts to ensure the list is up-to-date
    dispatch(fetchProjects());
    
    // Set up a cleanup function that returns the status to 'idle' when the component unmounts
    return () => {
      // This will ensure that when we navigate back to this page, it will refetch
      // This is needed because we manually dispatch in ProjectForm after successful operations
    };
  }, [dispatch]);
  
  // Filter projects based on search term
  useEffect(() => {
    if (projects.length > 0) {
      const filtered = projects.filter(project => {
        const title = language === 'en' ? project.title : project.title_ar;
        return title.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredProjects(filtered);
    }
  }, [projects, searchTerm, language]);
  
  // Handle delete confirmation
  const confirmDelete = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };
  
  // Handle delete project
  const handleDeleteProject = async () => {
    try {
      await dispatch(deleteProject(projectToDelete.id)).unwrap();
      toast.success(t('admin.notifications.projectDeleteSuccess'));
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(t('admin.notifications.deleteError'));
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

  return (
    <>
      <Helmet>
        <title>{t('app.title')} - {t('admin.projects')}</title>
      </Helmet>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="projects-list-page"
      >
        <div className="page-header">
          <div>
            <h1>{t('admin.projects')}</h1>
            <p>Manage your portfolio projects</p>
          </div>
          <Button 
            as={Link} 
            to="/admin/projects/new" 
            variant="primary" 
            className="add-btn"
          >
            <FaPlus className="me-2" />
            {t('admin.addNew')}
          </Button>
        </div>
        
        <Card className={`list-card ${darkMode ? 'dark-mode' : ''}`}>
          <Card.Header>
            <Row className="align-items-center">
              <Col md={6}>
                <h5 className="mb-0">All Projects</h5>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            {status === 'loading' ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">{t('common.loading')}</span>
                </div>
              </div>
            ) : status === 'failed' ? (
              <div className="text-center py-5">
                <p className="text-danger">
                  {error && typeof error === 'object'
                    ? error.detail || error.message || JSON.stringify(error)
                    : error}
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => dispatch(fetchProjects())}
                >
                  {t('common.retry')}
                </Button>
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>#</th>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Featured</th>
                      <th style={{ width: '150px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project.id}>
                        <td>{project.id}</td>
                        <td>
                          <div className="project-thumbnail">
                            <img src={project.image} alt={project.title} />
                          </div>
                        </td>
                        <td>
                          {language === 'en' ? project.title : project.title_ar}
                        </td>
                        <td>
                        <Badge bg="info" className="category-badge">
                          {language === 'en' ? project.category_name : project.category_name_ar}
                        </Badge>
                        </td>
                        <td>{new Date(project.date).toLocaleDateString()}</td>
                        <td>
                          <Badge 
                            bg={project.featured ? 'success' : 'secondary'}
                            className="featured-badge"
                          >
                            {project.featured ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Button 
                              as={Link}
                              to={`/projects/${project.id}`}
                              variant="outline-info" 
                              size="sm" 
                              className="action-btn"
                              title="View"
                            >
                              <FaEye />
                            </Button>
                            <Button 
                              as={Link}
                              to={`/admin/projects/edit/${project.id}`}
                              variant="outline-primary" 
                              size="sm" 
                              className="action-btn"
                              title="Edit"
                            >
                              <FaEdit />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="action-btn"
                              title="Delete"
                              onClick={() => confirmDelete(project)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-5">
                <p>No projects found. {searchTerm && 'Try a different search term.'}</p>
              </div>
            )}
          </Card.Body>
        </Card>
        
        {/* Delete Confirmation Modal */}
        <Modal 
          show={showDeleteModal} 
          onHide={() => setShowDeleteModal(false)}
          centered
          className={darkMode ? 'dark-mode' : ''}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {t('admin.confirmDelete')}
              <br />
              <strong>
                {projectToDelete && (language === 'en' ? projectToDelete.title : projectToDelete.title_ar)}
              </strong>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              {t('admin.no')}
            </Button>
            <Button variant="danger" onClick={handleDeleteProject}>
              {t('admin.yes')}
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </>
  );
};

export default ProjectsList;
