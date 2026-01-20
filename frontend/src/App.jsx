import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectUserRole, selectUser } from './redux/slices/authSlice';
import { ErrorBoundary, DefaultErrorFallback } from './components/common/ErrorBoundary';
import GlobalErrorHandler from './components/common/GlobalErrorHandler';
import ErrorToast from './components/common/ErrorToast';
import LoadingSpinner from './components/common/LoadingSpinner';
import { setDarkMode } from './redux/slices/themeSlice';
import { setLanguage } from './redux/slices/languageSlice';

// Layout Components
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';

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
const RegisterPage = React.lazy(() => import('./components/auth/RegisterPage'));
const JobApplicantPage = React.lazy(() => import('./components/jobApplicant/JobApplicantPage'));
// const AdminLoginPage = React.lazy(() => import('./components/admin/LoginPage'));
// const LogoutPage = React.lazy(() => import('./components/admin/LogoutPage'));
const Dashboard = React.lazy(() => import('./components/admin/Dashboard'));
const ProjectsList = React.lazy(() => import('./components/admin/ProjectsList'));
const ProjectForm = React.lazy(() => import('./components/admin/ProjectForm'));
const UsersList = React.lazy(() => import('./components/admin/UsersList'));
const UserForm = React.lazy(() => import('./components/admin/UserForm'));
const ContactList = React.lazy(() => import('./components/admin/ContactList'));
const VerifyEmail = React.lazy(() => import('./components/auth/VerifyEmail'));
const JobApplicationsList = React.lazy(() => import('./components/admin/JobApplicantList'));
const ProfilePage = React.lazy(() => import('./components/profile/ProfilePage'));

import NotFound from './components/common/NotFound';
import CategoriesList from './components/admin/CategoriesList';

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  
  // Initialize app settings
  useEffect(() => {
    // Set initial theme (respect Vite env defaults and optional force flag)
    const envDefaultTheme = (import.meta && import.meta.env && import.meta.env.VITE_DEFAULT_THEME)
      ? String(import.meta.env.VITE_DEFAULT_THEME).toLowerCase()
      : null;
    const forceTheme = (import.meta && import.meta.env && String(import.meta.env.VITE_FORCE_DEFAULT_THEME).toLowerCase() === 'true');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && !forceTheme) {
      dispatch(setDarkMode(savedTheme === 'dark'));
    } else if (envDefaultTheme) {
      dispatch(setDarkMode(envDefaultTheme === 'dark'));
      if (forceTheme) {
        localStorage.setItem('theme', envDefaultTheme);
      }
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setDarkMode(prefersDark));
    }

    // Set initial language (respect Vite env defaults and optional force flag)
    const envDefaultLang = (import.meta && import.meta.env && import.meta.env.VITE_DEFAULT_LANGUAGE) || null;
    const forceLang = (import.meta && import.meta.env && String(import.meta.env.VITE_FORCE_DEFAULT_LANGUAGE).toLowerCase() === 'true');

    const savedLang = localStorage.getItem('language') || localStorage.getItem('i18nextLng');
    if (savedLang && !forceLang) {
      dispatch(setLanguage(savedLang));
    } else if (envDefaultLang) {
      dispatch(setLanguage(envDefaultLang));
      if (forceLang) {
        localStorage.setItem('language', envDefaultLang);
        localStorage.setItem('i18nextLng', envDefaultLang);
      }
    } else {
      const browserLang = navigator.language.split('-')[0];
      const defaultLang = ['en', 'ar'].includes(browserLang) ? browserLang : 'en';
      dispatch(setLanguage(defaultLang));
    }
  }, [dispatch]);
  
  // Protected route component for admin
  const AdminProtectedRoute = ({ children }) => {
    const location = useLocation();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userRole = useSelector(selectUserRole);
    const user = useSelector(selectUser);

    if (!isAuthenticated) {
      // Change the redirect to /login instead of /admin/login
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    if (userRole !== 'admin' && !user?.is_staff && !user?.is_superuser) {
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
                  <Route path="profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/join-us" element={<JobApplicantPage />} />
                </Route>

                {/* Auth Routes */}
                <Route path="/login" element={<UserLoginPage />} />
                <Route path="/signup" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout />
                    </AdminProtectedRoute>
                  }
                >
                  <Route 
                    index 
                    element={
                      <AdminProtectedRoute>
                        <Navigate to="/admin/dashboard" replace />
                      </AdminProtectedRoute>
                    } 
                  />
                  <Route 
                    path="dashboard" 
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
                    path="projects/edit/:id"
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
                    path="users/edit/:id"
                    element={
                      <AdminProtectedRoute>
                        <UserForm />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="contacts"
                    element={
                      <AdminProtectedRoute>
                        <ContactList />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="categories"
                    element={
                      <AdminProtectedRoute>
                        <CategoriesList />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                      path="job-applications"
                      element={
                        <AdminProtectedRoute>
                          <JobApplicationsList />
                        </AdminProtectedRoute>
                      }
                    />
                  {/* <Route path="logout" element={<LogoutPage />} /> */}
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
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
