import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from './redux/slices/authSlice';
import { ErrorBoundary, DefaultErrorFallback } from './components/common/ErrorBoundary';
import GlobalErrorHandler from './components/common/GlobalErrorHandler';
import ErrorToast from './components/common/ErrorToast';
import LoadingSpinner from './components/common/LoadingSpinner';
import { setDarkMode } from './redux/slices/themeSlice';
import { setLanguage } from './redux/slices/languageSlice';

// Layout Components
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
// Note: These are now lazy loaded below

// Auth Pages - These are now lazy loaded below

// Admin Pages - These are now lazy loaded below

// User Dashboard
// import UserDashboard from './components/user/UserDashboard';

// i18n
import './i18n';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Lazy load routes for better performance
const HomePage = React.lazy(() => import('./components/home/HomePage'));
const ProjectsPage = React.lazy(() => import('./components/projects/ProjectsPage'));
const ProjectDetails = React.lazy(() => import('./components/projects/ProjectDetails'));
const AboutPage = React.lazy(() => import('./components/about/AboutPage'));
const ContactPage = React.lazy(() => import('./components/contact/ContactPage'));
const UserLoginPage = React.lazy(() => import('./components/auth/LoginPage'));
const ErrorTest = React.lazy(() => import('./components/test/ErrorTest'));
const SignupPage = React.lazy(() => import('./components/auth/SignupPage'));
const AdminLoginPage = React.lazy(() => import('./components/admin/LoginPage'));
const LogoutPage = React.lazy(() => import('./components/admin/LogoutPage'));
const Dashboard = React.lazy(() => import('./components/admin/Dashboard'));
const ProjectsList = React.lazy(() => import('./components/admin/ProjectsList'));
const ProjectForm = React.lazy(() => import('./components/admin/ProjectForm'));
const UsersList = React.lazy(() => import('./components/admin/UsersList'));
const UserForm = React.lazy(() => import('./components/admin/UserForm'));

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  
  // Initialize app settings
  useEffect(() => {
    // Set initial theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch(setDarkMode(savedTheme === 'dark'));
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setDarkMode(prefersDark));
    }
    
    // Set initial language
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang) {
      dispatch(setLanguage(savedLang));
    } else {
      const browserLang = navigator.language.split('-')[0];
      const defaultLang = ['en', 'ar'].includes(browserLang) ? browserLang : 'en';
      dispatch(setLanguage(defaultLang));
    }
  }, [dispatch]);
  
  // Protected route component for admin
  const AdminProtectedRoute = ({ children }) => {
    const location = useLocation();
    if (!isAuthenticated) {
      return <Navigate to="/admin/login" replace state={{ from: location }} />;
    }

    if (userRole !== 'admin') {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  // Protected route component for authenticated users
  const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return children;
  };

  // Loading component for suspense fallback
  const LoadingFallback = () => (
    <div className="full-page-loader">
      <LoadingSpinner />
    </div>
  );

  return (
    <ErrorBoundary Fallback={DefaultErrorFallback}>
      <GlobalErrorHandler>
        <HelmetProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="projects/:id" element={<ProjectDetails />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="test-error" element={
                    <Suspense fallback={<LoadingSpinner fullPage />}>
                      <ErrorTest />
                    </Suspense>
                  } />
                </Route>

                {/* Auth Routes */}
                <Route path="/login" element={<UserLoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                }>
                  <Route path="login" element={<AdminLoginPage />} />
                  <Route
                    index
                    element={
                      <AdminProtectedRoute>
                        <Dashboard />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="projects"
                    element={
                      <AdminProtectedRoute>
                        <ProjectsList />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="projects/new"
                    element={
                      <AdminProtectedRoute>
                        <ProjectForm />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="projects/:id/edit"
                    element={
                      <AdminProtectedRoute>
                        <ProjectForm />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="users"
                    element={
                      <AdminProtectedRoute>
                        <UsersList />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="users/new"
                    element={
                      <AdminProtectedRoute>
                        <UserForm />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="users/:id/edit"
                    element={
                      <AdminProtectedRoute>
                        <UserForm />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route path="logout" element={<LogoutPage />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Global Error Toast */}
            <ErrorToast />
          </Suspense>
        </HelmetProvider>
      </GlobalErrorHandler>
    </ErrorBoundary>
  );
};

export default App;
