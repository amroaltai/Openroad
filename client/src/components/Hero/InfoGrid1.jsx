import React, {
  useState,
  useEffect,
  useRef,
  memo,
  useCallback,
  useMemo,
} from "react";
import { Car, Key, MapPin, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const InfoIcon = memo(({ type }) => {
  const iconProps = {
    size: 32,
    className: "text-orange-400",
    "aria-hidden": "true",
  };

  switch (type) {
    case "key":
      return <Key {...iconProps} />;
    case "car":
      return <Car {...iconProps} />;
    case "map":
      return <MapPin {...iconProps} />;
    case "shield":
      return <Shield {...iconProps} />;
    default:
      return null;
  }
});
InfoIcon.displayName = "InfoIcon";

const ExpandChevron = memo(({ isExpanded }) => {
  return isExpanded ? (
    <ChevronUp size={24} aria-hidden="true" />
  ) : (
    <ChevronDown size={24} aria-hidden="true" />
  );
});
ExpandChevron.displayName = "ExpandChevron";

const INFO_ITEMS = [
  {
    id: "delivery",
    iconType: "key",
    title: "24/7 Delivery",
    description: "Available anytime, anywhere",
    expandedContent:
      "Our round-the-clock delivery service is FREE and ensures you can rent your dream car whenever and wherever you want. Whether it's early morning or late at night, we're always ready to serve you with prompt and efficient vehicle delivery across Dubai.",
  },
  {
    id: "fleet",
    iconType: "car",
    title: "50+ Cars",
    description: "Premium selection of vehicles",
    expandedContent:
      "Choose from our extensive fleet of over 50 premium vehicles. From luxurious SUVs to high-performance sports cars, we offer a diverse range of top-tier vehicles to match your style, occasion, and preferences.",
  },
  {
    id: "location",
    iconType: "map",
    title: "Ibn Al Zahrawi Street, Al Jaddaf",
    description: "Azurite Tower, Shop 16",
    expandedContent:
      "Visit us at Ibn Al Zahrawi Street, Al Jaddaf Dubai, Azurite Tower, Shop 16. Our convenient location provides easy access from various parts of the city, ensuring less travel time for you and more time enjoying your premium rental experience.",
  },
  {
    id: "security",
    iconType: "shield",
    title: "100% Secure",
    description: "Safe and reliable service",
    expandedContent:
      "We prioritize your safety with comprehensive insurance, rigorous vehicle maintenance, and secure transaction processes. Our commitment to security ensures you can rent with complete peace of mind and enjoy a worry-free luxury car experience.",
  },
];

const TranslatedText = memo(({ namespace, fallback, textKey }) => {
  const { t } = useTranslation("infogrid");
  const fullKey = `${namespace}.${textKey}`;
  const translated = t(fullKey);

  return translated !== fullKey ? translated : fallback;
});
TranslatedText.displayName = "TranslatedText";

const InfoItem = memo(({ item, index, expandedIndex, toggleExpand }) => {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef(null);
  const isExpanded = expandedIndex === index;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    const currentRef = itemRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleToggle = useCallback(() => {
    toggleExpand(index);
  }, [toggleExpand, index]);

  const animationStyle = useMemo(
    () => ({
      transitionDelay: `${index * 100}ms`,
    }),
    [index]
  );

  return (
    <div
      ref={itemRef}
      className={`relative flex flex-col items-center text-center bg-black/70 backdrop-blur-sm p-6 rounded-lg border border-gray-800 transition-all duration-300 
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      ${
        isExpanded
          ? "scale-105 shadow-lg shadow-orange-500/10 relative z-30"
          : "hover:scale-105 hover:shadow-lg hover:shadow-orange-500/10"
      }`}
      style={animationStyle}
      tabIndex={isExpanded ? 0 : -1}
    >
      <div className="mb-4 bg-black/40 p-4 rounded-full">
        <InfoIcon type={item.iconType} />
      </div>

      {isExpanded ? (
        <div className="animate-slideDown w-full">
          <h3 className="text-white text-lg font-bold mb-2 leading-snug">
            <TranslatedText
              namespace={item.id}
              textKey="title"
              fallback={item.title}
            />
          </h3>
          <div className="text-gray-300 text-sm mb-4 leading-relaxed font-normal">
            <TranslatedText
              namespace={item.id}
              textKey="expandedContent"
              fallback={item.expandedContent}
            />
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-white text-lg font-bold mb-2 leading-snug">
            <TranslatedText
              namespace={item.id}
              textKey="title"
              fallback={item.title}
            />
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed font-normal">
            <TranslatedText
              namespace={item.id}
              textKey="description"
              fallback={item.description}
            />
          </p>
        </>
      )}

      <div className="mt-4 pt-2 w-full flex justify-center">
        <button
          onClick={handleToggle}
          className="text-orange-400 hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 rounded-full p-1"
          aria-expanded={isExpanded}
          aria-label={
            isExpanded
              ? `Collapse information about ${item.title}`
              : `Expand information about ${item.title}`
          }
        >
          <ExpandChevron isExpanded={isExpanded} />
        </button>
      </div>
    </div>
  );
});
InfoItem.displayName = "InfoItem";

const Animations = () => (
  <style jsx="true">{`
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-slideDown {
      animation: slideDown 0.3s ease-out forwards;
    }
  `}</style>
);
Animations.displayName = "Animations";

function InfoGrid() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const { i18n } = useTranslation("infogrid");

  const toggleExpand = useCallback((index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  }, []);

  const gridItems = useMemo(
    () =>
      INFO_ITEMS.map((item, index) => (
        <InfoItem
          key={item.id}
          item={item}
          index={index}
          expandedIndex={expandedIndex}
          toggleExpand={toggleExpand}
        />
      )),
    [expandedIndex, toggleExpand]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (expandedIndex !== null) {
        if (e.key === "Escape") {
          setExpandedIndex(null);
        }
      }
    },
    [expandedIndex]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <section
      className="w-full bg-black py-6 px-4 relative z-20 mb-8"
      aria-label="Company highlights and features"
    >
      <div className="container mx-auto">
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4"
          role="list"
        >
          {gridItems}
        </div>
      </div>

      <Animations />
    </section>
  );
}

export default InfoGrid;
