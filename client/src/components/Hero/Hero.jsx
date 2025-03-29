import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import lamboImage from "../../assets/lambo3.png";
import g63Image from "../../assets/g63.png";
import rollsImage from "../../assets/rolls.png";

const WHATSAPP_NUMBER = "+971563995002";
const AUTO_ROTATE_INTERVAL = 8000;

const CARS = [
  {
    id: "lambo",
    name: "Lamborghini Huracán",
    image: lamboImage,
    description: "Naturally aspirated V10, 640 hp, incredible road feel.",
    color: "from-yellow-500 to-amber-600",
  },
  {
    id: "g63",
    name: "Mercedes-AMG G63",
    image: g63Image,
    description: "577 hp twin-turbo V8, luxury SUV with iconic design.",
    color: "from-gray-700 to-gray-900",
  },
  {
    id: "rolls",
    name: "Rolls-Royce Cullinan",
    image: rollsImage,
    description: "6.75L V12 twin-turbo, 563 hp, ultimate luxury SUV.",
    color: "from-blue-800 to-blue-900",
  },
];

const AnimatedTitle = memo(() => {
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const smokeElements = useMemo(() => {
    return [...Array(15)].map((_, i) => {
      const width = 20 + Math.random() * 40;
      const height = 20 + Math.random() * 40;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const translateY = 50 + Math.random() * 30;
      const transitionDuration = 4 + Math.random() * 3;
      const transitionDelay = Math.random() * 0.5;

      return (
        <div
          key={i}
          className="absolute rounded-full bg-orange-500/10 blur-xl"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            left: `${left}%`,
            top: `${top}%`,
            opacity: animationStarted ? 0.6 : 0,
            transform: animationStarted
              ? `translateY(-${translateY}px)`
              : "translateY(0)",
            transition: `transform ${transitionDuration}s ease-out, opacity 2s ease-in-out`,
            transitionDelay: `${transitionDelay}s`,
          }}
          aria-hidden="true"
        ></div>
      );
    });
  }, [animationStarted]);

  const titleTextStyle = {
    color: "#FF9800",
    textShadow:
      "2px 2px 0px rgba(0,0,0,0.2), 4px 4px 0px rgba(0,0,0,0.2), 6px 6px 0px rgba(0,0,0,0.2), 8px 8px 15px rgba(0,0,0,0.3), 0 0 15px rgba(255, 152, 0, 0.5)",
  };

  const subtitleTextStyle = {
    color: "#FFFFFF",
    textShadow:
      "1px 1px 0px rgba(0,0,0,0.2), 2px 2px 0px rgba(0,0,0,0.2), 3px 3px 0px rgba(0,0,0,0.2), 4px 4px 8px rgba(0,0,0,0.3)",
  };

  const locationTextStyle = {
    color: "#000000",
    textShadow: "0 0 3px rgba(255,255,255,0.9), 0 0 6px rgba(255,255,255,0.7)",
  };

  const titleAnimationStyle = useMemo(
    () => ({
      opacity: animationStarted ? 1 : 0,
      transform: animationStarted ? "translateY(0)" : "translateY(-30px)",
      transitionDelay: "0.2s",
    }),
    [animationStarted]
  );

  const subtitleAnimationStyle = useMemo(
    () => ({
      opacity: animationStarted ? 1 : 0,
      transform: animationStarted ? "translateY(0)" : "translateY(-30px)",
      transitionDelay: "0.7s",
    }),
    [animationStarted]
  );

  const locationAnimationStyle = useMemo(
    () => ({
      opacity: animationStarted ? 1 : 0,
      transform: animationStarted ? "translateY(0)" : "translateY(-30px)",
      transitionDelay: "1.2s",
    }),
    [animationStarted]
  );

  return (
    <div className="w-full flex justify-center items-center py-4">
      <div className="absolute top-0 left-0 w-full h-40 overflow-hidden pointer-events-none">
        {smokeElements}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div
          className="transform transition-all duration-1000 ease-out mb-1"
          style={titleAnimationStyle}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-center font-sans tracking-wider">
            <span style={titleTextStyle}>OPEN ROAD</span>
          </h1>
        </div>

        <div
          className="transform transition-all duration-1000 ease-out"
          style={subtitleAnimationStyle}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center font-sans tracking-wide">
            <span style={subtitleTextStyle}>CAR RENTAL</span>
          </h2>
        </div>

        <div
          className="transform transition-all duration-1000 ease-out mt-1"
          style={locationAnimationStyle}
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center font-sans tracking-wide">
            <span style={locationTextStyle}>DUBAI</span>
          </h3>
        </div>
      </div>
    </div>
  );
});
AnimatedTitle.displayName = "AnimatedTitle";

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

const WhatsAppModal = memo(({ isOpen, onClose, carName, onWhatsAppClick }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-full p-1"
          aria-label="Close modal"
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
          Contact Us via WhatsApp
        </h2>

        <p className="text-gray-400 mb-6">
          Would you like to inquire about the {carName}?
        </p>

        <button
          onClick={onWhatsAppClick}
          className="w-full bg-green-600 text-white py-3 rounded-md font-bold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Start WhatsApp Chat
        </button>
      </div>
    </div>
  );
});
WhatsAppModal.displayName = "WhatsAppModal";

const CarSlide = memo(({ car, isActive, onBookClick }) => {
  const slideClassName = `absolute inset-0 transition-all ease-in-out duration-1500 flex items-center justify-center ${
    isActive ? "opacity-100" : "opacity-0 pointer-events-none"
  }`;

  const slideStyle = {
    transitionDuration: "1500ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    willChange: "opacity",
    paddingTop: "2rem",
  };

  const glowStyle = {
    willChange: "transform",
    bottom: "auto",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -60%)",
    background:
      "linear-gradient(to right, rgba(249, 115, 22, 0.3), rgba(217, 119, 6, 0.3))",
    filter: "blur(24px)",
    opacity: 0.9,
  };

  return (
    <div
      className={slideClassName}
      style={slideStyle}
      role="group"
      aria-hidden={!isActive}
    >
      <div
        className="car-glow-effect absolute w-3/4 md:w-full max-w-xl md:max-w-3xl h-[40vh] md:h-[60vh] rounded-full z-10 transform transition-all duration-1000 ease-in-out"
        style={glowStyle}
        aria-hidden="true"
      ></div>

      <div className="w-full h-full flex items-center justify-center relative z-20 px-4">
        <img
          src={car.image}
          alt={car.name}
          className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-3xl max-h-[60vh] md:max-h-[70vh] object-contain md:mt-10"
          style={{ willChange: "transform" }}
          loading={isActive ? "eager" : "lazy"}
        />
      </div>
    </div>
  );
});
CarSlide.displayName = "CarSlide";

const NavDot = memo(({ isActive, index, onClick, carName }) => {
  const className = `w-3 h-3 rounded-full transition-all duration-300 ${
    isActive ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
  }`;

  const style = {
    backgroundColor: isActive ? "white" : "rgba(255,255,255,0.4)",
    border: "none",
    outline: "none",
    boxShadow: "none",
  };

  return (
    <button
      onClick={onClick}
      className={className}
      style={style}
      aria-label={`Show ${carName}`}
      aria-pressed={isActive}
      aria-current={isActive ? "true" : "false"}
    />
  );
});
NavDot.displayName = "NavDot";

function useImagePreloader(images) {
  useEffect(() => {
    const preloadImages = () => {
      images.forEach((imageUrl) => {
        const img = new Image();
        img.src = imageUrl;
      });
    };
    preloadImages();
  }, [images]);
}

function Hero() {
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [selectedCar, setSelectedCar] = useState(null);

  const carImages = useMemo(() => CARS.map((car) => car.image), []);
  useImagePreloader(carImages);

  const currentCar = useMemo(() => CARS[currentCarIndex], [currentCarIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCarIndex((prevIndex) => (prevIndex + 1) % CARS.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const handleBookClick = useCallback((car) => {
    setSelectedCar(car);
  }, []);

  const handleNavDotClick = useCallback((index) => {
    setCurrentCarIndex(index);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCar(null);
  }, []);

  const openWhatsAppChat = useCallback(() => {
    if (!selectedCar) return;
    const message = `Hello! I'm interested in the ${selectedCar.name} from your fleet.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(
      /\s+/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSelectedCar(null);
  }, [selectedCar]);

  const navDots = useMemo(
    () =>
      CARS.map((car, index) => (
        <NavDot
          key={car.id}
          index={index}
          carName={car.name}
          isActive={index === currentCarIndex}
          onClick={() => handleNavDotClick(index)}
        />
      )),
    [currentCarIndex, handleNavDotClick]
  );

  return (
    <div
      className="w-full"
      style={{ marginTop: "20px", marginBottom: "-20px" }}
    >
      <section
        className="w-full relative bg-transparent h-[90vh] md:h-screen"
        aria-label="Featured luxury cars"
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 z-10"
          aria-hidden="true"
        ></div>

        <div className="absolute top-32 md:top-40 left-0 right-0 z-40">
          <AnimatedTitle />
        </div>

        {CARS.map((car, index) => (
          <CarSlide
            key={car.id}
            car={car}
            isActive={index === currentCarIndex}
            onBookClick={handleBookClick}
          />
        ))}

        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4">
          <div className="container mx-auto">
            <div className="max-w-lg mx-auto text-center">
              <div
                className="mb-8 transition-all duration-1000 transform translate-y-0 mt-[40vh] md:mt-[50vh]"
                style={{ transitionDuration: "1000ms" }}
                aria-live="polite"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-4 text-white animate-fadeIn">
                  {currentCar.name}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-4 md:mb-8 animate-fadeIn animation-delay-300">
                  {currentCar.description}
                </p>

                <div className="flex justify-center">
                  <button
                    onClick={() => handleBookClick(currentCar)}
                    className="hero-book-button bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold py-3 px-8 rounded-md hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                    style={{
                      background: "linear-gradient(to right, #f59e0b, #d97706)",
                    }}
                    aria-label={`Book ${currentCar.name}`}
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <div
                className="flex space-x-2"
                role="tablist"
                aria-label="Car navigation"
              >
                {navDots}
              </div>
            </div>
          </div>
        </div>

        <WhatsAppModal
          isOpen={!!selectedCar}
          onClose={handleCloseModal}
          carName={selectedCar?.name || ""}
          onWhatsAppClick={openWhatsAppChat}
        />

        <style jsx="true">{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }

          .animation-delay-300 {
            animation-delay: 0.2s;
          }

          .duration-2000 {
            transition-duration: 1500ms;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>
      </section>
    </div>
  );
}

export default Hero;
