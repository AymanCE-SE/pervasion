import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { selectDarkMode } from './redux/slices/themeSlice';
import { selectLanguage } from './redux/slices/languageSlice';
import { selectIsAuthenticated } from './redux/slices/authSlice';

// Layout Components
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import HomePage from './components/home/HomePage';
import ProjectsPage from './components/projects/ProjectsPage';
import ProjectDetails from './components/projects/ProjectDetails';
import AboutPage from './components/about/AboutPage';
import ContactPage from './components/contact/ContactPage';

// Admin Pages
import LoginPage from './components/admin/LoginPage';
import LogoutPage from './components/admin/LogoutPage';
import Dashboard from './components/admin/Dashboard';
import ProjectsList from './components/admin/ProjectsList';
import ProjectForm from './components/admin/ProjectForm';
import UsersList from './components/admin/UsersList';
import UserForm from './components/admin/UserForm';

// i18n
import './i18n';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/admin/login" />;
    }
    return children;
  };

  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/logout" element={<LogoutPage />} />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            
            {/* Project Management Routes */}
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/edit/:id" element={<ProjectForm />} />
            
            {/* User Management Routes */}
            <Route path="users" element={<UsersList />} />
            <Route path="users/new" element={<UserForm />} />
            <Route path="users/edit/:id" element={<UserForm />} />
          </Route>
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default App;
