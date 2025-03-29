import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// Define possible paths to try for locales
const PUBLIC_PATH = "";
const BASE_PATHS = [
  `${PUBLIC_PATH}/locales/{{lng}}/{{ns}}.json`, // For production build
  `${PUBLIC_PATH}/public/locales/{{lng}}/{{ns}}.json`, // Alternative production path
  `/locales/{{lng}}/{{ns}}.json`, // Direct from root
  `/src/locales/{{lng}}/{{ns}}.json`, // In source directory
];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true, // Set to true to see detailed logs
    supportedLngs: ["en", "ar", "fr", "es", "de", "ru"],

    // Load only language, not region
    load: "languageOnly",

    // Use multiple namespaces
    ns: ["common", "header", "footer", "vehicles"],
    defaultNS: "common",

    // Improve performance
    partialBundledLanguages: true,

    interpolation: {
      escapeValue: false, // Not necessary for React
    },

    // Translation file path with fallback paths
    backend: {
      // Try multiple paths to find the correct one
      loadPath: (lngs, namespaces) => {
        // In a real environment, we could test which path works and store it
        // For now, use the first path as the main one
        const lng = lngs[0];
        const ns = namespaces[0];

        // Here we could add logic to test if the path exists
        // and choose the working one, but for simplicity we'll use the first
        return BASE_PATHS[0];
      },

      parse: (data) => {
        try {
          // Check if the response starts with HTML doctype
          if (
            typeof data === "string" &&
            data.trim().startsWith("<!DOCTYPE html>")
          ) {
            console.warn(
              "Received HTML instead of JSON. Path might be incorrect."
            );
            return {}; // Return empty object to prevent errors
          }
          return JSON.parse(data);
        } catch (e) {
          console.error("JSON parsing error:", e);
          // Only log the first 100 characters to avoid cluttering the console
          console.error(
            "Problematic JSON data (truncated):",
            typeof data === "string" ? data.substring(0, 100) + "..." : data
          );
          return {}; // Return empty object to prevent total failure
        }
      },

      customHeaders: {
        "Cache-Control": "no-cache", // Disable caching to ensure fresh loads
      },
    },

    // Language detection and caching
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "userLanguage",
      caches: ["localStorage"],
    },

    // React-specific settings
    react: {
      useSuspense: true,
      bindI18n: "languageChanged",
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ["br", "strong", "i"],

      // Additional error handling
      reportNamespaces: true,
    },

    // Error handling
    saveMissing: false, // Set to true to help identify missing translations
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      console.log(`Missing translation key: ${lng}:${ns}:${key}`);
    },
  });

// Add error handling
i18n.on("error", (error) => {
  console.error("i18next error:", error);
});

// Add successful load event for debugging
i18n.on("loaded", (loaded) => {
  console.log("i18next resources loaded:", loaded);
});

export default i18n;
