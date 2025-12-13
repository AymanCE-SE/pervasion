import React, { useEffect, useState } from 'react';
import './CategoriesList.css';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
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
    <div className={`admin-categories ${darkMode ? 'dark-mode' : ''}`}>  
      <div className="categories-card">
        <div className="page-header d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="categories-title">{t('admin.categories')}</h2>
            <p className="text-muted">{t('admin.manageCategories')}</p>
          </div>
          <div>
            <Button onClick={openCreate} variant="primary" className="d-flex align-items-center gap-2">
              <FaPlus /> {t('admin.addNew')}
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger">{typeof error === 'string' ? error : JSON.stringify(error)}</Alert>}

        <div className="table-responsive">
          <Table className="categories-table" hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>{t('admin.categoryName')}</th>
                <th>{t('admin.categoryNameAr')}</th>
                <th>{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.name}</td>
                  <td>{cat.name_ar}</td>
                  <td>
                    <div className="action-buttons">
                      <Button 
                        size="sm" 
                        variant="outline-secondary" 
                        className="d-flex align-items-center gap-1" 
                        onClick={() => openEdit(cat)}
                      >
                        <FaEdit size={14} /> {t('admin.edit')}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-danger" 
                        className="d-flex align-items-center gap-1" 
                        onClick={() => confirmDelete(cat.id)}
                      >
                        <FaTrash size={14} /> {t('admin.delete')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Create / Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
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
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
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
      </div>
    </div>
  );
};

export default CategoriesList;