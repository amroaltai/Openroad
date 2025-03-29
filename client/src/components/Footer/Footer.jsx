import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, MapPin, ExternalLink, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logga.png";

const InstagramIcon = memo(() => (
  <div className="flex flex-col items-center group">
    <div className="relative transform transition-transform group-hover:-translate-y-1 group-hover:scale-105 duration-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        className="drop-shadow-[0_4px_6px_rgba(249,115,22,0.4)] group-hover:drop-shadow-[0_6px_8px_rgba(249,115,22,0.6)]"
      >
        <rect width="24" height="24" rx="6" fill="url(#instagram-gradient)" />
        <rect width="24" height="24" rx="6" fill="black" opacity="0.15" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 7.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
          fill="white"
        />
        <circle cx="16.5" cy="7.5" r="1.5" fill="white" />
        <defs>
          <linearGradient
            id="instagram-gradient"
            x1="0"
            y1="0"
            x2="24"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 bg-orange-400/30 opacity-0 group-hover:opacity-20 rounded-lg blur-sm transition-opacity"></div>
    </div>
    <span className="text-xs text-white mt-2 block md:opacity-0 md:group-hover:opacity-100 transition-opacity">
      Instagram
    </span>
  </div>
));
InstagramIcon.displayName = "InstagramIcon";

const TikTokIcon = memo(() => (
  <div className="flex flex-col items-center group">
    <div className="relative transform transition-transform group-hover:-translate-y-1 group-hover:scale-105 duration-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        className="drop-shadow-[0_4px_6px_rgba(249,115,22,0.4)] group-hover:drop-shadow-[0_6px_8px_rgba(249,115,22,0.6)]"
      >
        <rect width="24" height="24" rx="6" fill="black" />
        <rect
          width="23"
          height="23"
          rx="5.5"
          x="0.5"
          y="0.5"
          stroke="url(#tiktok-gradient)"
          strokeWidth="1"
        />
        <path
          d="M16 7.8c-.7-.5-1-1.2-1-1.8h-2v8.6c0 1-.8 1.9-1.9 1.9-1 0-1.9-.8-1.9-1.9 0-1 .8-1.9 1.9-1.9.2 0 .4 0 .6.1V9.8c-.2 0-.4-.1-.6-.1-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4V9.1c.8.6 1.8.9 3 .9V8c-.9 0-1.6-.1-2.1-.2z"
          fill="url(#tiktok-gradient)"
          stroke="white"
          strokeWidth="0.5"
        />
        <defs>
          <linearGradient
            id="tiktok-gradient"
            x1="0"
            y1="0"
            x2="24"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 bg-orange-400/30 opacity-0 group-hover:opacity-20 rounded-lg blur-sm transition-opacity"></div>
    </div>
    <span className="text-xs text-white mt-2 block md:opacity-0 md:group-hover:opacity-100 transition-opacity">
      TikTok
    </span>
  </div>
));
TikTokIcon.displayName = "TikTokIcon";

const SnapchatIcon = memo(() => (
  <div className="flex flex-col items-center group">
    <div className="relative transform transition-transform group-hover:-translate-y-1 group-hover:scale-105 duration-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        className="drop-shadow-[0_4px_6px_rgba(249,115,22,0.4)] group-hover:drop-shadow-[0_6px_8px_rgba(249,115,22,0.6)]"
      >
        <rect width="24" height="24" rx="6" fill="black" />
        <rect
          width="23"
          height="23"
          rx="5.5"
          x="0.5"
          y="0.5"
          stroke="url(#snapchat-gradient)"
          strokeWidth="1"
        />
        <path
          d="M12 7.5c-1.1 0-2 0.9-2.1 2c0 0.4-0.1 1.4-0.1 1.8c-0.3 0.1-0.6 0.1-0.9 0.1c-0.2 0-0.4-0.1-0.5-0.1c0 0-0.1 0-0.1 0c-0.1 0-0.2 0.1-0.2 0.2c0 0.2 0.2 0.4 0.4 0.5c0.2 0.1 0.3 0.2 0.3 0.3c0 0.1-0.3 0.6-0.8 1.2c-0.3 0.4-0.9 0.7-1.5 0.8c-0.1 0-0.2 0.1-0.2 0.2c0 0.1 0.1 0.2 0.3 0.3c0.5 0.2 1.1 0.3 1.3 0.5c0 0.1 0 0.2 0.1 0.3c0 0 0.1 0.1 0.2 0.1c0.1 0 0.3 0 0.6-0.1c0.4-0.1 0.6 0 0.9 0.2c0.3 0.2 0.5 0.4 0.9 0.4c0.2 0 0.4-0.1 0.6-0.2c0.5-0.2 0.9-0.2 1.4 0c0.2 0.1 0.4 0.2 0.6 0.2c0.4 0 0.6-0.2 0.9-0.4c0.3-0.2 0.5-0.3 0.9-0.2c0.3 0.1 0.5 0.1 0.6 0.1c0.1 0 0.2-0.1 0.2-0.1c0.1-0.1 0.1-0.2 0.1-0.3c0.2-0.2 0.8-0.3 1.3-0.5c0.2-0.1 0.3-0.2 0.3-0.3c0-0.1-0.1-0.2-0.2-0.2c-0.6-0.1-1.2-0.4-1.5-0.8c-0.5-0.6-0.8-1.1-0.8-1.2c0-0.1 0.1-0.2 0.3-0.3c0.2-0.1 0.4-0.3 0.4-0.5c0-0.1-0.1-0.2-0.2-0.2c0 0-0.1 0-0.1 0c-0.1 0-0.3 0.1-0.5 0.1c-0.3 0-0.6 0-0.9-0.1c0-0.4-0.1-1.4-0.1-1.8C14 8.4 13.1 7.5 12 7.5z"
          fill="url(#snapchat-gradient)"
        />
        <defs>
          <linearGradient
            id="snapchat-gradient"
            x1="0"
            y1="0"
            x2="24"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 bg-orange-400/30 opacity-0 group-hover:opacity-20 rounded-lg blur-sm transition-opacity"></div>
    </div>
    <span className="text-xs text-white mt-2 block md:opacity-0 md:group-hover:opacity-100 transition-opacity">
      SnapChat
    </span>
  </div>
));
SnapchatIcon.displayName = "SnapchatIcon";

const WhatsAppIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2 text-green-500"
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
    <path d="M13.5 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
    <path d="M9 13a5 5 0 0 0 6 0" />
  </svg>
));
WhatsAppIcon.displayName = "WhatsAppIcon";

const SocialMediaLink = memo(({ href, icon, ariaLabel }) => (
  <div className="relative group">
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative z-10"
      aria-label={ariaLabel}
    >
      {icon}
    </a>
  </div>
));
SocialMediaLink.displayName = "SocialMediaLink";

const Footer = memo(({ setIsAdminModalOpen }) => {
  const { t } = useTranslation(["footer", "common"]);

  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = () => {
      const isAuthenticated =
        sessionStorage.getItem("isAdminAuthenticated") === "true";
      setIsAdmin(isAuthenticated);
    };

    checkAdminStatus();

    window.addEventListener("storage", checkAdminStatus);

    return () => {
      window.removeEventListener("storage", checkAdminStatus);
    };
  }, []);

  const handleLogoInteraction = useCallback(() => {
    const now = new Date().getTime();
    const timeElapsed = now - lastClickTime > 2000;

    const newCount = timeElapsed ? 1 : clickCount + 1;

    if (newCount === 5) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        setIsAdminModalOpen(true);
      }
      setClickCount(0);
    } else {
      setClickCount(newCount);
    }

    setLastClickTime(now);
  }, [clickCount, lastClickTime, isAdmin, navigate, setIsAdminModalOpen]);

  const currentYear = useMemo(() => {
    const year = new Date().getFullYear();
    return year < 2025 ? 2025 : year;
  }, []);

  const socialMediaLinks = useMemo(
    () => [
      {
        href: "https://instagram.com/openroad.cars",
        icon: <InstagramIcon />,
        ariaLabel: "Follow us on Instagram",
      },
      {
        href: "https://tiktok.com/@openroad.carrental",
        icon: <TikTokIcon />,
        ariaLabel: "Follow us on TikTok",
      },
      {
        href: "https://snapchat.com/add/openroadcars",
        icon: <SnapchatIcon />,
        ariaLabel: "Follow us on Snapchat",
      },
    ],
    []
  );

  return (
    <footer className="w-full bg-black border-t border-gray-800 pt-12 pb-6 px-4">
      <div className="container mx-auto">
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Open Road Dubai Logo"
            className="h-40 md:h-48 w-auto object-contain"
            onClick={handleLogoInteraction}
            onTouchStart={handleLogoInteraction}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col">
            <h3 className="text-xl text-white font-bold mb-4">
              {t("footer:companyInfo.title")}
            </h3>
            <p className="text-gray-400 mb-4">
              {t("footer:companyInfo.description")}
            </p>

            <h4 className="text-white font-medium mb-3">
              {t("footer:companyInfo.followUs")}
            </h4>
            <div className="flex space-x-4">
              {socialMediaLinks.map((link, index) => (
                <SocialMediaLink
                  key={index}
                  href={link.href}
                  icon={link.icon}
                  ariaLabel={link.ariaLabel}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-xl text-white font-bold mb-4">
              {t("footer:quickLinks.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-orange-400 transition-colors flex items-center"
                >
                  <ExternalLink size={16} className="mr-2" />
                  {t("footer:quickLinks.termsAndConditions")}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-orange-400 transition-colors flex items-center"
                >
                  <ExternalLink size={16} className="mr-2" />
                  {t("footer:quickLinks.aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  to="/vehicles"
                  className="text-gray-400 hover:text-orange-400 transition-colors flex items-center"
                >
                  <ExternalLink size={16} className="mr-2" />
                  {t("footer:quickLinks.ourVehicles")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="text-xl text-white font-bold mb-4">
              {t("footer:contactUs.title")}
            </h3>
            <div className="space-y-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  t("footer:contactUs.address")
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-400 transition-colors flex items-start"
              >
                <MapPin
                  size={20}
                  className="mr-2 mt-1 flex-shrink-0 text-orange-400"
                />
                <span>{t("footer:contactUs.address")}</span>
              </a>
              <a
                href={`tel:${t("footer:contactUs.phone")}`}
                className="text-gray-400 hover:text-orange-400 transition-colors flex items-center"
              >
                <Phone size={20} className="mr-2 text-orange-400" />
                <span>{t("footer:contactUs.phone")}</span>
              </a>
              <a
                href={`https://wa.me/${t("footer:contactUs.whatsapp").replace(
                  /\s+/g,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-400 transition-colors flex items-center"
              >
                <WhatsAppIcon />
                <span>{t("footer:contactUs.whatsapp")}</span>
              </a>
              <a
                href={`mailto:${t("footer:contactUs.email")}`}
                className="text-gray-400 hover:text-orange-400 transition-colors flex items-center"
              >
                <Mail size={20} className="mr-2 text-orange-400" />
                <span>{t("footer:contactUs.email")}</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-4 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Open Road Rental L.L.C Dubai. All rights
              reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient--r from-orange-400/20 via-orange-500/20 to-amber-500/20 blur-sm"></div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
