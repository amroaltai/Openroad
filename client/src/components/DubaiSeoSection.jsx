import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight, ThumbsUp, Shield, Clock, MapPin } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const DubaiSeoSection = () => {
  // Add "dubai" namespace
  const { t } = useTranslation("dubai");

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  return (
    <section className="py-16 bg-black relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-orange-500/30 to-amber-500/30 blur-[100px] transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 blur-[100px] transform translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-orange-400">
            {t("title", "Premier Car Rental Service in Dubai")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            {t(
              "subtitle",
              "Experience the ultimate luxury and economy car rental service in Dubai with free 24/7 delivery"
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div
            className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-800 hover:border-orange-500/30 transition-all duration-300"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <h3 className="text-2xl font-bold mb-4 text-white">
              {t("luxurySection.title", "Luxury & Economy Car Rental in Dubai")}
            </h3>
            <p className="text-gray-300 mb-4">
              {t(
                "luxurySection.paragraph1",
                "At Open Road Car Rental Dubai, we offer an exceptional fleet of vehicles catering to all preferences and budgets. Whether you're seeking a prestigious luxury car for a special occasion or a reliable economy vehicle for daily commuting, our diverse selection ensures we have the perfect car for your Dubai adventure."
              )}
            </p>
            <p className="text-gray-300 mb-4">
              {t(
                "luxurySection.paragraph2",
                "Our premium fleet includes top brands like Mercedes-Benz, BMW, Range Rover, and Lamborghini, all maintained to the highest standards. For budget-conscious travelers, we provide economical options without compromising on quality or comfort."
              )}
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <ChevronRight
                  className="text-orange-400 mt-1 flex-shrink-0"
                  size={16}
                />
                <span className="text-gray-300">
                  {t(
                    "luxurySection.benefits.insurance",
                    "Comprehensive insurance included in all rentals"
                  )}
                </span>
              </li>
              <li className="flex items-start">
                <ChevronRight
                  className="text-orange-400 mt-1 flex-shrink-0"
                  size={16}
                />
                <span className="text-gray-300">
                  {t(
                    "luxurySection.benefits.rates",
                    "Competitive daily, weekly, and monthly rates"
                  )}
                </span>
              </li>
              <li className="flex items-start">
                <ChevronRight
                  className="text-orange-400 mt-1 flex-shrink-0"
                  size={16}
                />
                <span className="text-gray-300">
                  {t(
                    "luxurySection.benefits.noFees",
                    "No hidden fees or surprise charges"
                  )}
                </span>
              </li>
            </ul>
          </div>

          <div
            className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-800 hover:border-orange-500/30 transition-all duration-300"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <h3 className="text-2xl font-bold mb-4 text-white">
              {t(
                "deliverySection.title",
                "Free Delivery Anywhere in Dubai, 24/7"
              )}
            </h3>
            <p className="text-gray-300 mb-4">
              {t(
                "deliverySection.paragraph1",
                "We understand the importance of convenience when renting a car in Dubai. That's why we offer complimentary vehicle delivery and collection services to any location in Dubai, available 24 hours a day, 7 days a week."
              )}
            </p>
            <p className="text-gray-300 mb-4">
              {t(
                "deliverySection.paragraph2",
                "Whether you need a car delivered to Dubai International Airport upon your arrival, to your hotel, residence, or any other location in the city, our professional team will ensure a smooth and timely delivery experience at no extra cost."
              )}
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <ChevronRight
                  className="text-orange-400 mt-1 flex-shrink-0"
                  size={16}
                />
                <span className="text-gray-300">
                  {t(
                    "deliverySection.benefits.airport",
                    "Airport deliveries to DXB and Al Maktoum"
                  )}
                </span>
              </li>
              <li className="flex items-start">
                <ChevronRight
                  className="text-orange-400 mt-1 flex-shrink-0"
                  size={16}
                />
                <span className="text-gray-300">
                  {t(
                    "deliverySection.benefits.hotels",
                    "Hotel and residence deliveries throughout Dubai"
                  )}
                </span>
              </li>
              <li className="flex items-start">
                <ChevronRight
                  className="text-orange-400 mt-1 flex-shrink-0"
                  size={16}
                />
                <span className="text-gray-300">
                  {t(
                    "deliverySection.benefits.service",
                    "Punctual service with minimal paperwork"
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="bg-gray-900/60 p-5 rounded-lg text-center border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
            <div className="bg-orange-500/20 p-3 rounded-full inline-block mb-3">
              <ThumbsUp className="w-6 h-6 text-orange-500" />
            </div>
            <h4 className="text-lg font-bold mb-2 text-white">
              {t("features.service.title", "Top-Rated Service")}
            </h4>
            <p className="text-gray-400 text-sm">
              {t(
                "features.service.description",
                "Highly rated on Google with exceptional customer feedback"
              )}
            </p>
          </div>

          <div className="bg-gray-900/60 p-5 rounded-lg text-center border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
            <div className="bg-orange-500/20 p-3 rounded-full inline-block mb-3">
              <Shield className="w-6 h-6 text-orange-500" />
            </div>
            <h4 className="text-lg font-bold mb-2 text-white">
              {t("features.insurance.title", "Full Insurance")}
            </h4>
            <p className="text-gray-400 text-sm">
              {t(
                "features.insurance.description",
                "Comprehensive coverage included with all rentals"
              )}
            </p>
          </div>

          <div className="bg-gray-900/60 p-5 rounded-lg text-center border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
            <div className="bg-orange-500/20 p-3 rounded-full inline-block mb-3">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <h4 className="text-lg font-bold mb-2 text-white">
              {t("features.terms.title", "Flexible Terms")}
            </h4>
            <p className="text-gray-400 text-sm">
              {t(
                "features.terms.description",
                "Daily, weekly, and monthly rental options available"
              )}
            </p>
          </div>

          <div className="bg-gray-900/60 p-5 rounded-lg text-center border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
            <div className="bg-orange-500/20 p-3 rounded-full inline-block mb-3">
              <MapPin className="w-6 h-6 text-orange-500" />
            </div>
            <h4 className="text-lg font-bold mb-2 text-white">
              {t("features.location.title", "Central Location")}
            </h4>
            <p className="text-gray-400 text-sm">
              {t(
                "features.location.description",
                "Conveniently located in Al Jaddaf, Dubai"
              )}
            </p>
          </div>
        </div>

        <div
          className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-lg p-6 border border-orange-500/20"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <h3 className="text-2xl font-bold mb-4 text-white text-center">
            {t("exploreSection.title", "Explore Dubai in Style and Comfort")}
          </h3>
          <p className="text-gray-300 mb-4">
            {t(
              "exploreSection.paragraph1",
              "Dubai is a city of wonders, from the towering Burj Khalifa to the pristine beaches of Jumeirah, from the historic charm of Al Fahidi to the futuristic allure of Dubai Marina. The best way to experience all these attractions at your own pace is with a quality rental car from Open Road Car Rental."
            )}
          </p>
          <p className="text-gray-300">
            {t(
              "exploreSection.paragraph2",
              "Our vehicles are perfect for navigating Dubai's well-maintained roads, allowing you to enjoy the city's iconic landmarks, shopping destinations, and culinary experiences with maximum convenience and comfort. Whether you're visiting for business or leisure, our fleet has the perfect vehicle to enhance your Dubai experience."
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DubaiSeoSection;
