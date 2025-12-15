import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import './CategoriesList.css';
import { Table, Button, Modal, Form, Alert, Card, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  selectAllCategories,
  selectCategoriesStatus,
  selectCategoriesError
} from '../../redux/slices/projectsSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { toast } from 'react-toastify';

const CategoriesList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);

  const categories = useSelector(selectAllCategories) || [];
  const status = useSelector(selectCategoriesStatus);
  const error = useSelector(selectCategoriesError);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // category being edited
  const [form, setForm] = useState({ name: '', name_ar: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (status === 'idle' || !Array.isArray(categories) || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, status, categories.length]);

  useEffect(() => {
    if (Array.isArray(categories)) {
      const q = String(searchTerm || '').toLowerCase();
      setFilteredCategories(categories.filter(c => (c.name || '').toLowerCase().includes(q) || (c.name_ar || '').toLowerCase().includes(q)));
    } else {
      setFilteredCategories([]);
    }
  }, [categories, searchTerm]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', name_ar: '' });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name || '', name_ar: cat.name_ar || '' });
    setShowModal(true);
  };

  const submit = async (e) => {
    e?.preventDefault();
    try {
      if (editing) {
        await dispatch(updateCategory({ id: editing.id, ...form })).unwrap();
        toast.success(t('admin.notifications.categoryUpdateSuccess'));
      } else {
        await dispatch(createCategory(form)).unwrap();
        toast.success(t('admin.notifications.categoryCreateSuccess'));
      }
      setShowModal(false);
    } catch (error) {
      toast.error(t(`admin.notifications.${editing ? 'updateError' : 'createError'}`));
    }
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteCategory(confirmDeleteId)).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      setShowDeleteModal(false);
      setConfirmDeleteId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('app.title')} - {t('admin.categories')}</title>
      </Helmet>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`admin-categories ${darkMode ? 'dark-mode' : ''}`}>
      <div className="page-header mb-3">
        <div>
          <h2 className="categories-title">{t('admin.categories')}</h2>
          <p className="text-muted">{t('admin.manageCategories')}</p>
        </div>
      </div>

      <Card className={`list-card list-card-categories ${darkMode ? 'dark-mode' : ''}`}>
        <Card.Header>
          <Row className="align-items-center">
            <Col md={6}>
              <h5 className="mb-0">{t('admin.categoriesList.allCategories') || t('admin.categories')}</h5>
            </Col>
            <Col md={6}>
              <div className="d-flex justify-content-end gap-2">
                <Form.Control
                  type="text"
                  placeholder={t('admin.categoriesList.searchPlaceholder') || t('admin.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  style={{ maxWidth: 300 }}
                />
                <Button onClick={openCreate} variant="primary" className="add-btn d-flex align-items-center gap-2">
                  <FaPlus aria-hidden="true" /> <span>{t('admin.addNew')}</span>
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Header>

        {error && <Alert variant="danger">{typeof error === 'string' ? error : JSON.stringify(error)}</Alert>}

        <Card.Body>
          {status === 'loading' ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status"><span className="visually-hidden">{t('common.loading')}</span></div>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="categories-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{t('admin.categoryName')}</th>
                    <th>{t('admin.categoryNameAr')}</th>
                    <th>{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {(filteredCategories || []).map(cat => (
                    <tr key={cat.id} onClick={() => openEdit(cat)} className="cursor-pointer">
                      <td>{cat.id}</td>
                      <td>{cat.name}</td>
                      <td>{cat.name_ar}</td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="outline-primary"
                            className="action-btn text-primary"
                            onClick={(e) => { e.stopPropagation(); openEdit(cat); }}
                            title={t('admin.edit')}
                            aria-label={t('admin.edit')}
                          >
                            <FaEdit aria-hidden="true" />
                          </Button>
                          <Button
                            variant="outline-danger"
                            className="action-btn text-danger"
                            onClick={(e) => { e.stopPropagation(); confirmDelete(cat.id); }}
                            title={t('admin.delete')}
                            aria-label={t('admin.delete')}
                          >
                            <FaTrash aria-hidden="true" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {(!filteredCategories || filteredCategories.length === 0) && (
                <div className="text-center py-4">
                  <p className="mb-0">{t('admin.categoriesList.noCategories') || t('admin.noItems')}</p>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

        {/* Create / Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered className={darkMode ? 'dark-mode' : ''}>
          <Form onSubmit={submit}>
            <Modal.Header closeButton>
              <Modal.Title>
                {editing ? t('admin.editCategory') : t('admin.addNew')}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>{t('admin.categoryName')}</Form.Label>
                <Form.Control
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder={t('admin.categoryNamePlaceholder')}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t('admin.categoryNameAr')}</Form.Label>
                <Form.Control
                  value={form.name_ar}
                  onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                  required
                  placeholder={t('admin.categoryNameArPlaceholder')}
                  className="arabic-input"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button 
                variant="secondary" 
                onClick={() => setShowModal(false)}
                className="px-4"
              >
                {t('admin.cancel')}
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                className="save-btn"
              >
                {status === 'loading' ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    {editing ? t('admin.update') : t('admin.create')}
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Delete Confirmation */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className={darkMode ? 'dark-mode' : ''}>
          <Modal.Header closeButton>
            <Modal.Title>{t('admin.confirmDelete')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {t('admin.deleteCategoryWarning')}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>{t('admin.cancel')}</Button>
            <Button variant="danger" onClick={handleDelete}>{t('admin.delete')}</Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </>
  );
};

export default CategoriesList;