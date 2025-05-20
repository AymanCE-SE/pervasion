import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiTrash, FiMessageCircle } from 'react-icons/fi';
import { 
  fetchCommentsByProjectId, 
  addComment, 
  deleteComment,
  selectAllComments,
  selectCommentsStatus,
  selectCommentsError
} from '../../redux/slices/commentsSlice';
import { 
  selectIsAuthenticated, 
  selectUser,
  selectUserRole
} from '../../redux/slices/authSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import './ProjectComments.css';

const ProjectComments = ({ projectId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  // Ensure comments is always an array
  const comments = useSelector(selectAllComments) || [];
  const commentsStatus = useSelector(selectCommentsStatus);
  const commentsError = useSelector(selectCommentsError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  const darkMode = useSelector(selectDarkMode);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchCommentsByProjectId(projectId));
    }
  }, [dispatch, projectId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      setError(t('validation.required'));
      return;
    }

    if (!isAuthenticated) {
      setError(t('comments.loginRequired'));
      return;
    }

    console.log('Current User:', currentUser); // Debug log
    
    if (!currentUser || !currentUser.id) {
      console.error('No current user or user ID found');
      setError('User not properly authenticated');
      return;
    }

    const commentData = {
      projectId,  // This will be mapped to 'project' in the thunk
      content: commentText.trim()
    };

    console.log('Preparing comment data:', commentData); // Debug log

    try {
      console.log('Dispatching addComment with data:', commentData);
      const result = await dispatch(addComment(commentData));
      
      // Check if the action was successful
      if (addComment.fulfilled.match(result)) {
        console.log('Comment added successfully:', result.payload);
        setCommentText('');
        setError('');
        // Refresh comments after successful submission
        dispatch(fetchCommentsByProjectId(projectId));
      } else if (addComment.rejected.match(result)) {
        // Handle rejected action
        console.error('Error adding comment:', result);
        const error = result.payload || result.error;
        let errorMessage = t('comments.addError');
        
        if (error) {
          if (typeof error === 'string') {
            errorMessage = error;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.response?.data) {
            // Handle different error response formats
            const errorData = error.response.data;
            if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (errorData.errors) {
              errorMessage = Object.entries(errorData.errors)
                .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                .join('; ');
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            } else {
              errorMessage = JSON.stringify(errorData);
            }
          }
        }
        
        console.error('Error details:', error);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(t('comments.addError'));
    }
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={`project-comments ${darkMode ? 'dark-mode' : ''}`}>
      <h3 className="comments-title">
        <FiMessageCircle className="me-2" />
        {t('comments.title')}
      </h3>
      
      {isAuthenticated ? (
        <Form onSubmit={handleCommentSubmit} className="comment-form">
          <Form.Group controlId="commentText">
            <Form.Control
              as="textarea"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t('comments.placeholder')}
              isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>
          <Button 
            variant="primary" 
            type="submit" 
            className="comment-submit-btn mt-2"
            disabled={commentsStatus === 'loading'}
          >
            {commentsStatus === 'loading' ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {t('common.loading')}
              </>
            ) : (
              <>
                <FiSend className="me-2" />
                {t('comments.submit')}
              </>
            )}
          </Button>
        </Form>
      ) : (
        <Alert variant="info" className="login-prompt">
          <p>{t('comments.loginPrompt')}</p>
          <Button 
            variant="outline-primary" 
            href="/login" 
            size="sm"
          >
            {t('auth.login')}
          </Button>
        </Alert>
      )}

      {commentsError && (
        <Alert variant="danger" className="mt-3">
          {typeof commentsError === 'object' ? commentsError.message || 'An error occurred' : commentsError}
        </Alert>
      )}

      <motion.div 
        className="comments-list mt-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {comments.length === 0 ? (
          <p className="no-comments">{t('comments.noComments')}</p>
        ) : (
          <AnimatePresence>
            {comments.map(comment => (
              <motion.div 
                key={comment.id}
                variants={itemVariants}
                exit="exit"
                layout
              >
                <Card className="comment-card mb-3">
                  <Card.Body>
                    <div className="comment-header">
                      <div>
                        <h5 className="comment-author">
                          {comment.user_details?.name || 
                           comment.user_details?.username || 
                           'Anonymous User'}
                        </h5>
                        <small className="comment-date">{formatDate(comment.created_at)}</small>
                      </div>
                      {(isAuthenticated && (currentUser.id === comment.user_details?.id || userRole === 'admin')) && (
                        <Button 
                          variant="link" 
                          className="delete-comment-btn"
                          onClick={() => handleDeleteComment(comment.id)}
                          aria-label={t('comments.delete')}
                        >
                          <FiTrash />
                        </Button>
                      )}
                    </div>
                    <p className="comment-content">{comment.content}</p>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectComments;
