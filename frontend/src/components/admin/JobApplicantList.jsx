import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, Button, Form, Row, Col, Table, Badge, Modal } from 'react-bootstrap';
import { FaPlus, FaEye, FaTrash, FaDownload, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './JobApplicantList.css';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import api from '../../utils/api';

const JobApplicationsList = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/job-applications/');
      console.log('API Response:', response);
      
      // Handle both array and paginated responses
      const data = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || response.data.data || [];
      
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error(t('common.error') || 'Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app =>
    app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleDeleteClick = (app) => {
    setAppToDelete(app);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!appToDelete) return;
    try {
      await api.delete(`/job-applications/${appToDelete.id}/`);
      setApplications(applications.filter(app => app.id !== appToDelete.id));
      toast.success(t('admin.jobApplicationsList.deletedSuccessfully'));
      setShowDeleteModal(false);
      setAppToDelete(null);
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error(t('common.error') || 'Failed to delete application');
    }
  };

  const getPositionColor = (position) => {
    const colors = {
      graphic_designer: 'info',
      motion_designer: 'primary',
      content_creator: 'success',
      media_buyer: 'warning'
    };
    return colors[position] || 'secondary';
  };

  const getExperienceLabel = (exp) => {
    return t(`admin.jobApplicationsList.experienceLabels.${exp}`) || exp;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Helmet>
        <title>{t('app.title')} - {t('admin.jobApplicationsList.title')}</title>
      </Helmet>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="job-applications-page"
      >
        <div className="page-header">
          <div>
            <h1>{t('admin.jobApplicationsList.title')}</h1>
            <p>{t('admin.jobApplicationsList.subtitle')}</p>
          </div>
          <Button 
            variant="primary" 
            className="add-btn"
            onClick={fetchApplications}
          >
            <FaSearch className="me-2" />
            {t('admin.jobApplicationsList.refresh')}
          </Button>
        </div>

        <Card className={`list-card ${darkMode ? 'dark-mode' : ''}`}>
          <Card.Header>
            <Row className="align-items-center">
              <Col md={6}>
                <h5 className="mb-0">
                  {t('admin.jobApplicationsList.allApplications')} ({filteredApplications.length})
                </h5>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder={t('admin.jobApplicationsList.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">{t('common.loading')}</span>
                </div>
              </div>
            ) : filteredApplications.length > 0 ? (
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>{t('admin.jobApplicationsList.tableHeaders.id')}</th>
                      <th>{t('admin.jobApplicationsList.tableHeaders.name')}</th>
                      <th>{t('admin.jobApplicationsList.tableHeaders.email')}</th>
                      <th>{t('admin.jobApplicationsList.tableHeaders.position')}</th>
                      <th>{t('admin.jobApplicationsList.tableHeaders.experience')}</th>
                      <th>{t('admin.jobApplicationsList.tableHeaders.agencyExperience')}</th>
                      <th>{t('admin.jobApplicationsList.tableHeaders.dateApplied')}</th>
                      <th style={{ width: '120px' }}>{t('admin.jobApplicationsList.tableHeaders.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr key={app.id}>
                        <td>{app.id}</td>
                        <td>
                          <strong>{app.full_name}</strong>
                          <br />
                          <small className="text-muted">{app.city_country}</small>
                        </td>
                        <td>
                          <a href={`mailto:${app.email}`}>{app.email}</a>
                          <br />
                          <small className="text-muted">{app.phone}</small>
                        </td>
                        <td>
                          <Badge bg={getPositionColor(app.position)}>
                            {t(`jobApplicant.positions.${app.position}`) || app.position}
                          </Badge>
                        </td>
                        <td>{getExperienceLabel(app.years_of_experience)}</td>
                        <td>
                          {app.worked_in_agency_before ? (
                            <Badge bg="success">{t('admin.jobApplicationsList.yes')}</Badge>
                          ) : (
                            <Badge bg="secondary">{t('admin.jobApplicationsList.no')}</Badge>
                          )}
                        </td>
                        <td>
                          <small>{new Date(app.submitted_at).toLocaleDateString(i18n.language)}</small>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Button
                              variant="outline-info"
                              className="action-btn text-info"
                              onClick={() => handleViewDetails(app)}
                              title={t('admin.jobApplicationsList.details.title')}
                            >
                              <FaEye  />
                            </Button>
                            <Button
                              variant="outline-danger"
                              className="action-btn text-danger"
                              onClick={() => handleDeleteClick(app)}
                              title={t('admin.jobApplicationsList.delete')}
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
                <p className="text-muted">{t('admin.jobApplicationsList.noApplications')}</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </motion.div>

      {/* Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className={darkMode ? 'dark-mode' : ''}>
        <Modal.Header closeButton>
          <Modal.Title>{t('admin.jobApplicationsList.details.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApp && (
            <div className="application-details">
              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="mb-2">{t('admin.jobApplicationsList.details.fullName')}</h6>
                  <p>{selectedApp.full_name}</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-2">{t('admin.jobApplicationsList.details.email')}</h6>
                  <p><a href={`mailto:${selectedApp.email}`}>{selectedApp.email}</a></p>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="mb-2">{t('admin.jobApplicationsList.details.phone')}</h6>
                  <p><a href={`tel:${selectedApp.phone}`}>{selectedApp.phone}</a></p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-2">{t('admin.jobApplicationsList.details.location')}</h6>
                  <p>{selectedApp.city_country || 'N/A'}</p>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="mb-2">{t('admin.jobApplicationsList.details.position')}</h6>
                  <p><Badge bg={getPositionColor(selectedApp.position)}>{t(`jobApplicant.positions.${selectedApp.position}`) || selectedApp.position}</Badge></p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-2">{t('admin.jobApplicationsList.details.workType')}</h6>
                  <p>{selectedApp.work_type ? selectedApp.work_type.replace('_', ' ') : 'N/A'}</p>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="mb-2">{t('admin.jobApplicationsList.details.experience')}</h6>
                  <p>{getExperienceLabel(selectedApp.years_of_experience)}</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-2">{t('admin.jobApplicationsList.details.agencyExperience')}</h6>
                  <p>{selectedApp.worked_in_agency_before ? t('admin.jobApplicationsList.yes') : t('admin.jobApplicationsList.no')}</p>
                </Col>
              </Row>

              {selectedApp.portfolio_link && (
                <Row className="mb-4">
                  <Col>
                    <h6 className="mb-2">{t('admin.jobApplicationsList.details.portfolio')}</h6>
                    <p><a href={selectedApp.portfolio_link} target="_blank" rel="noopener noreferrer">{selectedApp.portfolio_link}</a></p>
                  </Col>
                </Row>
              )}

              {selectedApp.tools && selectedApp.tools.length > 0 && (
                <Row className="mb-4">
                  <Col>
                    <h6 className="mb-2">{t('admin.jobApplicationsList.details.toolsAndSoftware')}</h6>
                    <div className="tools-display">
                      {selectedApp.tools.map((tool, idx) => (
                        <Badge key={idx} bg="info" className="me-2 mb-2">{tool}</Badge>
                      ))}
                    </div>
                  </Col>
                </Row>
              )}

              <Row className="mb-4">
                <Col>
                  <h6 className="mb-2">{t('admin.jobApplicationsList.details.aboutYou')}</h6>
                  <p>{selectedApp.about_you}</p>
                </Col>
              </Row>

              <Row>
                <Col>
                  <small className="text-muted">{t('admin.jobApplicationsList.details.applied')}: {new Date(selectedApp.submitted_at).toLocaleString(i18n.language)}</small>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('admin.jobApplicationsList.details.close')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className={darkMode ? 'dark-mode' : ''}>
        <Modal.Header closeButton>
          <Modal.Title>{t('admin.jobApplicationsList.confirmDelete')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('admin.jobApplicationsList.deleteMessage')} <strong>{appToDelete?.full_name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {t('admin.jobApplicationsList.cancel')}
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            {t('admin.jobApplicationsList.delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default JobApplicationsList;