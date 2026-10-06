import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';

const LANGUAGE_KEY = 'formcraft_language';

const savedLanguage = typeof window !== 'undefined'
  ? window.localStorage.getItem(LANGUAGE_KEY) || 'en'
  : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LANGUAGE_KEY, lng);
    document.documentElement.lang = lng;
  }
});

export default i18n;
