import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  useMemo,
  useRef,
} from "react";
import Header from "../components/Header/Header";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
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
  >
    <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
    <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z" />
  </svg>
));
SeatsIcon.displayName = "SeatsIcon";

const WhatsAppModal = memo(({ isOpen, onClose, car, onWhatsAppClick }) => {
  const { t } = useTranslation("vehicles");
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
          {t("whatsappModal.title", "Contact Us via WhatsApp")}
        </h2>
        <p className="text-gray-400 mb-6">
          {t("whatsappModal.message", "Would you like to inquire about the")}{" "}
          {car.brand} {car.model}?
        </p>
        <button
          onClick={onWhatsAppClick}
          className="w-full bg-green-600 text-white py-3 rounded-md font-bold hover:bg-green-700 transition-colors"
        >
          {t("whatsappModal.startChat", "Start WhatsApp Chat")}
        </button>
      </div>
    </div>
  );
});
WhatsAppModal.displayName = "WhatsAppModal";

const Pagination = memo(
  ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalItems <= itemsPerPage) return null;
    const handlePageChange = useCallback(
      (newPage) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentPage(newPage);
      },
      [setCurrentPage]
    );
    const pageNumbers = useMemo(() => {
      const pages = [1];
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      )
        pages.push(i);
      if (totalPages > 1) pages.push(totalPages);
      return [...new Set(pages)];
    }, [currentPage, totalPages]);
    return (
      <div className="flex justify-center items-center space-x-2 mt-12 pb-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={`px-3 py-2 rounded-md transition-all duration-300 flex items-center ${
            currentPage === 1
              ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-700 text-white"
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex space-x-1">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                currentPage === page
                  ? "bg-gradient-to-r from-orange-400/80 to-amber-500/80 text-white font-bold shadow-md"
                  : "bg-gray-800 hover:bg-gray-700 text-white"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className={`px-3 py-2 rounded-md transition-all duration-300 flex items-center ${
            currentPage === totalPages
              ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-700 text-white"
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  }
);
Pagination.displayName = "Pagination";

const ScrollToTopButton = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.pageYOffset > 300);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  const scrollToTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: "smooth" }),
    []
  );
  return (
    <button
      className={`fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 shadow-lg flex items-center justify-center transform transition-all duration-300 z-30 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ChevronUp className="text-white w-6 h-6" />
    </button>
  );
});
ScrollToTopButton.displayName = "ScrollToTopButton";

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
  >
    {direction === "prev" ? (
      <ChevronLeft className="text-white w-6 h-6" />
    ) : (
      <ChevronRight className="text-white w-6 h-6" />
    )}
  </button>
));
ImageNavButton.displayName = "ImageNavButton";

const CarCard = memo(
  ({
    car,
    currentImageIndex,
    getImageUrl,
    getCurrentCarImage,
    navigateCarImage,
    handleBookClick,
    handleEnlargeImage,
    t,
  }) => {
    const carType = useMemo(
      () => car.type || t("carTypes.luxury"),
      [car.type, t]
    );
    const handlePrevImage = useCallback(
      (e) => navigateCarImage(e, car.id, "prev"),
      [navigateCarImage, car.id]
    );
    const handleNextImage = useCallback(
      (e) => navigateCarImage(e, car.id, "next"),
      [navigateCarImage, car.id]
    );
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:translate-y-[-5px]">
        <div
          className="relative w-full h-60 bg-gray-800 overflow-hidden group cursor-pointer"
          onClick={() =>
            window.innerWidth >= 768 &&
            handleEnlargeImage(car.id, currentImageIndex)
          }
        >
          <ImageNavButton
            direction="prev"
            onClick={handlePrevImage}
            ariaLabel={`Previous image of ${car.brand} ${car.model}`}
          />
          <ImageNavButton
            direction="next"
            onClick={handleNextImage}
            ariaLabel={`Next image of ${car.brand} ${car.model}`}
          />
          <img
            src={getImageUrl(getCurrentCarImage(car))}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            onError={(e) => (e.target.src = "/images/placeholder.jpg")}
          />
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
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
          </div>
          <button
            onClick={() => handleBookClick(car)}
            className="mt-4 w-full bg-gradient-to-r from-orange-400/60 to-amber-500/60 hover:from-orange-500/80 hover:to-amber-600/80 text-white py-3 px-4 rounded-md font-bold transition-all duration-300 border border-orange-300/30 hover:shadow-lg hover:shadow-orange-500/30"
          >
            {t("book", "Book")}
          </button>
        </div>
      </div>
    );
  }
);
CarCard.displayName = "CarCard";

const TypeFilterButton = memo(({ type, selectedType, onClick, t }) => {
  const translatedType = useMemo(
    () =>
      type === "all"
        ? t("carTypes.allTypes")
        : t(`carTypes.${type.toLowerCase()}`),
    [type, t]
  );
  return (
    <button
      onClick={() => onClick(type)}
      className={`px-3 py-2 rounded-md text-sm whitespace-nowrap transition-all ${
        selectedType === type
          ? "bg-orange-500 text-white"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
      }`}
    >
      {translatedType}
    </button>
  );
});
TypeFilterButton.displayName = "TypeFilterButton";

const CAR_TYPES = ["all", "SUV", "Sport", "Luxury", "Convertible", "Economy"];

const BrandDropdown = memo(
  ({
    selectedBrand,
    brands,
    setSelectedBrand,
    filterMenuOpen,
    setFilterMenuOpen,
    t,
  }) => {
    const toggleDropdown = useCallback(
      (e) => {
        e.stopPropagation();
        setFilterMenuOpen(!filterMenuOpen);
      },
      [filterMenuOpen, setFilterMenuOpen]
    );
    const selectBrand = useCallback(
      (brand) => {
        setSelectedBrand(brand);
        setTimeout(() => setFilterMenuOpen(false), 50);
      },
      [setSelectedBrand, setFilterMenuOpen]
    );
    return (
      <div className="w-full md:w-auto relative z-[100]">
        <button
          onClick={toggleDropdown}
          className="w-full md:w-auto bg-gray-900/60 text-white border border-orange-500/30 rounded-md px-6 py-3 pr-12 flex justify-between items-center cursor-pointer"
          aria-haspopup="listbox"
          aria-expanded={filterMenuOpen}
        >
          <span>
            {selectedBrand === "all"
              ? t("filters.allBrands", "All Brands")
              : selectedBrand}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-orange-500 transition-transform ${
              filterMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {filterMenuOpen && (
          <div
            className="absolute mt-1 w-full bg-gray-900/90 border border-orange-500/30 rounded-md shadow-lg py-1 max-h-60 overflow-auto"
            role="listbox"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => selectBrand("all")}
              className={`w-full text-left px-4 py-2 cursor-pointer ${
                selectedBrand === "all"
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-white hover:bg-gray-800"
              }`}
              role="option"
              aria-selected={selectedBrand === "all"}
            >
              {t("filters.allBrands", "All Brands")}
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => selectBrand(brand)}
                className={`w-full text-left px-4 py-2 cursor-pointer ${
                  selectedBrand === brand
                    ? "bg-orange-500/20 text-orange-400"
                    : "text-white hover:bg-gray-800"
                }`}
                role="option"
                aria-selected={selectedBrand === brand}
              >
                {brand}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);
BrandDropdown.displayName = "BrandDropdown";

const EnlargedImageModal = memo(
  ({ car, initialImageIndex, onClose, getImageUrl }) => {
    const images = useMemo(
      () => [car.image1, car.image2, car.image3].filter((img) => img),
      [car]
    );
    const [currentIndex, setCurrentIndex] = useState(
      Math.min(initialImageIndex, images.length - 1)
    );
    useEffect(
      () => setCurrentIndex(Math.min(initialImageIndex, images.length - 1)),
      [initialImageIndex, images.length]
    );
    const handlePrev = () =>
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    const handleNext = () =>
      setCurrentIndex((prev) => (prev + 1) % images.length);
    if (!car) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[1300]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-50"
        >
          &times;
        </button>
        <div className="relative max-w-90vw max-h-90vh flex items-center justify-center">
          <img
            src={getImageUrl(images[currentIndex])}
            alt={`Enlarged ${car.brand} ${car.model}`}
            className="max-w-full max-h-full object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
);
EnlargedImageModal.displayName = "EnlargedImageModal";

const Vehicles = memo(() => {
  const { t, i18n } = useTranslation("vehicles");
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [brands, setBrands] = useState([]);
  const [currentImages, setCurrentImages] = useState({});
  const [selectedCar, setSelectedCar] = useState(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const itemsPerPage = 20;
  const API_BASE_URL = useMemo(
    () =>
      process.env.NODE_ENV === "production" ? "" : "http://localhost:5000",
    []
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterMenuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setFilterMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, true);
  }, [filterMenuOpen]);

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cars`);
      if (!response.ok) throw new Error("Failed to fetch cars");
      const data = await response.json();
      setCars(data);
      setFilteredCars(data);
      setBrands([...new Set(data.map((car) => car.brand))].sort());
      setCurrentImages(
        data.reduce((acc, car) => ({ ...acc, [car.id]: 0 }), {})
      );
    } catch (err) {
      setError(t("errors.fetchFailed", "Failed to load cars"));
      console.error("Error fetching cars:", err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, t]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  useEffect(() => {
    let filtered = [...cars];
    if (selectedBrand !== "all")
      filtered = filtered.filter((car) => car.brand === selectedBrand);
    if (selectedType !== "all")
      filtered = filtered.filter(
        (car) => car.type?.toLowerCase() === selectedType.toLowerCase()
      );
    setFilteredCars(filtered);
    setCurrentPage(1);
  }, [selectedBrand, selectedType, cars]);

  const currentCars = useMemo(
    () =>
      filteredCars.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [currentPage, filteredCars, itemsPerPage]
  );

  const getImageUrl = useCallback(
    (url) => (url?.startsWith("http") ? url : `${API_BASE_URL}${url}`),
    [API_BASE_URL]
  );

  const navigateCarImage = useCallback((e, carId, direction) => {
    e.stopPropagation();
    setCurrentImages((prev) => ({
      ...prev,
      [carId]: (prev[carId] + (direction === "next" ? 1 : -1 + 3)) % 3,
    }));
  }, []);

  const getCurrentCarImage = useCallback(
    (car) =>
      car[["image1", "image2", "image3"][currentImages[car.id] || 0]] ||
      car.image1,
    [currentImages]
  );

  const handleBookClick = useCallback((car) => setSelectedCar(car), []);
  const handleCloseModal = useCallback(() => setSelectedCar(null), []);

  const handleWhatsAppClick = useCallback(() => {
    if (!selectedCar) return;
    const message = t(
      "whatsappMessage",
      "Hello! I'm interested in the {{brand}} {{model}}",
      { brand: selectedCar.brand, model: selectedCar.model }
    );
    window.open(
      `https://wa.me/+971563995002?text=${encodeURIComponent(message)}`
    );
    setSelectedCar(null);
  }, [selectedCar, t]);

  const handleEnlargeImage = useCallback((carId, imageIndex) => {
    if (window.innerWidth >= 768) setEnlargedImage({ carId, imageIndex });
  }, []);

  const filterStateText = useMemo(() => {
    let text = "";
    if (selectedBrand !== "all")
      text += ` (${t("filteredBy", "filtered by")} ${selectedBrand})`;
    if (selectedType !== "all")
      text += ` (${t("filteredBy", "filtered by")} ${t(
        `carTypes.${selectedType.toLowerCase()}`
      )})`;
    return text;
  }, [selectedBrand, selectedType, t]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-grow pt-48 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap gap-4 justify-between items-start">
              <h1 className="text-4xl font-bold">
                {t("title", "Our Vehicles")}
              </h1>
              <div ref={dropdownRef}>
                <BrandDropdown
                  selectedBrand={selectedBrand}
                  brands={brands}
                  setSelectedBrand={setSelectedBrand}
                  filterMenuOpen={filterMenuOpen}
                  setFilterMenuOpen={setFilterMenuOpen}
                  t={t}
                />
              </div>
            </div>
            <div className="overflow-x-auto pb-2 z-[90]">
              <div className="flex gap-2 min-w-max vehicle-filters-area">
                {CAR_TYPES.map((type) => (
                  <TypeFilterButton
                    key={type}
                    type={type}
                    selectedType={selectedType}
                    onClick={setSelectedType}
                    t={t}
                  />
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div
              className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded mb-6"
              role="alert"
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500" />
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">
                {t(
                  "noVehiclesAvailable",
                  "No vehicles available with the selected criteria."
                )}
              </p>
            </div>
          ) : (
            <>
              <div className="text-gray-400 mb-6">
                {t(
                  "showingVehicles",
                  "Showing {{count}} of {{total}} vehicles",
                  { count: currentCars.length, total: filteredCars.length }
                )}{" "}
                {filterStateText}
              </div>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                aria-live="polite"
              >
                {currentCars.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    currentImageIndex={currentImages[car.id]}
                    getImageUrl={getImageUrl}
                    getCurrentCarImage={getCurrentCarImage}
                    navigateCarImage={navigateCarImage}
                    handleBookClick={handleBookClick}
                    handleEnlargeImage={handleEnlargeImage}
                    t={t}
                  />
                ))}
              </div>
              <Pagination
                totalItems={filteredCars.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </div>
      </main>

      <ScrollToTopButton />
      <WhatsAppModal
        isOpen={!!selectedCar}
        onClose={handleCloseModal}
        car={selectedCar || {}}
        onWhatsAppClick={handleWhatsAppClick}
      />
      {enlargedImage && (
        <EnlargedImageModal
          car={cars.find((c) => c.id === enlargedImage.carId)}
          initialImageIndex={enlargedImage.imageIndex}
          onClose={() => setEnlargedImage(null)}
          getImageUrl={getImageUrl}
        />
      )}
    </div>
  );
});

Vehicles.displayName = "Vehicles";
export default Vehicles;
