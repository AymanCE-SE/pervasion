import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './i18n/locales/en.json';
import arTranslations from './i18n/locales/ar.json';

// Environment-driven defaults
const DEFAULT_LANGUAGE = (import.meta && import.meta.env && import.meta.env.VITE_DEFAULT_LANGUAGE) || 'ar';
const FALLBACK_LANGUAGE = (import.meta && import.meta.env && import.meta.env.VITE_FALLBACK_LANGUAGE) || 'ar';
const FORCE_DEFAULT_LANGUAGE = (import.meta && import.meta.env && String(import.meta.env.VITE_FORCE_DEFAULT_LANGUAGE).toLowerCase() === 'true');

// Helper function to safely access localStorage and env default
const getSavedLanguage = () => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const savedLang = localStorage.getItem('i18nextLng');

  if (savedLang && !FORCE_DEFAULT_LANGUAGE) return savedLang;

  // If force flag is set, write the default into localStorage (so future loads keep it)
  if (FORCE_DEFAULT_LANGUAGE) {
    localStorage.setItem('i18nextLng', DEFAULT_LANGUAGE);
    return DEFAULT_LANGUAGE;
  }

  // If no saved language, prefer env default, else fall back to browser detection
  if (DEFAULT_LANGUAGE) return DEFAULT_LANGUAGE;

  const browserLang = (navigator && navigator.language) ? navigator.language.split('-')[0] : null;
  return ['en', 'ar'].includes(browserLang) ? browserLang : FALLBACK_LANGUAGE;
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
    fallbackLng: FALLBACK_LANGUAGE,
    lng: getSavedLanguage(),
    debug: false, // Disable debug in all environments
    detection: {
      // prefer stored user choice first, then querystring/cookie, finally browser
      order: ['localStorage', 'querystring', 'cookie', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
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
