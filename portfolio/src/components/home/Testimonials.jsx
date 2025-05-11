import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import './Testimonials.css';

const Testimonials = () => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CEO, TechStart",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      text: "Working with this team has been an absolute pleasure. Their attention to detail and creative solutions have helped us achieve remarkable results.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Art Director, DesignCo",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      text: "The level of professionalism and creativity is outstanding. They truly understand how to bring ideas to life while maintaining brand consistency.",
      rating: 5
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Founder, InnovateLab",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      text: "Exceptional work! Their innovative approach and technical expertise have significantly improved our digital presence.",
      rating: 5
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5 
      },
    },
  };

  return (
    <section className={`testimonials-section ${darkMode ? 'dark-mode' : ''}`}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="section-header text-center"
        >
          <h2 className="section-title">{t('testimonials.title')}</h2>
          <p className="section-subtitle">{t('testimonials.subtitle')}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-100px" }}
          className="testimonials-container"
        >
          <Row>
            {testimonials.map((testimonial) => (
              <Col key={testimonial.id} lg={4} md={6} className="mb-4">
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className={`testimonial-card ${darkMode ? 'dark-mode' : ''}`}>
                    <motion.div 
                      className="quote-icon"
                      initial={{ rotate: 0 }}
                      whileInView={{ rotate: 360 }}
                      viewport={{ margin: "-100px" }}
                      transition={{ duration: 0.8 }}
                    >
                      <FaQuoteLeft />
                    </motion.div>
                    <motion.p 
                      className="testimonial-text"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ margin: "-100px" }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {testimonial.text}
                    </motion.p>
                    <motion.div 
                      className="testimonial-author"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ margin: "-100px" }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="author-image" 
                      />
                      <div className="author-info">
                        <h4 className="author-name">{testimonial.name}</h4>
                        <p className="author-role">{testimonial.role}</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Container>
    </section>
  );
};

export default Testimonials;