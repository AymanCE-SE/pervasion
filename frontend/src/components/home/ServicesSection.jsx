import React, { useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPalette, FaBullhorn, FaChartLine, FaSearch, FaPlus, FaMinus } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import './ServicesSection.css';

const ServicesSection = () => {
  const { t, i18n } = useTranslation();
  const darkMode = useSelector(selectDarkMode);
  const [open, setOpen] = useState(null);

  const handleToggle = idx => setOpen(open === idx ? null : idx);

  const services = [
    {
      icon: <FaPalette />,
      headline: t('home.services.branding.headline', 'Branding & Visual Identity'),
      branches: [
        t('home.services.branding.branch1', 'Logo Design'),
        t('home.services.branding.branch2', 'Complete Brand Identity'),
        t('home.services.branding.branch3', 'Company Profiles & Presentations'),
        t('home.services.branding.branch4', 'Business Cards & Print Materials'),
        t('home.services.branding.branch5', 'Packaging & Label Design'),
      ],
    },
    {
      icon: <FaBullhorn />,
      headline: t('home.services.social.headline', 'Social Media Marketing'),
      branches: [
        t('home.services.social.branch1', 'Social Media Account Setup'),
        t('home.services.social.branch2', 'Creative & Engaging Content Writing'),
        t('home.services.social.branch3', 'Regular Post Design & Publishing'),
        t('home.services.social.branch4', 'Monthly Performance Reports'),
      ],
    },
    {
      icon: <FaSearch />,
      headline: t('home.services.seo.headline', 'SEO & Content Marketing'),
      branches: [
        t('home.services.seo.branch1', 'Website Analysis'),
        t('home.services.seo.branch2', 'Keyword Research'),
        t('home.services.seo.branch3', 'SEO-Friendly Article Writing'),
        t('home.services.seo.branch4', 'Image & Metadata Optimization'),
      ],
    },
    {
      icon: <FaChartLine />,
      headline: t('home.services.growth.headline', 'Growth Strategy'),
      branches: [
        t('home.services.growth.branch1', 'Comprehensive Marketing Plans'),
        t('home.services.growth.branch2', 'Brand Strategy Consulting'),
        t('home.services.growth.branch3', 'Integration with Analytics & Tracking Tools'),
        t('home.services.growth.branch4', 'Ongoing Brand Support'),
      ],
    },
  ];

  return (
    <section className={`home-services-section${darkMode ? ' dark-mode' : ''}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="section-header text-center"
        >
          <h2 className="section-title">{t('home.services.title', 'Our Services')}</h2>
          <p className="section-subtitle ms-2">{t('home.services.subtitle', 'What we offer for your brand growth')}</p>
        </motion.div>
        <Row className="g-4 justify-content-center">
          {services.map((service, idx) => (
            <Col key={idx} md={6} lg={3}>
              <motion.div
                className={`service-card${open === idx ? ' open' : ''}`}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="service-card-header d-flex align-items-center justify-content-between">
                  <span className="service-icon">{service.icon}</span>
                  <span className="service-headline">{service.headline}</span>
                  <Button
                    variant="link"
                    className="service-toggle-btn"
                    onClick={() => handleToggle(idx)}
                    aria-label={open === idx ? t('common.close') : t('common.expand')}
                  >
                    {open === idx ? <FaMinus /> : <FaPlus />}
                  </Button>
                </div>
                <AnimatePresence initial={false}>
                  {open === idx && (
                    <motion.ul
                      className="service-branches"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { height: 'auto', opacity: 1, transition: { staggerChildren: 0.08, when: "beforeChildren" } },
                        collapsed: { height: 0, opacity: 0, transition: { when: "afterChildren" } }
                      }}
                      style={{ overflow: 'hidden' }}
                    >
                      {service.branches.map((branch, bidx) => (
                        <motion.li
                          key={bidx}
                          className="service-branch"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0., delay: bidx * 0.08 }}
                        >
                          <span className="branch-dot"></span>
                          {branch}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default ServicesSection;