import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './FeaturedProjects.css';

// Redux imports
import { fetchProjects, selectFeaturedProjects, selectProjectStatus } from '../../redux/slices/projectsSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { selectLanguage } from '../../redux/slices/languageSlice';

// Fallback image for corrupted project images
import placeholderImage from '../../assets/images/project-placeholder.svg';
import { getAbsoluteImageUrl } from '../../utils/imageUtils';

const FeaturedProjects = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const featuredProjects = useSelector(selectFeaturedProjects);
  const status = useSelector(selectProjectStatus);
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);
  
  // State to track which images have failed to load
  const [failedImages, setFailedImages] = useState({});
  
  // Handle image load errors
  const handleImageError = (projectId) => {
    setFailedImages(prev => ({
      ...prev,
      [projectId]: true
    }));
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  return (
    <section className={`featured-projects-section ${darkMode ? 'dark-mode' : ''}`}>
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="section-header text-center"
        >
          <h2 className="section-title">{t('projects.title')}</h2>
          <p className="section-subtitle ms-2">{t('projects.subtitle')}</p>
        </motion.div>

        {status === 'loading' ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">{t('common.loading')}</span>
            </div>
          </div>
        ) : featuredProjects.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="featured-projects-slider"
          >
            <Swiper
              dir={language === 'ar' ? 'rtl' : 'ltr'}
              modules={[Pagination, Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              loop={false} // Disable loop mode completely to avoid warnings
              autoplay={featuredProjects.length >= 2 ? { delay: 3500, disableOnInteraction: false } : false}
              pagination={{ clickable: true }}
              navigation={featuredProjects.length >= 2}
              breakpoints={{
                576: { slidesPerView: 1 },
                768: { slidesPerView: Math.min(2, featuredProjects.length) },
                1200: { slidesPerView: Math.min(3, featuredProjects.length) },
              }}
              watchOverflow={true} // Disable navigation/pagination when not enough slides
              simulateTouch={featuredProjects.length > 1}
              style={{ paddingBottom: '3rem' }}
            >
              {featuredProjects.map((project) => (
                <SwiperSlide key={project.id}>
                  <motion.div
                    whileHover={{ scale: 1.03, boxShadow: '0 12px 32px var(--shadow-light)' }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Card
                      className={`project-card ${darkMode ? 'dark-mode' : ''}`}
                      as={Link}
                      to={`/projects/${project.id}`}
                    >
                      <div className="card-img-wrapper">
                        <Card.Img
                          variant="top"
                          src={failedImages[project.id] ? placeholderImage : getAbsoluteImageUrl(project.image)}
                          alt={language === 'en' ? project.title : project.title_ar}
                          className="project-image"
                          onError={() => handleImageError(project.id)}
                          loading="lazy"
                        />
                      </div>
                      <Card.Body>
                        <Card.Title>
                          {language === 'en' ? project.title : project.title_ar}
                        </Card.Title>
                        <Card.Text>
                          {language === 'en'
                            ? (project.description || '').substring(0, 100) + '...'
                            : (project.description_ar || '').substring(0, 100) + '...'}
                        </Card.Text>
                        <div className="project-category">
                          {language === 'en' ? project.category_name : project.category_name_ar || project.category_name}
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mt-5"
            >
              <Link to="/projects" className="view-all-btn">
                {t('projects.viewProject')}
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center py-5"
          >
            <div className="no-projects-message">
              <i className="bi bi-folder-x display-4 mb-3"></i>
              <h4>{t('projects.noProjects', 'No featured projects found')}</h4>
              <p className="text-muted">
                {language === 'en' 
                  ? 'Check back soon for exciting featured projects!' 
                  : 'تحقق قريبًا من المشاريع المميزة المثيرة!'}
              </p>
              <Link to="/projects" className="btn mt-3">
                {t('projects.viewProject', 'View All Projects')}
              </Link>
            </div>
          </motion.div>
        )}
      </Container>
    </section>
  );
};

export default FeaturedProjects;
