import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import common_en from './translations/en/common.json';
import common_es from './translations/es/common.json';


i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: "en",
        fallbackLng: "en", // use en if detected lng is not available

        interpolation: {
            escapeValue: false // react already safes from xss
        },
        resources: {
            en: {
                common: common_en
            },
            es: {
                common: common_es
            }
        }
    });


export default i18n;