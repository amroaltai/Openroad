import React, { useMemo, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";

// Flag SVGs as inline code
const FlagSVGs = {
  gb: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 480"
      className="w-5 h-3.5 rounded-sm object-cover shadow-sm"
    >
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path
        fill="#FFF"
        d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"
      />
      <path
        fill="#C8102E"
        d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"
      />
      <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
      <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
    </svg>
  ),
  ae: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 480"
      className="w-5 h-3.5 rounded-sm object-cover shadow-sm"
    >
      <path fill="#00732f" d="M0 0h640v160H0z" />
      <path fill="#fff" d="M0 160h640v160H0z" />
      <path d="M0 320h640v160H0z" />
      <path fill="red" d="M0 0h220v480H0z" />
    </svg>
  ),
  fr: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 480"
      className="w-5 h-3.5 rounded-sm object-cover shadow-sm"
    >
      <path fill="#fff" d="M0 0h640v480H0z" />
      <path fill="#002654" d="M0 0h213.3v480H0z" />
      <path fill="#ce1126" d="M426.7 0H640v480H426.7z" />
    </svg>
  ),
  es: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 480"
      className="w-5 h-3.5 rounded-sm object-cover shadow-sm"
    >
      <path fill="#c60b1e" d="M0 0h640v480H0z" />
      <path fill="#ffc400" d="M0 120h640v240H0z" />
    </svg>
  ),
  de: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 480"
      className="w-5 h-3.5 rounded-sm object-cover shadow-sm"
    >
      <path fill="#000" d="M0 0h640v160H0z" />
      <path fill="#DD0000" d="M0 160h640v160H0z" />
      <path fill="#FFCE00" d="M0 320h640v160H0z" />
    </svg>
  ),
  ru: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 480"
      className="w-5 h-3.5 rounded-sm object-cover shadow-sm"
    >
      <path fill="#fff" d="M0 0h640v480H0z" />
      <path fill="#0039a6" d="M0 160h640v320H0z" />
      <path fill="#d52b1e" d="M0 320h640v160H0z" />
    </svg>
  ),
};

// Define language options with SVG flags
const languages = [
  { code: "en", name: "English", flagKey: "gb" },
  { code: "ar", name: "العربية", flagKey: "ae" },
  { code: "fr", name: "Français", flagKey: "fr" },
  { code: "es", name: "Español", flagKey: "es" },
  { code: "de", name: "Deutsch", flagKey: "de" },
  { code: "ru", name: "Русский", flagKey: "ru" },
];

// Custom hook to handle language functionality
const useLanguageSelect = () => {
  const { i18n } = useTranslation();

  // Memoize current language to prevent recalculations
  const currentLanguage = useMemo(
    () => languages.find((lang) => lang.code === i18n.language) || languages[0],
    [i18n.language]
  );

  // Memoize language change function to prevent recreation on re-renders
  const changeLanguage = useCallback(
    (languageCode) => {
      // Save language preference to localStorage
      localStorage.setItem("userLanguage", languageCode);

      // Change language
      i18n.changeLanguage(languageCode);

      // Update document language attribute for RTL support
      document.documentElement.dir = languageCode === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = languageCode;
    },
    [i18n]
  );

  return { currentLanguage, changeLanguage };
};

// Desktop language selector component
export const DesktopLanguageSelector = memo(() => {
  const { currentLanguage, changeLanguage } = useLanguageSelect();

  return (
    <div className="relative group">
      <button
        className="flex items-center space-x-1 bg-transparent text-white hover:text-orange-400 transition-colors"
        aria-label="Select language"
      >
        <span className="mr-1">{FlagSVGs[currentLanguage.flagKey]}</span>
        <span className="text-sm">{currentLanguage.name}</span>
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>

      {/* Dropdown */}
      <div className="absolute z-50 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-md shadow-lg transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-150 origin-top-right">
        <div className="py-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 flex items-center space-x-2 hover:bg-gray-800 transition-colors ${
                currentLanguage.code === lang.code
                  ? "bg-gray-800 text-orange-400"
                  : "text-white"
              }`}
            >
              <span>{FlagSVGs[lang.flagKey]}</span>
              <span className="text-sm whitespace-nowrap">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

// Mobile language selector component
export const MobileLanguageSelector = memo(() => {
  const { currentLanguage, changeLanguage } = useLanguageSelect();

  return (
    <div className="py-2 border-t border-gray-700">
      <p className="px-4 py-2 text-xs uppercase text-gray-500">Language</p>
      <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto pr-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
              currentLanguage.code === lang.code
                ? "bg-orange-500 bg-opacity-20 text-orange-400"
                : "hover:bg-gray-800 text-white"
            }`}
          >
            <span>{FlagSVGs[lang.flagKey]}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

// Add display names for better debugging
DesktopLanguageSelector.displayName = "DesktopLanguageSelector";
MobileLanguageSelector.displayName = "MobileLanguageSelector";

// For easy import in Header.jsx and other components
export default DesktopLanguageSelector;
