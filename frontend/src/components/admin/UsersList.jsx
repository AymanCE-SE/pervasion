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
import { FaPlus, FaEdit, FaTrash, FaUserShield } from 'react-icons/fa';
import './UsersList.css';

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
            <p>Manage user accounts</p>
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
                <h5 className="mb-0">All Users</h5>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Search users..."
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
                      <th style={{ width: '50px' }}>#</th>
                      <th>Username</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th style={{ width: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.name || '-'}</td>
                        <td>{user.email}</td>
                        <td>
                          <Badge 
                            bg={user.role === 'admin' ? 'primary' : 'secondary'}
                            className="role-badge"
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Button 
                              as={Link}
                              to={`/admin/users/edit/${user.id}`}
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
                <p>No users found. {searchTerm && 'Try a different search term.'}</p>
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
                {userToDelete && userToDelete.username}
              </strong>
            </p>
            {userToDelete && userToDelete.role === 'admin' && (
              <Alert variant="warning">
                <FaUserShield className="me-2" />
                Warning: You are about to delete an admin user.
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
