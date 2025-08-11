import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { motion, useAnimation } from 'framer-motion';
import './OurPartners.css';

const partners = [
  { name: 'Hadef Company for International Trading and Logistics', img: '/images/partners/hadef.webp' },
  { name: 'Partner Two With A Long Name', img: '/images/partners/hadef.webp' },
  { name: 'Partner Three', img: '/images/partners/hadef.webp' },
  { name: 'Partner Four', img: '/images/partners/hadef.webp' },
  { name: 'Partner Five', img: '/images/partners/hadef.webp' },
  { name: 'Partner Six', img: '/images/partners/hadef.webp' },
  { name: 'Partner Seven', img: '/images/partners/hadef.webp' },
  { name: 'Partner Eight', img: '/images/partners/hadef.webp' },
];

const OurPartners = () => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);
  const sliderRef = useRef(null);
  const controls = useAnimation();

  // Simple scroll left/right handlers for slider arrows
  const scrollSlider = (dir) => {
    if (!sliderRef.current) return;
    const card = sliderRef.current.querySelector('.partner-img-outer');
    const cardWidth = card ? card.offsetWidth + 32 : 220;
    sliderRef.current.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  };

  return (
    <section className={`partners-section${darkMode ? ' dark-mode' : ''} mt-5`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="section-header text-center"
        >
          <h3 className="section-subtitle gradient-text">{t('about.partners.title', 'Our Partners')}</h3>
          <p className="section-desc">{t('about.partners.desc', 'We are proud to collaborate with leading brands and organizations.')}</p>
        </motion.div>
        <div className="partners-slider-modern-wrapper">
          <button
            className="slider-arrow left"
            aria-label="Scroll left"
            onClick={() => scrollSlider(-1)}
            tabIndex={0}
            type="button"
          >
            <span>&#8592;</span>
          </button>
          <div className="partners-slider-modern" ref={sliderRef}>
            {partners.map((partner, idx) => (
              <motion.div
                className="partner-img-outer"
                key={partner.name + idx}
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{
                  scale: 1.08,
                  boxShadow: darkMode
                    ? "0 8px 32px var(--shadow-dark)"
                    : "0 8px 32px var(--shadow-md)",
                }}
              >
                <div className="partner-img-glow">
                  <img
                    src={partner.img}
                    alt={partner.name}
                    className="partner-img-modern"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <button
            className="slider-arrow right"
            aria-label="Scroll right"
            onClick={() => scrollSlider(1)}
            tabIndex={0}
            type="button"
          >
            <span>&#8594;</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default OurPartners;