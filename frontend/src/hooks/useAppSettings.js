import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '../i18n';
import { selectDarkMode, toggleTheme } from '../redux/slices/themeSlice';
import { selectLanguage, setLanguage } from '../redux/slices/languageSlice';

export const useAppSettings = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);
  const language = useSelector(selectLanguage);

  // Apply theme and language classes to the document
  useEffect(() => {
    // Set dark mode class
    const theme = darkMode ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode', darkMode);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [darkMode]);

  // Handle language change
  const changeLanguage = useCallback(async (lang) => {
    try {
      await i18n.changeLanguage(lang);
      
      // Set document direction and language attributes
      document.documentElement.lang = lang;
      const isRTL = lang === 'ar';
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      
      // Toggle RTL/LTR classes
      document.body.classList.toggle('rtl', isRTL);
      document.body.classList.toggle('ltr', !isRTL);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('i18nextLng', lang);
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  }, []);

  // Theme and language initialization is now handled in the App component

  // Update language when it changes in Redux
  useEffect(() => {
    if (language && language !== i18n.language) {
      changeLanguage(language);
    }
  }, [language, changeLanguage]);

  const toggleThemeHandler = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const toggleLanguageHandler = useCallback(() => {
    const newLang = language === 'en' ? 'ar' : 'en';
    dispatch(setLanguage(newLang));
  }, [dispatch, language]);

  // Export individual hooks for more granular usage
  const useTheme = () => ({
    darkMode,
    toggleTheme: toggleThemeHandler,
  });

  const useLang = () => ({
    language,
    isRTL: language === 'ar',
    toggleLanguage: toggleLanguageHandler,
  });

  return {
    darkMode,
    language,
    isRTL: language === 'ar',
    toggleTheme: toggleThemeHandler,
    toggleLanguage: toggleLanguageHandler,
    changeLanguage: (lang) => dispatch(setLanguage(lang)),
    useTheme,
    useLanguage: useLang, // Alias for backward compatibility
  };
};
