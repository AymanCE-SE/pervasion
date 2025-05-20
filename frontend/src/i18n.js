import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './i18n/locales/en.json';
import arTranslations from './i18n/locales/ar.json';

// Helper function to safely access localStorage
const getSavedLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  const savedLang = localStorage.getItem('i18nextLng');
  if (savedLang) return savedLang;
  
  // Fallback to browser language if no saved language
  const browserLang = navigator.language.split('-')[0];
  return ['en', 'ar'].includes(browserLang) ? browserLang : 'en';
};

// Configure i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      ar: {
        translation: arTranslations
      }
    },
    fallbackLng: 'en',
    lng: getSavedLanguage(),
    debug: false, // Disable debug in all environments
    saveMissing: process.env.NODE_ENV === 'development', // Only log missing keys in development
    saveMissingTo: 'all', // Save missing keys for all languages
    missingKeyHandler: (lngs, ns, key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: ${key} in namespace ${ns}`);
      }
    },
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: true
    },
    parseMissingKeyHandler: (key) => {
      return key; // Return the key as fallback
    }
  });

export default i18n;
