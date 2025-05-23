import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchUserById, 
  createUser, 
  updateUser,
  selectCurrentUser, 
  selectUserStatus,
  selectUserError,
  clearCurrentUser,
  fetchUsers
} from '../../redux/slices/usersSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import './UserForm.css';

const UserForm = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isEditMode = !!id;
  const user = useSelector(selectCurrentUser);
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);
  const darkMode = useSelector(selectDarkMode);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    name: '',
    role: 'user',
    is_active: false,
    email_verified: false
  });
  
  // Form validation state
  const [validated, setValidated] = useState(false);
  
  // Fetch user data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchUserById(id));
    } else {
      dispatch(clearCurrentUser());
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentUser());
    };
  }, [dispatch, id, isEditMode]);
  
  // Populate form with user data when available
  useEffect(() => {
    if (isEditMode && user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '', // Clear password fields in edit mode
        password_confirm: '', // Clear password confirm in edit mode
        name: user.name || '',
        role: user.role || 'user',
        is_active: user.is_active ?? false,
        email_verified: user.email_verified ?? false
      });
    }
  }, [isEditMode, user]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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

    // Create a clean payload without empty password fields
    const payload = {
      username: formData.username,
      email: formData.email,
      name: formData.name,
      role: formData.role,
      is_active: formData.is_active,
      email_verified: formData.email_verified
    };

    // Only add password fields if they're both filled
    if (formData.password && formData.password_confirm) {
      if (formData.password !== formData.password_confirm) {
        dispatch({
          type: 'users/setError',
          payload: 'Passwords do not match'
        });
        return;
      }
      payload.password = formData.password;
      payload.password_confirm = formData.password_confirm;
    } else if ((formData.password || formData.password_confirm) && !isEditMode) {
      dispatch({
        type: 'users/setError',
        payload: 'Both password fields are required for new users'
      });
      return;
    }

    try {
      const action = isEditMode
        ? updateUser({ id, userData: payload })
        : createUser(payload);

      await dispatch(action).unwrap();
      dispatch(fetchUsers());
      navigate('/admin/users');
    } catch (error) {
      console.error('Operation failed:', error);
      // Handle specific error cases
      if (error?.detail) {
        dispatch({
          type: 'users/setError',
          payload: error.detail
        });
      }
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
        <title>
          {isEditMode 
            ? `${t('admin.edit')} ${t('admin.users')}` 
            : `${t('admin.addNew')} ${t('admin.users')}`}
          {' '} | {t('app.title')}
        </title>
      </Helmet>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="user-form-page"
      >
        <div className="page-header">
          <div>
            <h1>
              {isEditMode 
                ? `${t('admin.edit')} ${t('admin.users')}` 
                : `${t('admin.addNew')} ${t('admin.users')}`}
            </h1>
            <p>{isEditMode ? 'Update user details' : 'Create a new user'}</p>
          </div>
          <Button 
            variant="outline-secondary" 
            className="back-btn"
            onClick={() => navigate('/admin/users')}
          >
            <FaArrowLeft className="me-2" />
            Back to Users
          </Button>
        </div>
        
        <Card className={`form-card ${darkMode ? 'dark-mode' : ''}`}>
          <Card.Body>
            {error && (
              <Alert variant="danger" className="mb-4">
                {typeof error === 'string'
                  ? error
                  : error?.detail ||
                    error?.message ||
                    (error?.non_field_errors ? error.non_field_errors.join(', ') : '') ||
                    (Array.isArray(error) ? error.join(', ') : Object.entries(error).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; ')) ||
                    'An error occurred.'}
              </Alert>
            )}
            
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="userUsername">
                    <Form.Label>{t('admin.userForm.username')}</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter username"
                    />
                    <Form.Control.Feedback type="invalid">
                      Username is required
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="userEmail">
                    <Form.Label>{t('admin.userForm.email')}</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter email address"
                    />
                    <Form.Control.Feedback type="invalid">
                      Valid email address is required
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                
                <Col md={12}>
                  <Form.Group className="mb-3" controlId="userName">
                    <Form.Label>{t('admin.userForm.name')}</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                  <Col md={6}>
                  <Form.Group className="mb-3" controlId="userPassword">
                    <Form.Label>
                      {t('admin.userForm.password')}
                      {isEditMode && ' (Leave blank to keep current password)'}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!isEditMode}
                      placeholder={isEditMode ? 'Leave blank to keep current' : 'Enter password'}
                      minLength={8}
                    />
                    <Form.Control.Feedback type="invalid">
                      {!isEditMode ? 'Password must be at least 8 characters' : ''}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="userPasswordConfirm">
                    <Form.Label>
                      {isEditMode ? 'Confirm New Password' : 'Confirm Password'}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password_confirm"
                      value={formData.password_confirm}
                      onChange={handleInputChange}
                      required={!isEditMode || formData.password}
                      placeholder={isEditMode ? 'Leave blank to keep current' : 'Confirm password'}
                    />
                    <Form.Control.Feedback type="invalid">
                      {!isEditMode ? 'Please confirm your password' : ''}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-4" controlId="userRole">
                <Form.Label>{t('admin.userForm.role')}</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Admin users have full access to the dashboard and can manage all content.
                </Form.Text>
              </Form.Group>
              
              {/* Add Email Verification Status */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="status-group">
                    <Form.Label>Account Status</Form.Label>
                    <div className="d-flex gap-3">
                      <Form.Check
                        type="switch"
                        id="is_active"
                        label="Active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({
                          ...formData,
                          is_active: e.target.checked
                        })}
                      />
                      <Form.Check
                        type="switch"
                        id="email_verified"
                        label="Email Verified"
                        checked={formData.email_verified}
                        onChange={(e) => setFormData({
                          ...formData,
                          email_verified: e.target.checked,
                          is_active: e.target.checked ? true : formData.is_active // Activate if email verified
                        })}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="form-actions">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/admin/users')}
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

export default UserForm;
