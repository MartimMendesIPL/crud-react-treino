import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en-US.json";
import translationPT from "./locales/pt-PT.json";

const resources = {
    "en-US": { translation: translationEN },
    "pt-PT": { translation: translationPT },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en-US",
        supportedLngs: ["en-US", "pt-PT"],
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
