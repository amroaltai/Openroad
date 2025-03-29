import React, {
  useState,
  useEffect,
  memo,
  lazy,
  Suspense,
  useCallback,
} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./i18n";
import "./index.css";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AdminLoginModal from "./components/AdminLoginModal";

const Hero = lazy(() => import("./components/Hero/Hero"));
const InfoGrid = lazy(() => import("./components/Hero/InfoGrid1"));
const CarsGrid = lazy(() => import("./components/CarsGrid/CarsGrid"));
const AdminPage = lazy(() => import("./components/AdminPage.jsx"));
const Vehicles = lazy(() => import("./Pages/Vehicles"));
const Terms = lazy(() => import("./Pages/Terms"));
const About = lazy(() => import("./Pages/About"));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const LoadingSpinner = memo(() => (
  <div
    className="flex justify-center items-center h-screen bg-black"
    role="status"
    aria-live="polite"
  >
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
    <span className="sr-only">Loading...</span>
  </div>
));
LoadingSpinner.displayName = "LoadingSpinner";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col justify-center items-center h-screen bg-black text-white p-4">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4">
            We're sorry, but there was an error loading this content.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ScrollToTopButton = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const toggleVisibility = () => {
      const scrollTop = window.pageYOffset;
      setIsVisible(scrollTop > 300);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(toggleVisibility);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <button
      className={`fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 shadow-lg flex items-center justify-center transform transition-all duration-300 z-30 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      } hover:from-orange-500 hover:to-amber-600 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ChevronUp className="text-white w-6 h-6" />
    </button>
  );
});
ScrollToTopButton.displayName = "ScrollToTopButton";

const HomePage = memo(({ setIsAdminModalOpen }) => (
  <div>
    <Header setIsAdminModalOpen={setIsAdminModalOpen} />
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Hero />
        <CarsGrid />
        <InfoGrid />
      </Suspense>
    </ErrorBoundary>
    <Footer setIsAdminModalOpen={setIsAdminModalOpen} />
    <ScrollToTopButton />
  </div>
));
HomePage.displayName = "HomePage";

const VehiclesPage = memo(({ setIsAdminModalOpen }) => (
  <>
    <Header setIsAdminModalOpen={setIsAdminModalOpen} />
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Vehicles />
      </Suspense>
    </ErrorBoundary>
    <Footer setIsAdminModalOpen={setIsAdminModalOpen} />
    <ScrollToTopButton />
  </>
));
VehiclesPage.displayName = "VehiclesPage";

const TermsPage = memo(({ setIsAdminModalOpen }) => (
  <>
    <Header setIsAdminModalOpen={setIsAdminModalOpen} />
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Terms />
      </Suspense>
    </ErrorBoundary>
    <Footer setIsAdminModalOpen={setIsAdminModalOpen} />
    <ScrollToTopButton />
  </>
));
TermsPage.displayName = "TermsPage";

const AboutPage = memo(({ setIsAdminModalOpen }) => (
  <>
    <Header setIsAdminModalOpen={setIsAdminModalOpen} />
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <About />
      </Suspense>
    </ErrorBoundary>
    <Footer setIsAdminModalOpen={setIsAdminModalOpen} />
    <ScrollToTopButton />
  </>
));
AboutPage.displayName = "AboutPage";

const AdminRoute = memo(() => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <AdminPage />
    </Suspense>
  </ErrorBoundary>
));
AdminRoute.displayName = "AdminRoute";

const useStyleFixes = () => {
  useEffect(() => {
    const fixStylingIssues = () => {
      document.body.style.background = "#000";

      const unwantedGradients = document.querySelectorAll(
        'div.bg-gradient-to-r:not(.car-glow-effect):not(.hero-book-button):not([class*="button"]):not([class*="btn"])'
      );

      unwantedGradients.forEach((el) => {
        if (
          !el.closest("button") &&
          !el.closest("header") &&
          !el.closest("footer") &&
          !el.closest("nav") &&
          !el.closest(".hero-section") &&
          !el.querySelector("button")
        ) {
          el.classList.remove("bg-gradient-to-r");
          el.classList.add("bg-gray-900");
        }
      });

      const carGlowEffects = document.querySelectorAll(".car-glow-effect");
      carGlowEffects.forEach((el) => {
        el.style.background =
          "linear-gradient(to right, rgba(249, 115, 22, 0.3), rgba(217, 119, 6, 0.3))";
        el.style.filter = "blur(24px)";
        el.style.opacity = "0.9";
      });

      const bookButtons = document.querySelectorAll(".hero-book-button");
      bookButtons.forEach((el) => {
        el.style.background = "linear-gradient(to right, #f59e0b, #d97706)";
      });
    };

    fixStylingIssues();

    const timer = setTimeout(fixStylingIssues, 500);

    const observer = new MutationObserver(fixStylingIssues);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
};

function App() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useStyleFixes();

  return (
    <Router>
      <ScrollToTop />

      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      <Routes>
        <Route path="/admin" element={<AdminRoute />} />

        <Route
          path="/vehicles"
          element={<VehiclesPage setIsAdminModalOpen={setIsAdminModalOpen} />}
        />

        <Route
          path="/terms"
          element={<TermsPage setIsAdminModalOpen={setIsAdminModalOpen} />}
        />

        <Route
          path="/about"
          element={<AboutPage setIsAdminModalOpen={setIsAdminModalOpen} />}
        />

        <Route
          path="/"
          element={<HomePage setIsAdminModalOpen={setIsAdminModalOpen} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
