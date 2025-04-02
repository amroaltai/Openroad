import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  useMemo,
  useRef,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronRight as ArrowRightIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const WHATSAPP_NUMBER = "+971563995002";
const MAX_CARS_TO_DISPLAY = 4; // Begränsat till 4 bilar

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const WhatsAppIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-green-500"
    aria-hidden="true"
  >
    <path d="M12.031 6.172c-3.526 0-6.388 2.742-6.388 6.115 0 1.297.388 2.543 1.103 3.621l.015.103-.445 1.767 1.824-.445.095.061c1.045.696 2.254 1.064 3.499 1.064 3.526 0 6.388-2.742 6.388-6.115 0-3.373-2.862-6.115-6.388-6.115m3.917 8.585c-.187.521-.955.977-1.363 1.046-.975.101-1.618-.475-1.752-.532-1.318-.635-2.2-1.815-2.646-2.684-.295-.575.055-1.024.232-1.221.304-.33.677-.533.842-.868.165-.335.027-.765-.246-1.46-.272-.695-.987-1.649-1.701-1.649-.365 0-.613.135-.863.4-.29.312-.726.972-.726 2.259 0 1.742 1.249 3.398 1.422 3.632.173.234 2.455 3.722 5.964 4.987.756.274 1.35.438 1.812.56.762.223 1.453.192 2 .117.642-.091 1.972-.806 2.248-1.588.276-.782.276-1.454.193-1.596-.083-.142-.307-.225-.646-.393zm-3.455-8.465c4.695 0 8.5 3.717 8.5 8.297 0 4.58-3.805 8.297-8.5 8.297-1.6 0-3.101-.45-4.402-1.224l-4.643 1.184 1.192-4.494c-.857-1.351-1.347-2.944-1.347-4.763 0-4.58 3.805-8.297 8.5-8.297m0-2c-5.79 0-10.5 4.621-10.5 10.297 0 1.857.484 3.655 1.4 5.216l-1.4 5.287 5.486-1.4c1.5 1.073 3.443 1.8 5.514 1.8 5.79 0 10.5-4.621 10.5-10.297 0-5.676-4.71-10.297-10.5-10.297z" />
  </svg>
));
WhatsAppIcon.displayName = "WhatsAppIcon";

const HorsepowerIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 mr-2 text-orange-400"
    aria-hidden="true"
  >
    <path d="M19 7c0-1.1-.9-2-2-2h-1.82l1.7-3.43a1 1 0 0 0-.46-1.34 1 1 0 0 0-1.34.45L13 6h-2l-2.08-5.32a1 1 0 0 0-1.34-.45 1 1 0 0 0-.46 1.34L8.82 5H7c-1.1 0-2 .9-2 2v2a4 4 0 0 0 4 4v8h2v-2h2v2h2v-8a4 4 0 0 0 4-4V7z" />
  </svg>
));
HorsepowerIcon.displayName = "HorsepowerIcon";

const SeatsIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 mr-2 text-orange-400"
    aria-hidden="true"
  >
    <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
    <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z" />
  </svg>
));
SeatsIcon.displayName = "SeatsIcon";

const PriceIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 mr-2 text-orange-400"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <path d="M12 18V6" />
  </svg>
));
PriceIcon.displayName = "PriceIcon";

const formatPrice = (price) => {
  if (price === null || price === undefined) return null;
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  if (Math.floor(numPrice) === numPrice) {
    return Math.floor(numPrice);
  } else {
    return numPrice.toFixed(2).replace(/\.00$/, "");
  }
};

const ImageNavButton = memo(({ direction, onClick, ariaLabel }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick(e);
    }}
    aria-label={ariaLabel}
    className={`absolute ${
      direction === "prev" ? "left-2" : "right-2"
    } top-1/2 transform -translate-y-1/2 z-30 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
    type="button"
  >
    {direction === "prev" ? (
      <ChevronLeft className="text-white w-6 h-6" />
    ) : (
      <ChevronRight className="text-white w-6 h-6" />
    )}
  </button>
));
ImageNavButton.displayName = "ImageNavButton";

const WhatsAppModal = memo(({ isOpen, onClose, car, onWhatsAppClick }) => {
  const { t } = useTranslation("carsgrid");

  // Om inte öppen, rendera ingenting för att spara resurser
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1200]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-modal-title"
    >
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          aria-label="Close dialog"
          type="button"
        >
          ✕
        </button>
        <div className="flex justify-center mb-6">
          <WhatsAppIcon />
        </div>
        <h2
          id="whatsapp-modal-title"
          className="text-2xl font-bold text-white mb-4"
        >
          {t("whatsappModal.title", "Contact Us via WhatsApp")}
        </h2>
        <p className="text-gray-400 mb-6">
          {t("whatsappModal.message", "Would you like to inquire about the")}{" "}
          {car.brand} {car.model}?
        </p>
        <button
          onClick={onWhatsAppClick}
          className="w-full bg-green-600 text-white py-3 rounded-md font-bold hover:bg-green-700 transition-colors"
          type="button"
        >
          {t("whatsappModal.startChat", "Start WhatsApp Chat")}
        </button>
      </div>
    </div>
  );
});
WhatsAppModal.displayName = "WhatsAppModal";

// Förbättrad och optimerad bildkomponent
const OptimizedCarImage = memo(({ src, alt, onError }) => {
  const [loaded, setLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Optimera bilden med Cloudinary eller andra URL
  const optimizedSrc = useMemo(() => {
    if (!src) return null;

    // Förbättrad Cloudinary-optimering
    if (src.includes("cloudinary.com")) {
      return src.replace(
        "/upload/",
        "/upload/f_auto,q_auto:good,c_fill,w_800,h_480/"
      );
    }

    return src;
  }, [src]);

  // Använd intersection observer för att ladda bilden endast när den är nära viewport
  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(imgRef.current);
        }
      },
      {
        rootMargin: "200px", // Förladda bilder när de är 200px från viewport
        threshold: 0.01, // Trigga även med minimal synlighet
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <>
      {!loaded && (
        <div
          className="w-full h-full bg-gray-800 animate-pulse absolute inset-0 z-10 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {optimizedSrc && (
        <img
          ref={imgRef}
          src={isInView ? optimizedSrc : null} // Använd null istället för tom sträng
          alt={alt || "Luxury car image"}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={onError}
          loading="lazy"
          decoding="async"
        />
      )}
    </>
  );
});
OptimizedCarImage.displayName = "OptimizedCarImage";

// Förbättrad InView hook med bättre prestanda
const useImprovedInView = (options = {}) => {
  const [inView, setInView] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Skapa en IntersectionObserver endast en gång
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            // Sluta observera när elementet har visats en gång
            if (elementRef.current && observerRef.current) {
              observerRef.current.unobserve(elementRef.current);
            }
          }
        },
        {
          threshold: 0.15, // Sätt en lägre tröskel för tidigare trigger
          rootMargin: "50px 0px", // Aktivera något tidigare än viewport
          ...options,
        }
      );
    }

    const currentElement = elementRef.current;
    const currentObserver = observerRef.current;

    if (currentElement && currentObserver) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement && currentObserver) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, []); // Töm dependencies för att skapa observer endast en gång

  return [elementRef, inView];
};

const AnimatedCarCard = memo(
  ({ car, currentImageIndex, onNavigateImage, onBookClick, index, t }) => {
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [ref, inView] = useImprovedInView();

    const carType = useMemo(
      () => car.type || t("carTypes.luxury"),
      [car.type, t]
    );

    const handlePrevImage = useCallback(
      (e) => onNavigateImage(car.id, "prev"),
      [car.id, onNavigateImage]
    );

    const handleNextImage = useCallback(
      (e) => onNavigateImage(car.id, "next"),
      [car.id, onNavigateImage]
    );

    const handleTouchStart = useCallback((e) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    }, []);

    const handleTouchMove = useCallback((e) => {
      setTouchEnd(e.targetTouches[0].clientX);
    }, []);

    const handleTouchEnd = useCallback(
      (e) => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
          onNavigateImage(car.id, "next");
        } else if (isRightSwipe) {
          onNavigateImage(car.id, "prev");
        }
      },
      [touchStart, touchEnd, car.id, onNavigateImage]
    );

    const formattedPricePerDay = car.price_per_day
      ? formatPrice(car.price_per_day)
      : null;
    const formattedPricePerWeek = car.price_per_week
      ? formatPrice(car.price_per_week)
      : null;
    const formattedPricePerMonth = car.price_per_month
      ? formatPrice(car.price_per_month)
      : null;

    const hasPrice =
      formattedPricePerDay || formattedPricePerWeek || formattedPricePerMonth;

    // Förenkla animationen med tidsfördröjningar baserat på index
    const animationDelay = `${Math.min(index * 100, 500)}ms`;

    // Förbättrade bildtitlar för SEO
    const carFullName = `${car.brand} ${car.model} ${car.year}`;
    const imageSrc =
      car[["image1", "image2", "image3"][currentImageIndex || 0]] || car.image1;
    const imageAlt = `${carFullName} - ${car.color} - Available for rent in Dubai`;

    return (
      <article
        ref={ref}
        className={`bg-gray-900/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:translate-y-[-5px] opacity-0 ${
          inView ? "animate-fade-up" : ""
        }`}
        style={{ animationDelay }}
      >
        <div
          className="relative w-full h-60 bg-gray-800 overflow-hidden group cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ImageNavButton
            direction="prev"
            onClick={handlePrevImage}
            ariaLabel={`Previous image of ${carFullName}`}
          />
          <ImageNavButton
            direction="next"
            onClick={handleNextImage}
            ariaLabel={`Next image of ${carFullName}`}
          />
          <OptimizedCarImage
            src={imageSrc}
            alt={imageAlt}
            onError={(e) => (e.target.src = "/images/placeholder.jpg")}
          />
          <div
            className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full"
            aria-hidden="true"
          >
            <span className="text-white text-sm">
              {(currentImageIndex || 0) + 1} / 3
            </span>
          </div>
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full z-20">
            <span className="text-white text-sm font-bold">{car.brand}</span>
          </div>
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full z-20">
            <span className="text-white text-sm font-medium">{carType}</span>
          </div>

          {formattedPricePerDay > 0 && (
            <div className="absolute bottom-3 right-3 bg-gradient-to-r from-orange-500/90 to-amber-500/90 backdrop-blur-sm px-3 py-1 rounded-full z-20 shadow-lg border border-orange-300/30 animate-pulse md:hidden">
              <span className="text-white text-sm font-bold">
                {t("startingFrom", "From")} {formattedPricePerDay} AED
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white transition-colors duration-300 hover:text-orange-400">
            {car.brand} {car.model}
          </h3>
          <p className="text-gray-400">{car.year}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-gray-300">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: car.color?.toLowerCase() || "#888" }}
                aria-hidden="true"
              />
              <span>{car.color || "N/A"}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <HorsepowerIcon />
              <span>{car.horsepower || 0} HP</span>
            </div>
            <div className="flex items-center text-gray-300">
              <SeatsIcon />
              <span>
                {car.seats || 0} {t("seats", "Seats")}
              </span>
            </div>

            {hasPrice && (
              <div className="mt-3 bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-4 rounded-lg border border-orange-500/20 shadow-inner">
                <div className="flex items-center mb-2">
                  <PriceIcon />
                  <h4 className="text-sm font-medium text-orange-400">
                    {t("pricingStartingFrom", "Pricing Starting From")}
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {formattedPricePerDay && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">
                        {t("daily", "Daily")}:
                      </span>
                      <span className="text-white font-medium">
                        {formattedPricePerDay} AED
                      </span>
                    </div>
                  )}
                  {formattedPricePerWeek && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">
                        {t("weekly", "Weekly")}:
                      </span>
                      <span className="text-white font-medium">
                        {formattedPricePerWeek} AED
                      </span>
                    </div>
                  )}
                  {formattedPricePerMonth && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">
                        {t("monthly", "Monthly")}:
                      </span>
                      <span className="text-white font-medium">
                        {formattedPricePerMonth} AED
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => onBookClick(car)}
            className="mt-4 w-full bg-gradient-to-r from-orange-400/60 to-amber-500/60 hover:from-orange-500/80 hover:to-amber-600/80 text-white py-3 px-4 rounded-md font-bold transition-all duration-300 border border-orange-300/30 hover:shadow-lg hover:shadow-orange-500/30"
            type="button"
          >
            {t("book", "Book")}
          </button>
        </div>
      </article>
    );
  }
);
AnimatedCarCard.displayName = "AnimatedCarCard";

const ViewMoreButton = memo(({ text }) => {
  return (
    <Link
      to="/vehicles"
      className="group flex items-center justify-center bg-gradient-to-r from-orange-400/60 to-amber-500/60 hover:from-orange-500/80 hover:to-amber-600/80 text-white font-bold py-4 px-8 rounded-md transition-all duration-300 shadow-lg hover:shadow-orange-500/30 border border-orange-300/30 hover:translate-y-[-2px] active:translate-y-[1px] max-w-md mx-auto mt-16 backdrop-blur-sm"
      aria-label="View all cars"
    >
      <span className="mr-2">{text}</span>
      <ArrowRightIcon
        size={20}
        className="transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
});
ViewMoreButton.displayName = "ViewMoreButton";

const Loader = memo(({ loadingText }) => (
  <div
    className="flex justify-center items-center h-64"
    role="status"
    aria-live="polite"
  >
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mb-4"></div>
      <div className="text-white">{loadingText}</div>
    </div>
  </div>
));
Loader.displayName = "Loader";

const ErrorMessage = memo(({ message }) => (
  <div className="flex justify-center items-center h-64" role="alert">
    <div className="bg-red-500/20 border border-red-500 text-white px-8 py-6 rounded-lg max-w-md">
      <div className="text-red-500 text-lg font-medium">{message}</div>
    </div>
  </div>
));
ErrorMessage.displayName = "ErrorMessage";

function CarsGrid() {
  const [cars, setCars] = useState([]);
  const [displayedCars, setDisplayedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImages, setCurrentImages] = useState({});
  const [selectedCar, setSelectedCar] = useState(null);
  const controllerRef = useRef(null);

  const { t } = useTranslation("carsgrid");

  // Förbättrad fetch-funktion med bättre cache-strategi och avbrytshantering
  useEffect(() => {
    // Rensa tidigare controller
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    const fetchCars = async () => {
      try {
        setLoading(true);

        // Försök använda cache först
        const cacheKey = "carsCache";
        const cacheTimestamp = sessionStorage.getItem("carsCacheTimestamp");
        const cacheData = sessionStorage.getItem(cacheKey);

        // Kontrollera att cache finns och är färsk (mindre än 10 min)
        if (
          cacheData &&
          cacheTimestamp &&
          Date.now() - parseInt(cacheTimestamp) < 600000
        ) {
          const parsedData = JSON.parse(cacheData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            const shuffledCars = shuffleArray(parsedData);
            const limitedCars = shuffledCars.slice(0, MAX_CARS_TO_DISPLAY);

            const initialImageIndices = limitedCars.reduce((acc, car) => {
              acc[car.id] = 0;
              return acc;
            }, {});

            setCars(parsedData);
            setDisplayedCars(limitedCars);
            setCurrentImages(initialImageIndices);
            setError(null);
            setLoading(false);
            return;
          }
        }

        // Annars hämta från API med förbättrade fetch-inställningar
        const response = await fetch("/api/cars", {
          headers: {
            "Cache-Control": "max-age=3600",
          },
          signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Spara i cache
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        sessionStorage.setItem("carsCacheTimestamp", Date.now().toString());

        // Förberedd data för optimerad renderings prestanda
        const shuffledCars = shuffleArray(data);
        const limitedCars = shuffledCars.slice(0, MAX_CARS_TO_DISPLAY);

        // Förberäkna bildindexar för att undvika rerendering senare
        const initialImageIndices = Object.fromEntries(
          limitedCars.map((car) => [car.id, 0])
        );

        setCars(data);
        setDisplayedCars(limitedCars);
        setCurrentImages(initialImageIndices);
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching cars:", err);
          setError(
            t("errorMessage", "Failed to load cars. Please try again later.")
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCars();

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [t]);

  const navigateCarImage = useCallback((carId, direction) => {
    setCurrentImages((prev) => {
      const currentIndex = prev[carId] || 0;
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % 3
          : (currentIndex - 1 + 3) % 3;

      // Bara uppdatera om index faktiskt ändras för att minska rerenders
      if (currentIndex === newIndex) return prev;

      return {
        ...prev,
        [carId]: newIndex,
      };
    });
  }, []);

  const handleBookClick = useCallback((car) => {
    setSelectedCar(car);
  }, []);

  const openWhatsAppChat = useCallback(() => {
    if (!selectedCar) return;

    const message = t(
      "whatsappMessage",
      "Hello! I'm interested in the {{brand}} {{model}} from your fleet.",
      {
        brand: selectedCar.brand,
        model: selectedCar.model,
      }
    );

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(
      /\s+/g,
      ""
    )}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSelectedCar(null);
  }, [selectedCar, t]);

  const closeModal = useCallback(() => {
    setSelectedCar(null);
  }, []);

  // Om laddar, visa laddningsindikator med semantisk struktur
  if (loading) {
    return (
      <section className="w-full bg-black py-12 px-4 mt-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            {t("fleetTitle", "Our Fleet")}
          </h2>
          <Loader loadingText={t("loading", "Loading vehicles...")} />
        </div>
      </section>
    );
  }

  // Vid fel, visa felmeddelande med semantisk struktur
  if (error) {
    return (
      <section className="w-full bg-black py-8 px-4 mt-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            {t("fleetTitle", "Our Fleet")}
          </h2>
          <ErrorMessage message={error} />
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        className="w-full bg-black py-12 px-4"
        aria-labelledby="fleet-title"
      >
        <div className="container mx-auto">
          <h2
            id="fleet-title"
            className="text-4xl font-bold text-white mb-3 text-center"
          >
            {t("fleetTitle", "Our Fleet")}
          </h2>
          <p className="text-gray-400 mb-10 text-center max-w-2xl mx-auto">
            {t(
              "fleetDescription",
              "Explore our premium selection of vehicles. From luxury cars to SUVs, we have the perfect vehicle for your Dubai experience."
            )}
          </p>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            role="list"
            aria-label="Available cars for rent"
          >
            {displayedCars.map((car, index) => (
              <div
                key={car.id}
                role="listitem"
                aria-label={`${car.brand} ${car.model}`}
              >
                <AnimatedCarCard
                  car={car}
                  currentImageIndex={currentImages[car.id]}
                  onNavigateImage={navigateCarImage}
                  onBookClick={handleBookClick}
                  index={index}
                  t={t}
                />
              </div>
            ))}
          </div>

          <ViewMoreButton text={t("allCars", "View All Cars")} />
        </div>
      </section>

      <WhatsAppModal
        isOpen={!!selectedCar}
        onClose={closeModal}
        car={selectedCar || {}}
        onWhatsAppClick={openWhatsAppChat}
      />
    </>
  );
}

export default CarsGrid;
