import React, { useEffect } from "react";
import {
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Award,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";

import officeInteriorImage from "../assets/kontor.png";
import officeFacadeImage from "../assets/lokal.png";

const About = () => {
  const { t, i18n } = useTranslation("about");

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  useEffect(() => {}, [i18n.language]);

  const address =
    "Ibn Al Zahrawi Street, Al Jaddaf Dubai, Azurite Tower, Shop 16";
  const phoneNumber = "+971563995002";
  const displayPhone = "056 399 5002";
  const whatsappNumber = "+971563995002";

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\s+/g, "")}`;

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="relative pt-40 md:pt-48 pb-16 md:pb-24">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-orange-400">
              {t("title", "About")} Open Road Car Rental Dubai
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              {t("subtitle", "Your premium car rental service in Dubai")}
            </p>
          </div>
        </div>
      </div>

      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1" data-aos="fade-right">
              <h2 className="text-3xl font-bold mb-6 text-orange-400">
                {t("ourStory.title", "Our Story")}
              </h2>
              <p className="text-gray-300 mb-4">
                {t(
                  "ourStory.paragraph1",
                  "Open Road Car Rental Dubai was founded with a vision to provide an unparalleled rental experience."
                )}
              </p>
              <p className="text-gray-300 mb-4">
                {t(
                  "ourStory.paragraph2",
                  "Our team consists of passionate automotive enthusiasts dedicated to delivering top-tier service."
                )}
              </p>
              <p className="text-gray-300">
                {t(
                  "ourStory.paragraph3",
                  "With a carefully curated fleet, we offer you the opportunity to explore Dubai in style and comfort."
                )}
              </p>
            </div>
            <div className="order-1 md:order-2" data-aos="fade-left">
              <div className="relative h-64 md:h-96 rounded-lg shadow-xl overflow-hidden">
                <div
                  className="absolute inset-0 from-orange-500/10 to-amber-500/10 rounded-lg bg-gray-900"
                  style={{
                    backgroundImage: `url(${officeInteriorImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl font-bold mb-16 text-center text-orange-400"
            data-aos="fade-up"
          >
            {t("whyChoose.title", "Why Choose Open Road?")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-6 border border-gray-800 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <div className="bg-orange-500/20 p-3 rounded-lg inline-block mb-4">
                <Award className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {t("whyChoose.premiumVehicles.title", "Premium Vehicles")}
              </h3>
              <p className="text-gray-300">
                {t(
                  "whyChoose.premiumVehicles.description",
                  "Our fleet consists of new, well-maintained vehicles that are regularly cleaned and serviced."
                )}
              </p>
            </div>

            <div
              className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-6 border border-gray-800 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="bg-orange-500/20 p-3 rounded-lg inline-block mb-4">
                <ThumbsUp className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {t("whyChoose.exceptionalService.title", "Exceptional Service")}
              </h3>
              <p className="text-gray-300">
                {t(
                  "whyChoose.exceptionalService.description",
                  "We provide personalized, customer-focused service with flexible rental options."
                )}
              </p>
            </div>

            <div
              className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-6 border border-gray-800 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="bg-orange-500/20 p-3 rounded-lg inline-block mb-4">
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {t("whyChoose.competitiveRates.title", "Competitive Rates")}
              </h3>
              <p className="text-gray-300">
                {t(
                  "whyChoose.competitiveRates.description",
                  "Transparent pricing with no hidden fees and competitive rates for all our premium vehicles."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div data-aos="fade-right">
              <div className="relative h-64 md:h-96 rounded-lg shadow-xl overflow-hidden">
                <div
                  className="absolute inset-0 from-orange-500/10 to-amber-500/10 rounded-lg bg-gray-900"
                  style={{
                    backgroundImage: `url(${officeFacadeImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              </div>
            </div>
            <div data-aos="fade-left">
              <h2 className="text-3xl font-bold mb-6 text-orange-400">
                {t("visitLocation.title", "Visit Our Location")}
              </h2>
              <p className="text-gray-300 mb-8">
                {t(
                  "visitLocation.description",
                  "Our convenient location in Al Jaddaf, Dubai makes it easy to pick up your premium rental car."
                )}
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="mr-3 text-orange-400 flex-shrink-0 mt-1" />
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    {address}
                  </a>
                </div>

                <div className="flex items-center">
                  <Phone className="mr-3 text-orange-400 flex-shrink-0" />
                  <a
                    href={`tel:${phoneNumber}`}
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    {displayPhone}
                  </a>
                </div>

                <div className="flex items-center">
                  <MessageSquare className="mr-3 text-orange-400 flex-shrink-0" />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    {t("whatsappSupport", "WhatsApp Support 24/7")}
                  </a>
                </div>

                <div className="flex items-center">
                  <Clock className="mr-3 text-orange-400 flex-shrink-0" />
                  <span className="text-gray-300">
                    {t("openHours", "Open daily from 9:00 AM to 9:00 PM")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div
            className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-lg p-8 text-center backdrop-blur-sm border border-orange-500/20"
            data-aos="fade-up"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              {t("readyToExperience.title", "Ready to Experience Luxury?")}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              {t(
                "readyToExperience.description",
                "Contact us today to reserve your premium vehicle and elevate your Dubai experience."
              )}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={`tel:${phoneNumber}`}
                className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold py-3 px-8 rounded-md transition-all duration-300 shadow-lg hover:shadow-orange-500/30 flex items-center justify-center"
              >
                <Phone size={18} className="mr-2" /> {t("callNow", "Call Now")}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-md transition-all duration-300 shadow-lg hover:shadow-green-500/30 flex items-center justify-center"
              >
                <MessageSquare size={18} className="mr-2" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
