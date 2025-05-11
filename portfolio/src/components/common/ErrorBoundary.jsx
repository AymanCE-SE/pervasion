import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setError, clearError } from '../../redux/slices/errorSlice';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update local state
    this.setState({
      error,
      errorInfo,
    });

    // Dispatch error to Redux store if dispatch is available
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch(setError({
        message: error.message || 'An unexpected error occurred',
        error: error.toString(),
        errorInfo: errorInfo?.componentStack,
        isFatal: true
      }));
    }
  }

  handleReset = () => {
    const { dispatch } = this.props;
    
    // Clear error in Redux store
    if (dispatch) {
      dispatch(clearError());
    }
    
    // Reset local state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    // Optionally navigate to home or previous page
    if (this.props.navigate) {
      this.props.navigate(-1);
    }
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback: Fallback } = this.props;

    if (hasError) {
      // Render fallback UI
      if (Fallback) {
        return <Fallback error={error} errorInfo={errorInfo} onReset={this.handleReset} />;
      }
      
      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Something went wrong.</h2>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {error && error.toString()}
              <br />
              {errorInfo?.componentStack}
            </details>
            <Button variant="primary" onClick={this.handleReset}>
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return children;
  }
}

// Default fallback component that can be used with translations
const DefaultErrorFallback = ({ error, onReset }) => {
  const { t } = useTranslation();

  return (
    <div className="error-fallback p-4 text-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <Alert variant="danger" className="shadow">
              <Alert.Heading className="h4">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {t('error.somethingWentWrong', 'Something went wrong')}
              </Alert.Heading>
              <p className="mb-3">{error?.message || t('error.unknownError', 'An unknown error occurred')}</p>
              <div className="d-flex justify-content-center gap-3">
                <Button 
                  variant="outline-danger" 
                  onClick={onReset}
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  {t('common.tryAgain', 'Try Again')}
                </Button>
                <Button 
                  variant="outline-primary"
                  onClick={() => window.location.href = '/'}
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-house-door me-2"></i>
                  {t('common.goHome', 'Go Home')}
                </Button>
              </div>
            </Alert>
            
            {process.env.NODE_ENV === 'development' && error?.stack && (
              <div className="mt-4 text-start">
                <details>
                  <summary className="text-muted small">Error details</summary>
                  <pre className="bg-light p-3 small rounded">
                    {error.stack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Connect ErrorBoundary to Redux
const mapStateToProps = (state) => ({
  error: state.error,
});

// Create connected version of ErrorBoundary
const ConnectedErrorBoundary = connect(mapStateToProps)(ErrorBoundary);

// HOC for using the error boundary
const withErrorBoundary = (WrappedComponent, Fallback = DefaultErrorFallback) => {
  const WrappedWithErrorBoundary = (props) => {
    const navigate = useNavigate();
    return (
      <ConnectedErrorBoundary 
        {...props} 
        navigate={navigate}
        Fallback={Fallback}
      >
        <WrappedComponent {...props} />
      </ConnectedErrorBoundary>
    );
  };
  
  // Set display name for better debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WrappedWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  
  return WrappedWithErrorBoundary;
};

export { ConnectedErrorBoundary as ErrorBoundary, withErrorBoundary, DefaultErrorFallback };
export default ConnectedErrorBoundary;
