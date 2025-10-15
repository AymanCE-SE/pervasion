import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Hero from './Hero';
import FeaturedProjects from './FeaturedProjects';
import './HomePage.css';
import Testimonials from './Testimonials';
import Stats from './Stats';
import ServicesSection from './ServicesSection';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('app.title')} - {t('nav.home')}</title>
        <meta name="description" content={t('app.description')} />
      </Helmet>
      
      <div className="home-page">
        <Hero />
        <Stats />
        <ServicesSection />
        <Testimonials />
        <FeaturedProjects />
      </div>
    </>
  );
};

export default HomePage;
