import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { selectLanguage } from '../../redux/slices/languageSlice';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

const Layout = () => {
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);

  // Apply theme and language classes to the body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    document.documentElement.lang = language;
  }, [darkMode, language]);

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
