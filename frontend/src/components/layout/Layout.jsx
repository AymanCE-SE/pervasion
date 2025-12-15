import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';
import { useAppSettings } from '../../hooks/useAppSettings';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

const Layout = () => {
  const { darkMode, isRTL } = useAppSettings();

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={isRTL}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
