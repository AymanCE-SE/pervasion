import React, { useState, useCallback, memo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuthenticated, selectUser } from "../../redux/slices/authSlice";
import { FiSun, FiMoon, FiGlobe, FiUser, FiLogIn, FiMenu, FiX, FiLogOut } from "react-icons/fi";

// Ensure icons have display: inline-block by default
import { useAppSettings } from "../../hooks/useAppSettings";
import "./Header.css";
import logo from "../../assets/jumooh-yellow@10x.png";

// Memoized navigation links to prevent unnecessary re-renders
const NavLinks = memo(({ isAuthenticated, closeMenu, isMobile = false, user }) => {
  const { t } = useTranslation();
  const location = useLocation();
  
  // Animation variants for nav items
  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }
    })
  };

  // Navigation items - Test Error link only shows in development mode
  const navItems = [
    { path: "/", label: t('nav.home') },
    { path: "/projects", label: t('nav.projects') },
    { path: "/about", label: t('nav.about') },
    { path: "/contact", label: t('nav.contact') },
  ];
  
  // Add dashboard link for admin users
  if (isAuthenticated && (user?.role === 'admin' || user?.is_staff || user?.is_superuser)) {
    navItems.push({ 
      path: "/admin/dashboard", 
      label: t('nav.dashboard'),
      className: 'dashboard-link'
    });
  }

  return (
    <ul className={`nav-links ${isMobile    
      ? (isAuthenticated && (user?.role === 'admin' || user?.is_staff || user?.is_superuser)
          ? 'mobile-nav-column'
          : 'mobile-nav-row')
      : 'desktop-nav'}`}>
      {navItems.map((item, index) => (
        <motion.li 
          key={item.path}
          custom={index}
          variants={!isMobile ? navItemVariants : undefined}
          initial={!isMobile ? "hidden" : undefined}
          animate={!isMobile ? "visible" : undefined}
        >
          <Link 
            to={item.path} 
            onClick={closeMenu}
            className={`nav-link ${item.className || ''} ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        </motion.li>
      ))}
    </ul>
  );
});

NavLinks.displayName = 'NavLinks';

// Action buttons component
const ActionButtons = memo(({ 
  darkMode, 
  currentLang, 
  isAuthenticated, 
  onToggleTheme, 
  onToggleLanguage, 
  onLogout,
  closeMenu 
}) => {
  const { t } = useTranslation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user = useSelector(selectUser);

  // Add a local close handler
  const handleClose = useCallback(() => {
    setShowUserMenu(false);
    closeMenu?.(); // Optional chaining in case closeMenu is not provided
  }, [closeMenu]);

  return (
    <div className="header-actions">
      <button 
        className="theme-toggle" 
        onClick={onToggleTheme}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <FiSun className={`theme-icon ${darkMode ? 'active' : ''}`} style={{ display: 'inline-block' }} />
        <FiMoon className={`theme-icon ${!darkMode ? 'active' : ''}`} style={{ display: 'inline-block' }} />
      </button>
      
      <button 
        className="language-toggle"
        onClick={onToggleLanguage}
        aria-label={`Switch to ${currentLang === 'en' ? 'Arabic' : 'English'}`}
      >
        <FiGlobe style={{ display: 'inline-block' }} />
        <span>{currentLang === 'en' ? 'عربي' : 'EN'}</span>
      </button>

      {isAuthenticated ? (
        <div className="user-menu">
          <button 
            className="user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-expanded={showUserMenu}
            aria-label="User menu"
          >
            <FiUser style={{ display: 'inline-block' }} />
            <span className="user-name">
              {user?.name?.split(' ')[0] || t('nav.profile')}
            </span>
          </button>
          
          <AnimatePresence>
            {showUserMenu && (
              <motion.div 
                className="user-dropdown"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/profile" className="dropdown-item" onClick={handleClose}>
                  <FiUser /> {t('nav.profile')}
                </Link>
                <button 
                  className="dropdown-item logout" 
                  onClick={() => {
                    onLogout();
                    handleClose();
                  }}
                >
                  <FiLogOut /> {t('nav.logout')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <Link to="/login" className="login-button" onClick={closeMenu}>
          <FiLogIn style={{ display: 'inline-block' }} />
          <span>{t('nav.login')}</span>
        </Link>
      )}
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';

// Add these components before the Header component

const MobileActions = memo(({ 
  darkMode, 
  currentLang, 
  toggleTheme, 
  handleLanguageChange, 
  closeMenu 
}) => {
  const { t } = useTranslation();

  return (
    <div className="mobile-actions">
      <button 
        className="mobile-action-btn"
        onClick={() => {
          toggleTheme();
          closeMenu();
        }}
      >
        {darkMode ? (
          <>
            <FiSun className="action-icon" />
            <span>{t('theme.light')}</span>
          </>
        ) : (
          <>
            <FiMoon className="action-icon" />
            <span>{t('theme.dark')}</span>
          </>
        )}
      </button>

      <button 
        className="mobile-action-btn"
        onClick={() => {
          handleLanguageChange();
          closeMenu();
        }}
      >
        <FiGlobe className="action-icon" />
        <span>{currentLang === 'en' ? 'عربي' : 'EN'}</span>
      </button>
    </div>
  );
});

const MobileUserMenu = memo(({ 
  isAuthenticated, 
  user, 
  onLogout, 
  closeMenu 
}) => {
  const { t } = useTranslation();

  if (!isAuthenticated) {
    return (
      <Link 
        to="/login" 
        className="mobile-action-btn login-btn"
        onClick={closeMenu}
      >
        <FiLogIn className="action-icon" />
        <span>{t('nav.login')}</span>
      </Link>
    );
  }

  return (
    <div className="mobile-user-menu">
      <Link 
        to="/profile" 
        className="mobile-action-btn"
        onClick={closeMenu}
      >
        <FiUser className="action-icon" />
        <span>{user?.name?.split(' ')[0] || t('nav.profile')}</span>
      </Link>
      
      <button 
        className="mobile-action-btn logout-btn"
        onClick={() => {
          onLogout();
          closeMenu();
        }}
      >
        <FiLogOut className="action-icon" />
        <span>{t('nav.logout')}</span>
      </button>
    </div>
  );
});

// Add display names
MobileActions.displayName = 'MobileActions';
MobileUserMenu.displayName = 'MobileUserMenu';

const Header = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use our custom hook for theme and language
  const { darkMode, isRTL, toggleTheme, toggleLanguage } = useAppSettings();
  
  // Redux state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  // Local state management
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);
  
  // Update current language when i18n language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLang(i18n.language);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  
  // Handle language change
  const handleLanguageChange = useCallback(() => {
    toggleLanguage();
    // Force re-render of the current route
    navigate(location.pathname, { replace: true });
  }, [toggleLanguage, navigate, location.pathname, i18n]);

  // Close menu function - remove setShowUserMenu reference
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/');
    closeMenu();
  }, [dispatch, navigate, closeMenu]);

  // Toggle menu function
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Memoize the scroll handler
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Animation variants
  // const logoVariants = {
  //   hidden: { opacity: 0, x: -20 },
  //   visible: { 
  //     opacity: 1, 
  //     x: 0,
  //     transition: { 
  //       duration: 0.8,
  //       ease: [0.25, 0.1, 0.25, 1]
  //     }
  //   },
  //   hover: { 
  //     scale: 1.05,
  //     transition: { duration: 0.3 }
  //   }
  // };

  // const mobileMenuVariants = {
  //   closed: { opacity: 0, x: isRTL ? "100%" : "-100%" },
  //   open: { 
  //     opacity: 1, 
  //     x: 0, 
  //     transition: { 
  //       duration: 0.4,
  //       ease: [0.25, 0.1, 0.25, 1]
  //     } 
  //   }
  // };

  return (
    <header 
      className={`header ${darkMode ? 'dark-mode' : ''} ${scrolled ? 'scrolled' : ''} ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="header-container">
        {/* Logo - Left Side */}
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <div className="logo-content">
              <img src={logo} alt="Logo" className="logo-image" />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation - Middle */}
        <nav className="desktop-nav">
          <NavLinks 
            isAuthenticated={isAuthenticated} 
            closeMenu={closeMenu}
            user={user}
          />
        </nav>

        {/* Action Buttons - Right Side */}
        <div className="desktop-actions">
          <ActionButtons
            darkMode={darkMode}
            currentLang={currentLang}
            isAuthenticated={isAuthenticated}
            onToggleTheme={toggleTheme}
            onToggleLanguage={handleLanguageChange}
            onLogout={handleLogout}
            closeMenu={closeMenu} // Add this prop
          />
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Mobile Menu */}
<AnimatePresence>
  {isMenuOpen && (
    <motion.div 
      className="mobile-menu"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mobile-controls">
        <NavLinks 
          isAuthenticated={isAuthenticated} 
          closeMenu={closeMenu}
          isMobile={true}
          user={user}
        />
        <MobileActions 
          darkMode={darkMode}
          currentLang={currentLang}
          toggleTheme={toggleTheme}
          handleLanguageChange={handleLanguageChange}
          closeMenu={closeMenu}
        />
        <MobileUserMenu 
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
          closeMenu={closeMenu}
        />
      </div>
    </motion.div>
  )}
</AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
