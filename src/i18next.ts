import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import locale_en from "@/locales/en";
import locale_es from "@/locales/es";
import locale_ar from "@/locales/ar";
import { getLocales } from "expo-localization";

const resources = {
  en: locale_en,
  es: locale_es,
  ar: locale_ar,
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    lng: getLocales()[0].languageCode ?? "en",
  })
  .finally();

export default i18n;
