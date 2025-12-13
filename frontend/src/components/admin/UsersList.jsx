import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Table, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchUsers, 
  deleteUser,
  selectAllUsers, 
  selectUserStatus,
  selectUserError
} from '../../redux/slices/usersSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { FaPlus, FaEdit, FaTrash, FaUserShield, FaEnvelopeOpen, FaEnvelope, FaUserCheck, FaUserSlash, FaUser } from 'react-icons/fa';
import './UsersList.css';
import { toast } from 'react-toastify';

const UsersList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const users = useSelector(selectAllUsers);
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);
  const darkMode = useSelector(selectDarkMode);
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Fetch users on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);
  
  // Filter users based on search term
  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter(user => {
        return (
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm]);
  
  // Handle delete confirmation
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  
  // Handle delete user
  const handleDeleteUser = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete.id));
      toast.success(t('admin.usersList.deleteSuccess'));
      setShowDeleteModal(false);
      setUserToDelete(null);
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
        <title>{t('app.title')} - {t('admin.users')}</title>
      </Helmet>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="users-list-page"
      >
        <div className="page-header">
          <div>
            <h1>{t('admin.users')}</h1>
            <p>{t('admin.usersList.subtitle')}</p>
          </div>
          <Button 
            as={Link} 
            to="/admin/users/new" 
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
                <h5 className="mb-0">{t('admin.usersList.title')}</h5>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder={t('admin.usersList.searchPlaceholder')}
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
                  onClick={() => dispatch(fetchUsers())}
                >
                  {t('common.retry')}
                </Button>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>{t('admin.usersList.tableHeaders.id')}</th>
                      <th>{t('admin.usersList.tableHeaders.username')}</th>
                      <th>{t('admin.usersList.tableHeaders.name')}</th>
                      <th>{t('admin.usersList.tableHeaders.email')}</th>
                      <th>{t('admin.usersList.tableHeaders.status')}</th>
                      <th>{t('admin.usersList.tableHeaders.role')}</th>
                      <th style={{ width: '120px' }}>{t('admin.usersList.tableHeaders.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.name || '-'}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {user.email}
                            <Badge 
                              bg={user.email_verified ? 'success' : 'warning'}
                              className="verification-badge"
                            >
                              {Boolean(user.email_verified) ? (
                                <><FaEnvelopeOpen size="0.8em" /> {t('admin.usersList.verified')}</>
                              ) : (
                                <><FaEnvelope size="0.8em" /> {t('admin.usersList.unverified')}</>
                              )}
                            </Badge>
                          </div>
                        </td>
                        <td>
                          <Badge 
                            bg={user.is_active ? 'success' : 'danger'}
                            className="status-badge"
                          >
                            {Boolean(user.is_active) ? (
                              <><FaUserCheck size="0.8em" /> {t('admin.usersList.active')}</>
                            ) : (
                              <><FaUserSlash size="0.8em" /> {t('admin.usersList.inactive')}</>
                            )}
                          </Badge>
                        </td>
                        <td>
                          <Badge 
                            bg={user.role === 'admin' ? 'primary' : 'secondary'}
                            className="role-badge"
                          >
                            {user.role === 'admin' ? (
                              <><FaUserShield size="0.8em" /> {t('admin.usersList.admin')}</>
                            ) : (
                              <><FaUser size="0.8em" /> {t('admin.usersList.user')}</>
                            )}
                          </Badge>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Button 
                              as={Link}
                              to={`/admin/users/edit/${user.id}`}
                              variant="outline-primary" 
                              className="action-btn"
                              title={t('admin.usersList.edit')}
                            >
                              <FaEdit />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              className="action-btn"
                              title={t('admin.usersList.delete')}
                              onClick={() => confirmDelete(user)}
                              disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
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
                <p>
                  {t('admin.usersList.noUsers')} {searchTerm && t('admin.usersList.tryDifferentSearch')}
                </p>
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
            <Modal.Title>{t('admin.usersList.confirmDelete')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {t('admin.usersList.deleteMessage')}
              <br />
              <strong>
                {userToDelete && userToDelete.username}
              </strong>
            </p>
            {userToDelete && userToDelete.role === 'admin' && (
              <Alert variant="warning">
                <FaUserShield className="me-2" />
                {t('admin.usersList.adminWarning')}
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              {t('admin.no')}
            </Button>
            <Button variant="danger" onClick={handleDeleteUser}>
              {t('admin.yes')}
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </>
  );
};

export default UsersList;
