import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logga.png";
import DesktopLanguageSelector, {
  MobileLanguageSelector,
} from "../LanguageSelector";
import { useTranslation } from "react-i18next";

const WhatsAppIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-green-500"
  >
    <path d="M12.031 6.172c-3.526 0-6.388 2.742-6.388 6.115 0 1.297.388 2.543 1.103 3.621l.015.103-.445 1.767 1.824-.445.095.061c1.045.696 2.254 1.064 3.499 1.064 3.526 0 6.388-2.742 6.388-6.115 0-3.373-2.862-6.115-6.388-6.115m3.917 8.585c-.187.521-.955.977-1.363 1.046-.975.101-1.618-.475-1.752-.532-1.318-.635-2.2-1.815-2.646-2.684-.295-.575.055-1.024.232-1.221.304-.33.677-.533.842-.868.165-.335.027-.765-.246-1.46-.272-.695-.987-1.649-1.701-1.649-.365 0-.613.135-.863.4-.29.312-.726.972-.726 2.259 0 1.742 1.249 3.398 1.422 3.632.173.234 2.455 3.722 5.964 4.987.756.274 1.35.438 1.812.56.762.223 1.453.192 2 .117.642-.091 1.972-.806 2.248-1.588.276-.782.276-1.454.193-1.596-.083-.142-.307-.225-.646-.393zm-3.455-8.465c4.695 0 8.5 3.717 8.5 8.297 0 4.58-3.805 8.297-8.5 8.297-1.6 0-3.101-.45-4.402-1.224l-4.643 1.184 1.192-4.494c-.857-1.351-1.347-2.944-1.347-4.763 0-4.58 3.805-8.297 8.5-8.297m0-2c-5.79 0-10.5 4.621-10.5 10.297 0 1.857.484 3.655 1.4 5.216l-1.4 5.287 5.486-1.4c1.5 1.073 3.443 1.8 5.514 1.8 5.79 0 10.5-4.621 10.5-10.297 0-5.676-4.71-10.297-10.5-10.297z" />
  </svg>
));
WhatsAppIcon.displayName = "WhatsAppIcon";

const WhatsAppModal = memo(({ isOpen, onClose, onWhatsAppClick }) => {
  const { t } = useTranslation("header");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1200]">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <div className="flex justify-center mb-6">
          <WhatsAppIcon />
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          {t("whatsappModal.title")}
        </h2>

        <p className="text-gray-400 mb-6">{t("whatsappModal.message")}</p>

        <button
          onClick={onWhatsAppClick}
          className="w-full bg-green-600 text-white py-3 rounded-md font-bold hover:bg-green-700 transition-colors"
        >
          {t("whatsappModal.startChat")}
        </button>
      </div>
    </div>
  );
});
WhatsAppModal.displayName = "WhatsAppModal";

const AdminLoginModal = memo(({ isOpen, onClose, onLogin }) => {
  const { t } = useTranslation("header");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = useCallback(() => {
    if (username === "admin" && password === "password123") {
      sessionStorage.setItem("isAdminAuthenticated", "true");
      onLogin();
      navigate("/admin");
    } else {
      setError(t("adminLogin.errorMessage"));
    }
  }, [username, password, navigate, onLogin, t]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      handleLogin();
    },
    [handleLogin]
  );

  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setPassword("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1200]">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-4">
          {t("adminLogin.title")}
        </h2>

        {error && (
          <p className="text-red-500 mb-4 bg-red-900/20 p-2 rounded-md">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="text-left">
            <label
              htmlFor="username"
              className="block text-gray-300 mb-1 text-sm"
            >
              {t("adminLogin.username")}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="text-left">
            <label
              htmlFor="password"
              className="block text-gray-300 mb-1 text-sm"
            >
              {t("adminLogin.password")}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white py-3 rounded-md font-bold hover:from-orange-500 hover:to-amber-600 transition-colors"
          >
            {t("adminLogin.loginButton")}
          </button>
        </form>
      </div>
    </div>
  );
});
AdminLoginModal.displayName = "AdminLoginModal";

const WHATSAPP_NUMBER = "+971563995002";

const Header = memo(({ setIsAdminModalOpen: setGlobalAdminModalOpen }) => {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [touchCount, setTouchCount] = useState(0);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation(["header", "common"]);

  const handleAdminModalClose = useCallback(() => {
    setIsAdminModalOpen(false);
    if (setGlobalAdminModalOpen) setGlobalAdminModalOpen(false);
  }, [setGlobalAdminModalOpen]);

  const handleAdminModalOpen = useCallback(() => {
    setIsAdminModalOpen(true);
    if (setGlobalAdminModalOpen) setGlobalAdminModalOpen(true);
  }, [setGlobalAdminModalOpen]);

  useEffect(() => {
    const checkAdminStatus = () => {
      const isAuthenticated =
        sessionStorage.getItem("isAdminAuthenticated") === "true";
      setIsAdmin(isAuthenticated);
    };

    checkAdminStatus();
    window.addEventListener("storage", checkAdminStatus);
    return () => window.removeEventListener("storage", checkAdminStatus);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key === "a") {
        e.preventDefault();
        if (isAdmin) {
          navigate("/admin");
        } else {
          handleAdminModalOpen();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdmin, navigate, handleAdminModalOpen]);

  const handleAdminLogout = useCallback(() => {
    sessionStorage.removeItem("isAdminAuthenticated");
    setIsAdmin(false);
    navigate("/");
  }, [navigate]);

  const handleFooterTap = useCallback(() => {
    const now = new Date().getTime();
    if (now - lastTouchTime > 2000) {
      setTouchCount(1);
    } else {
      setTouchCount((prevCount) => {
        if (prevCount + 1 === 3) {
          if (isAdmin) {
            navigate("/admin");
          } else {
            handleAdminModalOpen();
          }
          return 0;
        }
        return prevCount + 1;
      });
    }
    setLastTouchTime(now);
  }, [lastTouchTime, isAdmin, navigate, handleAdminModalOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.location.pathname.includes("/vehicles")) {
      const preventNavigation = (e) => {
        const filterArea = document.querySelector(".vehicle-filters-area");
        if (filterArea && filterArea.contains(e.target)) {
          e.stopPropagation();
        }
      };

      document.addEventListener("mousedown", preventNavigation, true);
      document.addEventListener("touchstart", preventNavigation, true);

      return () => {
        document.removeEventListener("mousedown", preventNavigation, true);
        document.removeEventListener("touchstart", preventNavigation, true);
      };
    }
  }, []);

  const openWhatsAppChat = useCallback(() => {
    const message =
      "Hello! I'm interested in booking a car and would like more information.";
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(
      /\s+/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setIsModalOpen(false);
  }, []);

  const navLinks = useMemo(() => {
    const links = [
      { title: t("header:navigation.home"), path: "/" },
      { title: t("header:navigation.vehicles"), path: "/vehicles" },
      { title: t("header:navigation.termsAndConditions"), path: "/terms" },
      { title: t("header:navigation.aboutUs"), path: "/about" },
    ];

    if (isAdmin) {
      links.push({
        title: t("header:navigation.adminPanel"),
        path: "/admin",
      });

      links.push({
        title: t("header:navigation.logout"),
        path: "#",
        onClick: handleAdminLogout,
        icon: <LogOut size={16} className="ml-1" />,
      });
    }

    return links;
  }, [t, isAdmin, handleAdminLogout]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-sm shadow-lg shadow-gray-900/50 py-1 sm:py-2"
            : "py-2 sm:py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="OpenRoad Logo"
                  className={`transition-all duration-300 ${
                    isScrolled
                      ? "h-16 sm:h-20 md:h-24 w-auto"
                      : "h-28 sm:h-32 md:h-40 w-auto"
                  }`}
                />
              </Link>
            </div>

            <nav className="hidden md:flex md:flex-wrap lg:flex-nowrap items-center md:gap-2 lg:gap-0 lg:space-x-6">
              {navLinks.map((link) =>
                link.onClick ? (
                  <a
                    key={link.title}
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      link.onClick();
                    }}
                    className="text-white font-medium text-sm tracking-wide transition-all duration-300 relative group hover:scale-105 transform-gpu md:mx-1 lg:mx-0 md:my-1 lg:my-0 flex items-center justify-center cursor-pointer"
                  >
                    <span className="relative z-10 px-2 py-1">
                      {link.title}
                    </span>
                    {link.icon && link.icon}
                    <span className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 rounded-lg -z-10 transition-opacity duration-300"></span>
                  </a>
                ) : (
                  <Link
                    key={link.title}
                    to={link.path}
                    className="text-white font-medium text-sm tracking-wide transition-all duration-300 relative group hover:scale-105 transform-gpu md:mx-1 lg:mx-0 md:my-1 lg:my-0 flex items-center justify-center cursor-pointer"
                  >
                    <span className="relative z-10 px-2 py-1">
                      {link.title}
                    </span>
                    {link.icon && link.icon}
                    <span className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 rounded-lg -z-10 transition-opacity duration-300"></span>
                  </Link>
                )
              )}

              <div className="flex items-center border-l border-gray-700 pl-4 ml-2">
                <DesktopLanguageSelector />
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-orange-400/60 to-amber-500/60 hover:from-orange-500/80 hover:to-amber-600/80 text-white font-bold py-2 px-6 rounded-md transition-all duration-300 shadow-lg hover:shadow-orange-500/30 md:w-full lg:w-auto lg:ml-2 mt-1 lg:mt-0 text-center backdrop-blur-sm border border-orange-300/10 hover:translate-y-[-2px] active:translate-y-[1px] active:shadow-inner overflow-hidden"
              >
                {t("header:bookNow")}
              </button>
            </nav>

            <div className="md:hidden z-[1001]">
              <button
                type="button"
                className="text-white hover:text-orange-200 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out z-[990] ${
              isOpen
                ? "max-h-[70vh] opacity-100 mt-2 sm:mt-4 overflow-y-auto"
                : "max-h-0 opacity-0 mt-0"
            }`}
          >
            <nav
              className={`flex flex-col space-y-3 sm:space-y-4 py-3 sm:py-4 px-6 sm:px-12 rounded-lg ${
                isScrolled ? "bg-black/95" : "bg-black/95"
              } backdrop-blur-md shadow-xl`}
            >
              {navLinks.map((link) =>
                link.onClick ? (
                  <a
                    key={link.title}
                    href={link.path}
                    className="text-white hover:text-orange-200 font-medium text-sm py-2 px-2 transition-all duration-300 hover:scale-110 cursor-pointer flex items-center"
                    onClick={(e) => {
                      setIsOpen(false);
                      if (link.onClick) {
                        e.preventDefault();
                        link.onClick(e);
                      }
                    }}
                  >
                    <span className="p-1">{link.title}</span>
                    {link.icon && link.icon}
                  </a>
                ) : (
                  <Link
                    key={link.title}
                    to={link.path}
                    className="text-white hover:text-orange-200 font-medium text-sm py-2 px-2 transition-all duration-300 hover:scale-110 cursor-pointer flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="p-1">{link.title}</span>
                    {link.icon && link.icon}
                  </Link>
                )
              )}

              <MobileLanguageSelector />

              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="bg-gradient-to-r from-orange-400/60 to-amber-500/60 hover:from-orange-500/80 hover:to-amber-600/80 text-white font-bold py-2 px-4 rounded-md text-center transition-all duration-300 shadow-lg hover:shadow-orange-500/30 w-full backdrop-blur-sm border border-orange-300/10 hover:translate-y-[-2px] active:translate-y-[1px] active:shadow-inner overflow-hidden"
              >
                {t("header:bookNow")}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div
        className="fixed bottom-0 left-0 w-16 h-16 z-40"
        onClick={handleFooterTap}
        style={{ opacity: 0 }}
        aria-hidden="true"
      ></div>

      <WhatsAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWhatsAppClick={openWhatsAppChat}
      />

      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={handleAdminModalClose}
        onLogin={() => {
          setIsAdminModalOpen(false);
          if (setGlobalAdminModalOpen) setGlobalAdminModalOpen(false);
        }}
      />
    </>
  );
});

Header.displayName = "Header";

export default Header;
