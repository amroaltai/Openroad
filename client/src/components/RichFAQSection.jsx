import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";

const RichFAQSection = () => {
  // Add translation hook with "faq" namespace
  const { t } = useTranslation("faq");

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  // FAQ data with rich content targeting car rental keywords
  const faqItems = [
    {
      question: t(
        "questions.documents.question",
        "What documents do I need to rent a car in Dubai?"
      ),
      answer: t(
        "questions.documents.answer",
        "To rent a car from Open Road Car Rental in Dubai, you'll need a valid driving license (either a UAE license or an International Driving Permit alongside your home country license), a passport or Emirates ID, and a credit card for the security deposit. For tourists, an International Driving Permit (IDP) is required if your license is not in English or Arabic. The minimum age requirement is 21 years, though some luxury vehicles may require drivers to be 25 or older."
      ),
    },
    {
      question: t(
        "questions.airport.question",
        "Do you provide free delivery to Dubai International Airport (DXB)?"
      ),
      answer: t(
        "questions.airport.answer",
        "Yes, we offer complimentary 24/7 delivery and collection service to Dubai International Airport (DXB) and all other locations across Dubai. Our delivery service is available at any time, day or night, with no additional charges. We'll meet you at your terminal with your selected vehicle, handle all paperwork efficiently, and get you on your way quickly after your flight arrives."
      ),
    },
    {
      question: t(
        "questions.prices.question",
        "What is included in your car rental prices?"
      ),
      answer: t(
        "questions.prices.answer",
        "Our rental prices include comprehensive insurance coverage, unlimited mileage for most vehicles, 24/7 roadside assistance, free delivery and collection anywhere in Dubai, maintenance, and VAT. There are no hidden fees or surprise charges. Optional extras like additional drivers, child seats, or GPS navigation systems may be available at a small additional cost. We pride ourselves on transparent pricing with no unexpected charges."
      ),
    },
    {
      question: t(
        "questions.luxury.question",
        "Can I rent a luxury car in Dubai with Open Road Car Rental?"
      ),
      answer: t(
        "questions.luxury.answer",
        "Absolutely! Open Road Car Rental Dubai specializes in luxury car rentals including prestigious brands like Mercedes-Benz, BMW, Range Rover, Porsche, and many more. Our luxury fleet is regularly updated with the latest models, all meticulously maintained to ensure an exceptional driving experience. Whether you need a luxury sedan, SUV, or sports car, we offer competitive rates for both short-term and long-term luxury car rentals in Dubai."
      ),
    },
    {
      question: t(
        "questions.delivery.question",
        "How does your car delivery service work?"
      ),
      answer: t(
        "questions.delivery.answer",
        "Our free car delivery service is simple and convenient. After making your booking online or by phone, just let us know your preferred delivery location and time. Our representative will arrive at your specified location (hotel, residence, airport, etc.) with your chosen vehicle. We'll complete the necessary paperwork, explain the vehicle features, and hand over the keys. The same process applies for collection – just tell us where and when to collect the car, and we'll be there on time."
      ),
    },
    {
      question: t(
        "questions.rates.question",
        "What are your rental periods and rates?"
      ),
      answer: t(
        "questions.rates.answer",
        "We offer flexible rental periods including daily, weekly, and monthly options with significant discounts for longer rentals. Our daily rates start from AED 150 for economy cars and from AED 500 for luxury vehicles. Weekly rentals typically offer a 10-15% discount compared to daily rates, while monthly rentals provide even greater savings, often 25-30% less than the equivalent daily rate. Contact us for a custom quote based on your specific rental period requirements."
      ),
    },
    {
      question: t(
        "questions.mileage.question",
        "Is there a mileage limit on your car rentals in Dubai?"
      ),
      answer: t(
        "questions.mileage.answer",
        "Most of our rental packages come with unlimited mileage, allowing you to explore Dubai and the UAE without worrying about extra charges. For certain high-performance or exotic vehicles, a daily mileage allowance may apply (typically 250-300 km per day). If your rental has a mileage limit, this will be clearly stated in your rental agreement, and any excess kilometers will be charged at a predefined rate, which we'll explain before your rental begins."
      ),
    },
    {
      question: t(
        "questions.emirates.question",
        "Can I drive my rental car to Abu Dhabi or other Emirates?"
      ),
      answer: t(
        "questions.emirates.answer",
        "Yes, you can drive our rental cars to all seven Emirates within the UAE, including Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain. Our comprehensive insurance covers travel throughout the UAE. For trips to neighboring countries like Oman, additional documentation and insurance may be required - please inform us in advance if you plan to cross any international borders so we can provide the necessary paperwork and guidance."
      ),
    },
  ];

  // State to track which FAQ item is open
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Toggle function for FAQ items
  const toggleItem = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-orange-400">
              {t("title", "Car Rental FAQ")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-300">
              {t("subtitle", "Common questions about renting a car in Dubai")}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-800 overflow-hidden transition-all duration-300 hover:border-orange-500/30"
                data-aos="fade-up"
                data-aos-delay={`${index * 50}`}
                itemScope
                itemType="https://schema.org/Question"
              >
                <button
                  className="flex justify-between items-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 rounded-lg"
                  onClick={() => toggleItem(index)}
                  aria-expanded={expandedIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span
                    className="text-lg font-medium text-white pr-8"
                    itemProp="name"
                  >
                    {item.question}
                  </span>
                  <span className="text-orange-400 flex-shrink-0">
                    {expandedIndex === index ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </span>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <div
                    className="p-4 pt-3 border-t border-gray-800 text-gray-300"
                    itemProp="text"
                  >
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="text-center mt-8 p-6 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-lg border border-orange-500/20"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <p className="text-white">
              {t(
                "contactText",
                "Have more questions? Contact our team directly at"
              )}{" "}
              <a
                href="tel:+971563995002"
                className="text-orange-400 hover:text-orange-300 transition-colors font-medium"
              >
                +971 56 399 5002
              </a>{" "}
              {t("orVia", "or via")}{" "}
              <a
                href="https://wa.me/971563995002"
                className="text-orange-400 hover:text-orange-300 transition-colors font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Add structured data directly to the page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
};

export default RichFAQSection;
