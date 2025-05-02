/** @format */

import React, { useState, useEffect } from "react";
import LogoLight from "../../assets/logo-light.png";
import LogoDark from "../../assets/logo-dark.png";
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
import {
  selectIsAuthenticated,
  selectUserRole,
  logout,
} from "../../redux/slices/authSlice";
import { BsSun, BsMoon, BsGlobe } from "react-icons/bs";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import { RiStackLine, RiUserAddLine } from "react-icons/ri";
import "./Header.css";

const Header = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
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
                <div
                  className={`logo-shine-wrapper ${
                    darkMode ? "dark" : "light"
                  }`}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={darkMode ? "dark" : "light"}
                      src={darkMode ? LogoDark : LogoLight}
                      alt="Pervasion Logo"
                      className="logo-image"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>
                  <div className="logo-overlay"></div>
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

              {/* <motion.div
                custom={2}
                variants={navItemVariants}
                initial="hidden"
                animate="visible">
                <Nav.Link
                  as={NavLink}
                  to="/services"
                  onClick={() => setExpanded(false)}
                  className={({ isActive }) => (isActive ? "active" : "")}>
                  {t("nav.services")}
                </Nav.Link>
              </motion.div> */}

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

              {isAuthenticated && userRole === "admin" && (
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

              {isAuthenticated && userRole === "user" && (
                <motion.div
                  custom={5}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible">
                  <Nav.Link
                    as={NavLink}
                    to="/dashboard"
                    onClick={() => setExpanded(false)}
                    className={({ isActive }) => (isActive ? "active" : "")}>
                    {t("nav.dashboard")}
                  </Nav.Link>
                </motion.div>
              )}
            </Nav>

            <div className="nav-buttons">
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

              {isAuthenticated ? (
                <Button
                  variant="danger"
                  className="logout-btn"
                  onClick={handleLogout}
                  aria-label={t("auth.logout")}>
                  <FiLogOut />
                </Button>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/login"
                    className="login-btn"
                    onClick={() => setExpanded(false)}
                    aria-label={t("auth.login")}>
                    <FiLogIn className="me-1" />
                    <span className="btn-text">{t("auth.login")}</span>
                  </Button>

                  <Button
                    as={Link}
                    to="/signup"
                    variant="primary"
                    className="signup-btn"
                    onClick={() => setExpanded(false)}
                    aria-label={t("auth.signup")}>
                    <RiUserAddLine className="me-1" />
                    <span className="btn-text">{t("auth.signup")}</span>
                  </Button>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </motion.header>
  );
};

export default Header;
