import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, selectDarkMode } from "../../redux/slices/themeSlice";
import { toggleLanguage, selectLanguage } from "../../redux/slices/languageSlice";
import { logout, selectIsAuthenticated, selectUser } from "../../redux/slices/authSlice";
import { FiSun, FiMoon, FiGlobe, FiUser, FiLogIn, FiMenu, FiX } from "react-icons/fi";
import "./Header.css";

const Header = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  // Redux state
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Set document direction and i18n language
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    i18n.changeLanguage(language);
  }, [language, i18n]);

  // Set dark mode class on body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Handlers using Redux
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };
  const handleLanguageToggle = () => {
    dispatch(toggleLanguage());
  };
  const handleLogout = () => {
    dispatch(logout());
  };

  // Animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 * custom, duration: 0.3 }
    })
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } }
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, x: language === "ar" ? "100%" : "-100%" },
    open: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  // Navigation links
  const navLinks = [
    { path: "/", label: t("nav.home") },
    { path: "/projects", label: t("nav.services") },
    // { path: "/portfolio", label: t("nav.portfolio") },
    { path: "/about", label: t("nav.about") },
    { path: "/contact", label: t("nav.contact") }
  ];

  return (
    <header className={`header ${scrolled ? "scrolled" : ""} ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="header-container">
        {/* Logo */}
        <motion.div 
          className="logo"
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Link to="/">
            <div className="logo-content">
              <div className="logo-text">
                <img src="/logo-dark.png" alt="Logo" className="logo-image" width={140} />
              </div>
              <div className="logo-shine"></div>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            {navLinks.map((link, index) => (
              <motion.li 
                key={link.path} 
                custom={index + 1}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link 
                  to={link.path} 
                  className={location.pathname === link.path ? "active" : ""}
                >
                  {link.label}
                  <span className="link-highlight"></span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Controls */}
        <div className="header-controls">
          {/* Theme Toggle */}
          <motion.button 
            className="icon-button theme-toggle"
            onClick={handleThemeToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={darkMode ? t("theme.switchToLight") : t("theme.switchToDark")}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={darkMode ? "moon" : "sun"}
                initial={{ opacity: 0, rotate: -30 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 30 }}
                transition={{ duration: 0.8 }}
              >
                {darkMode ? <FiSun className="text-light"/> : <FiMoon className="text-light"/>}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <motion.button 
            className="icon-button lang-toggle"
            onClick={handleLanguageToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={language === "en" ? t("language.switchToAr") : t("language.switchToEn")}
          >
            <span className="lang-indicator" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiGlobe className="text-light" style={{ fontSize: "1.5rem" }} />
              {language === "en" ? "ع" : "EN"}
            </span>
          </motion.button>
          {isAuthenticated ? (
            <motion.div
              className="user-menu"
              whileHover={{ scale: 1.05 }}
            >
              <button className="user-button">
                <FiUser className="text-light" />
                <span className="user-name text-light fw-bolder">{user?.name || t("auth.account")}</span>
              </button>
              <div className="user-dropdown">
                <Link to={user?.role === 'admin' ? "/admin" : "/dashboard"}>
                  {t("nav.dashboard")}
                </Link>
                <Link to="/profile">{t("nav.profile")}</Link>
                <button onClick={handleLogout}>{t("auth.logout")}</button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="auth-buttons"
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/login" className="login-button">
                <FiLogIn />
                <span>{t("auth.login")}</span>
              </Link>
            </motion.div>
          )}

          {/* Mobile Menu Toggle */}
          <motion.button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={menuOpen ? "close" : "menu"}
                initial={{ opacity: 0, rotate: -30 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 30 }}
                transition={{ duration: 0.2 }}
              >
                {menuOpen ? <FiX /> : <FiMenu />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="mobile-nav"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <ul className="mobile-nav-links">
                {navLinks.map((link, index) => (
                  <motion.li 
                    key={link.path}
                    initial={{ opacity: 0, x: language === "ar" ? 20 : -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: 0.1 * index, duration: 0.3 }
                    }}
                  >
                    <Link 
                      to={link.path} 
                      className={location.pathname === link.path ? "active" : ""}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              
              <motion.div 
                className="mobile-controls"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.4 } }}
              >
                <button 
                  className="mobile-theme-toggle"
                  onClick={handleThemeToggle}
                >
                  {darkMode ? <FiSun /> : <FiMoon />}
                  <span>{darkMode ? t("theme.switchToLight") : t("theme.switchToDark")}</span>
                </button>
                
                <button 
                  className="mobile-lang-toggle"
                  onClick={handleLanguageToggle}
                >
                  <FiGlobe />
                  <span>{language === "en" ? t("language.switchToAr") : t("language.switchToEn")}</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;