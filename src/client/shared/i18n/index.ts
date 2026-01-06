import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import ru from "./locales/ru/translation.json";

export const i18n = i18next.createInstance();

export function initI18n(opts?: { lng?: "en" | "ru"; initAsync?: boolean }) {
  if (i18n.isInitialized) return Promise.resolve(i18n);
  const lng =
    opts?.lng ??
    (typeof window !== "undefined"
      ? ((localStorage.getItem("i18nextLng") as "en" | "ru" | null) ?? "en")
      : "en");

  return i18n.use(initReactI18next).init({
    lng,
    fallbackLng: "en",
    supportedLngs: ["en", "ru"],
    load: "languageOnly",
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    interpolation: { escapeValue: false },
    initAsync: opts?.initAsync ?? true,
  });
}

export default i18n;
