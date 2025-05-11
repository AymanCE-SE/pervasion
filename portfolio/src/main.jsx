import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { store, persistor } from './redux/store';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import GlobalErrorHandler from './components/common/GlobalErrorHandler';

// Function to render the app
const renderApp = () => {
  const root = createRoot(document.getElementById('root'));
  
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <GlobalErrorHandler>
                <App />
              </GlobalErrorHandler>
            </BrowserRouter>
          </I18nextProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
};

// Initial render
renderApp().catch(console.error);

// Enable hot module replacement
if (import.meta.hot) {
  import.meta.hot.accept('./App', () => {
    renderApp().catch(console.error);
  });
}
