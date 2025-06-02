import i18n from "i18next"; // ✅ THIS LINE is critical!
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Load translations
import en from "./locales/en/translation.json";
import de from "./locales/de/translation.json";
import zh from "./locales/zh/translation.json";
import ar from "./locales/ar/translation.json";
import ru from "./locales/ru/translation.json";
import tr from "./locales/tr/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      de: { translation: de },
      zh: { translation: zh },
      ar: { translation: ar },
      ru: { translation: ru },
      tr: { translation: tr }
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
