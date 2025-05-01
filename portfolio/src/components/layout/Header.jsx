/** @format */

import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { toggleTheme, selectDarkMode } from "../../redux/slices/themeSlice";
import {
  toggleLanguage,
  selectLanguage,
} from "../../redux/slices/languageSlice";
import { selectIsAuthenticated, logout } from "../../redux/slices/authSlice";
import { BsSun, BsMoon, BsGlobe } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { RiStackLine } from "react-icons/ri";
import "./Header.css";

const Header = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle theme toggle
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  // Handle language toggle
  const handleLanguageToggle = () => {
    dispatch(toggleLanguage());
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  // Update document direction based on language
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    i18n.changeLanguage(language);
  }, [language, i18n]);

  // Animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * custom,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        yoyo: Infinity,
      },
    },
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`header ${scrolled ? "scrolled" : ""} ${
        darkMode ? "dark-mode" : ""
      }`}>
      <Navbar
        expand="lg"
        variant={darkMode ? "dark" : "light"}
        className={`navbar ${scrolled ? "scrolled" : ""}`}
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand">
            <motion.div
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="logo-container">
              <div className="logo-wrapper">
                <RiStackLine className="logo-icon" />
                <div className="brand-text">
                  <span className="brand-name">Pervasion</span>
                  <span className="brand-slogan">Expanding Your Reach</span>
                </div>
              </div>
            </motion.div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <motion.div
                custom={1}
                variants={navItemVariants}
                initial="hidden"
                animate="visible">
                <Nav.Link
                  as={NavLink}
                  to="/"
                  onClick={() => setExpanded(false)}
                  className={({ isActive }) => (isActive ? "active" : "")}>
                  {t("nav.home")}
                </Nav.Link>
              </motion.div>

              <motion.div
                custom={2}
                variants={navItemVariants}
                initial="hidden"
                animate="visible">
                <Nav.Link
                  as={NavLink}
                  to="/projects"
                  onClick={() => setExpanded(false)}
                  className={({ isActive }) => (isActive ? "active" : "")}>
                  {t("nav.projects")}
                </Nav.Link>
              </motion.div>

              <motion.div
                custom={3}
                variants={navItemVariants}
                initial="hidden"
                animate="visible">
                <Nav.Link
                  as={NavLink}
                  to="/about"
                  onClick={() => setExpanded(false)}
                  className={({ isActive }) => (isActive ? "active" : "")}>
                  {t("nav.about")}
                </Nav.Link>
              </motion.div>

              <motion.div
                custom={4}
                variants={navItemVariants}
                initial="hidden"
                animate="visible">
                <Nav.Link
                  as={NavLink}
                  to="/contact"
                  onClick={() => setExpanded(false)}
                  className={({ isActive }) => (isActive ? "active" : "")}>
                  {t("nav.contact")}
                </Nav.Link>
              </motion.div>

              {isAuthenticated && (
                <motion.div
                  custom={5}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible">
                  <Nav.Link
                    as={NavLink}
                    to="/admin"
                    onClick={() => setExpanded(false)}
                    className={({ isActive }) => (isActive ? "active" : "")}>
                    {t("nav.admin")}
                  </Nav.Link>
                </motion.div>
              )}
            </Nav>

            <div className="nav-buttons">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}>
                <Button
                  variant={darkMode ? "outline-light" : "outline-dark"}
                  className="theme-toggle"
                  onClick={handleThemeToggle}
                  aria-label={darkMode ? t("theme.light") : t("theme.dark")}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={darkMode ? "moon" : "sun"}
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.3 }}>
                      {darkMode ? <BsSun /> : <BsMoon />}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}>
                <Button
                  variant={darkMode ? "outline-light" : "outline-dark"}
                  className="language-toggle"
                  onClick={handleLanguageToggle}
                  aria-label={
                    language === "en" ? t("language.ar") : t("language.en")
                  }>
                  <BsGlobe className="me-1" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={language}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}>
                      {language === "en" ? "AR" : "EN"}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </motion.div>

              {isAuthenticated && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="danger"
                    className="logout-btn"
                    onClick={handleLogout}
                    aria-label={t("admin.logout")}>
                    <FiLogOut />
                  </Button>
                </motion.div>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </motion.header>
  );
};

export default Header;
