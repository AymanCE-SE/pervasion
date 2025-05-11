import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { withErrorBoundary } from '../common/ErrorBoundary';

const ErrorTest = () => {
  const [shouldError, setShouldError] = useState(false);

  // This will throw an error when the button is clicked
  const triggerError = () => {
    setShouldError(true);
  };

  if (shouldError) {
    // This will be caught by the error boundary
    throw new Error('This is a test error thrown by the ErrorTest component');
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Alert variant="info" className="shadow">
            <h4 className="alert-heading">Error Boundary Test</h4>
            <p>
              This is a test component to verify that the ErrorBoundary is working correctly.
              Click the button below to trigger an error.
            </p>
            <hr />
            <div className="d-flex justify-content-center">
              <Button 
                variant="danger" 
                onClick={triggerError}
                className="d-flex align-items-center"
              >
                <i className="bi bi-bug me-2"></i>
                Trigger Test Error
              </Button>
            </div>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(ErrorTest);
