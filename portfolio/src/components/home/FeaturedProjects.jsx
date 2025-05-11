import React, { useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects, selectFeaturedProjects, selectProjectStatus } from '../../redux/slices/projectsSlice';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { selectLanguage } from '../../redux/slices/languageSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './FeaturedProjects.css';

const FeaturedProjects = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const featuredProjects = useSelector(selectFeaturedProjects);
  const status = useSelector(selectProjectStatus);
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);

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
          <p className="section-subtitle">{t('projects.subtitle')}</p>
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
              loop
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation
              breakpoints={{
                576: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1200: { slidesPerView: 3 },
              }}
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
                          src={project.image}
                          alt={language === 'en' ? project.title : project.titleAr}
                          className="project-image"
                        />
                      </div>
                      <Card.Body>
                        <Card.Title>
                          {language === 'en' ? project.title : project.titleAr}
                        </Card.Title>
                        <Card.Text>
                          {language === 'en'
                            ? project.description.substring(0, 100) + '...'
                            : project.descriptionAr.substring(0, 100) + '...'}
                        </Card.Text>
                        <div className="project-category">
                          {t(`projects.categories.${project.category}`)}
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
          <div className="text-center py-5">
            <p>{t('projects.noProjects')}</p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default FeaturedProjects;
