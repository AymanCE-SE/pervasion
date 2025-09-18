import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import { motion } from 'framer-motion';
import './OurPartners.css';

const partners = [
  { name: 'riyadh-parking', img: '/images/partners/riyadh-parking.png' },
  { name: 'Hadef Company for International Trading and Logistics', img: '/images/partners/hadef.png' },
  { name: 'jac-motors', img: '/images/partners/jac-motors.png' },
  { name: 'kif-mossafer', img: '/images/partners/kif-mossafer.png' },
  { name: 'the9national-quality-conf', img: '/images/partners/the9national-quality-conf.png' },
  { name: 'arab-cup', img: '/images/partners/arab-cup.png' },
  { name: 'literature-association', img: '/images/partners/literature-association.png' },
  { name: 'yssr-company', img: '/images/partners/yssr-company.png' },
  { name: 'fadaat-nakdya', img: '/images/partners/fadaat-nakdya.png' },
  { name: 'algortithm-schools', img: '/images/partners/algortithm-schools.png' },
  { name: 'Pervasion', img: '/images/partners/Pervasion.png' },
];

const OurPartners = () => {
  const { t } = useTranslation();
  const darkMode = useSelector(selectDarkMode);

  return (
    <section className={`partners-section${darkMode ? ' dark-mode' : ''} mt-5`}>
      <div className="container-xxl"> 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="section-header text-center"
        >
          <h3 className="section-subtitle gradient-text">{t('about.partners.title', 'Our Partners')}</h3>
          <p className="section-desc mt-2">{t('about.partners.desc', 'We are proud to collaborate with leading brands and organizations.')}</p>
        </motion.div>
        <div className="partners-grid">
          {partners.map((partner, idx) => (
            <motion.div
              className="partner-img-outer"
              key={partner.name + idx}
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{
                scale: 1.05, 
                transition: { duration: 0.3 }
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
      </div>
    </section>
  );
};

export default OurPartners;