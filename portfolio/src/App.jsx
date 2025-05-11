import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { selectDarkMode } from './redux/slices/themeSlice';
import { selectLanguage } from './redux/slices/languageSlice';
import { selectIsAuthenticated, selectUserRole } from './redux/slices/authSlice';

// Layout Components
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import HomePage from './components/home/HomePage';
import ProjectsPage from './components/projects/ProjectsPage';
import ProjectDetails from './components/projects/ProjectDetails';
import AboutPage from './components/about/AboutPage';
import ContactPage from './components/contact/ContactPage';

// Auth Pages
import UserLoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';

// Admin Pages
import AdminLoginPage from './components/admin/LoginPage';
import LogoutPage from './components/admin/LogoutPage';
import Dashboard from './components/admin/Dashboard';
import ProjectsList from './components/admin/ProjectsList';
import ProjectForm from './components/admin/ProjectForm';
import UsersList from './components/admin/UsersList';
import UserForm from './components/admin/UserForm';

// User Dashboard
// import UserDashboard from './components/user/UserDashboard';

// i18n
import './i18n';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  
  // Protected route component for admin
  const AdminProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userRole = useSelector(selectUserRole);
    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/admin/login');
      } else if (userRole !== 'admin') {
        navigate('/dashboard');
      }
    }, [isAuthenticated, userRole, navigate]);

    if (!isAuthenticated || userRole !== 'admin') {
      return null;
    }

    return children;
  };
  
  // Protected route component for users
  const UserProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
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
            
            {/* User Auth Routes */}
            <Route path="login" element={<UserLoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <UserProtectedRoute>
                {userRole === 'admin' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Layout>
                    {/* User Dashboard Component */}
                    {/* <UserDashboard /> */}
                  </Layout>
                )}
              </UserProtectedRoute>
            } />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/logout" element={<LogoutPage />} />
          
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/edit/:id" element={<ProjectForm />} />
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
