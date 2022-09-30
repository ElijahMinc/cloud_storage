import { getCurrentLanguage } from './utils/currentLanguage';
import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import translationEN from './translation/en/common.json';
import translationUk from './translation/uk/common.json';
import { initReactI18next } from 'react-i18next';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  uk: {
   translation: translationUk
  }
};

i18n
.use(detector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getCurrentLanguage(),
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;