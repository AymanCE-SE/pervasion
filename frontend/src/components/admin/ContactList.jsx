import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Badge, Card, Table, Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FaTrash, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';
import { 
  fetchContacts, 
  markAsRead,
  deleteContact,
  selectAllContacts,
  selectContactsStatus,
  selectContactsError 
} from '../../redux/slices/contactSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import './ContactList.css';
const ContactList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // States
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);

  // Selectors
  const contacts = useSelector(selectAllContacts);
  const status = useSelector(selectContactsStatus);
  const error = useSelector(selectContactsError);
  const darkMode = useSelector(selectDarkMode);

  // Fetch contacts
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchContacts());
    }
  }, [status, dispatch]);

  // Filter contacts
  useEffect(() => {
    if (Array.isArray(contacts)) {
      const filtered = contacts.filter(contact => {
        const searchString = searchTerm.toLowerCase();
        return (
          contact.name?.toLowerCase().includes(searchString) ||
          contact.email?.toLowerCase().includes(searchString) ||
          contact.subject?.toLowerCase().includes(searchString)
        );
      });
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts([]);
    }
  }, [contacts, searchTerm]);

  // Handlers
  const handleShowDetails = async (contact) => {
    setSelectedContact(contact);
    setShowDetailsModal(true);
    
    if (!contact.is_read) {
      try {
        await dispatch(markAsRead(contact.id)).unwrap();
      } catch (error) {
        console.error('Failed to mark message as read:', error);
        // Optionally show error toast/alert here
      }
    }
  };

  const handleDelete = (contact, e) => {
    e.stopPropagation();
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedContact) {
      dispatch(deleteContact(selectedContact.id));
      setShowDeleteModal(false);
      setSelectedContact(null);
    }
  };

  const handleMarkAsRead = async (contact, e) => {
    e.stopPropagation(); // Prevent row click event
    
    if (!contact.is_read) {
      try {
        await dispatch(markAsRead(contact.id)).unwrap();
      } catch (error) {
        console.error('Failed to mark message as read:', error);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('app.title')} - Contact Messages</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="contacts-list-page"
      >
        <div className="page-header">
          <div>
            <h1>{t('admin.contacts')}</h1>
            <p>
              {t('admin.totalMessages', { count: contacts?.length || 0 })}
            </p>
          </div>
        </div>
        
        <Card className={`list-card ${darkMode ? 'dark-mode' : ''}`}>
          <Card.Header>
            <Row className="align-items-center">
              <Col md={6}>
                <h5 className="mb-0">All Messages</h5>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Search messages..."
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
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : status === 'failed' ? (
              <div className="text-center py-5">
                <p className="text-danger">{error}</p>
              </div>
            ) : filteredContacts.length > 0 ? (
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
                      <tr 
                        key={contact.id}
                        onClick={() => handleShowDetails(contact)}
                        className={`${!contact.is_read ? 'table-warning' : ''} cursor-pointer`}
                      >
                        <td>{contact.id}</td>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.subject}</td>
                        <td>{new Date(contact.created_at).toLocaleDateString()}</td>
                        <td>
                          <Badge 
                            bg={contact.is_read ? 'success' : 'warning'}
                            onClick={(e) => handleMarkAsRead(contact, e)}
                            style={{ cursor: 'pointer' }}
                            title={contact.is_read ? 'Already read' : 'Mark as read'}
                          >
                            {contact.is_read ? (
                              <><FaEnvelopeOpen className="me-1" /> Read</>
                            ) : (
                              <><FaEnvelope className="me-1" /> New</>
                            )}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={(e) => handleDelete(contact, e)}
                            className="action-btn"
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-5">
                <p>No messages found. {searchTerm && 'Try a different search term.'}</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Message Details Modal */}
        <Modal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          size="lg"
          centered
          className={darkMode ? 'dark-mode' : ''}
        >
          <Modal.Header closeButton>
            <Modal.Title>Message Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedContact && (
              <div className="message-details">
                <div className="detail-group">
                  <label>From:</label>
                  <p>{selectedContact.name} ({selectedContact.email})</p>
                </div>
                <div className="detail-group">
                  <label>Subject:</label>
                  <p>{selectedContact.subject}</p>
                </div>
                <div className="detail-group">
                  <label>Message:</label>
                  <p className="message-content">{selectedContact.message}</p>
                </div>
                <div className="detail-group">
                  <label>Received:</label>
                  <p>{new Date(selectedContact.created_at).toLocaleString()}</p>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>

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
              Are you sure you want to delete this message from{' '}
              <strong>{selectedContact?.name}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </>
  );
};

export default ContactList;