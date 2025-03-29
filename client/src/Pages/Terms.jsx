import React, { useEffect } from "react";
import {
  FileText,
  CreditCard,
  Car,
  Clock,
  MapPin,
  User,
  Plane,
  Check,
} from "lucide-react";
import { useTranslation } from "react-i18next";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught error:", error);
    console.error("Error info:", errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

const FeatureCard = ({ icon: Icon, title, children }) => {
  return (
    <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-6 border border-gray-800 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
      <div className="flex items-center mb-4">
        <div className="bg-orange-500/20 p-3 rounded-lg mr-4">
          <Icon className="w-6 h-6 text-orange-500" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="text-gray-300">{children}</div>
    </div>
  );
};

const DocumentItem = ({ icon: Icon, text }) => {
  return (
    <div className="flex items-center py-2">
      <div className="bg-orange-500/10 p-2 rounded-full mr-3">
        <Icon className="w-5 h-5 text-orange-400" />
      </div>
      <span className="text-gray-300">{text}</span>
    </div>
  );
};

const containerStyle = {
  backgroundColor: "#000",
  color: "#fff",
  minHeight: "100vh",
  overflowX: "hidden",
  position: "relative",
  isolation: "isolate",
};

const Terms = () => {
  const { t, i18n } = useTranslation("terms");

  useEffect(() => {
    const removeOrangeStripes = () => {
      const bgElements = document.querySelectorAll(
        ".bg-orange-500, .from-orange-500, .to-orange-500"
      );

      bgElements.forEach((element) => {
        if (
          element.tagName === "BUTTON" ||
          element.closest("button") ||
          element.closest("header") ||
          element.closest("nav") ||
          element.closest(".WhatsAppIcon") ||
          element.classList.contains("text-orange-400") ||
          element.classList.contains("text-orange-500")
        ) {
          return;
        }

        let parent = element.parentElement;
        while (parent) {
          const style = window.getComputedStyle(parent);
          if (
            style.background &&
            style.background.includes("linear-gradient") &&
            !parent.closest("button") &&
            !parent.closest("header")
          ) {
            parent.style.background = "rgb(17, 24, 39)"; // gray-900
          }
          parent = parent.parentElement;
        }

        if (
          element.classList.contains("bg-gradient-to-r") ||
          element.classList.contains("bg-gradient-to-b")
        ) {
          element.classList.remove("bg-gradient-to-r", "bg-gradient-to-b");
          element.classList.add("bg-gray-900");
        }
      });
    };

    removeOrangeStripes();

    window.addEventListener("load", removeOrangeStripes);

    return () => {
      window.removeEventListener("load", removeOrangeStripes);
    };
  }, []);

  useEffect(() => {}, [i18n.language]);

  return (
    <ErrorBoundary>
      <div style={containerStyle}>
        <main className="container mx-auto px-4 pt-32 pb-16 md:pt-44 md:pb-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-orange-400">
            {t("title", "Terms & Conditions")}
          </h1>
          <p className="text-gray-400 text-center max-w-3xl mx-auto mb-16">
            {t(
              "subtitle",
              "Please review our rental terms and required documentation before booking your premium vehicle experience."
            )}
          </p>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-white text-center">
              {t("documents.title", "Documents Required To Hire Your Car")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-4 text-white">
                  {t("documents.residents.title", "For Local UAE Residents")}
                </h3>
                <div className="space-y-2">
                  <DocumentItem
                    icon={FileText}
                    text={t(
                      "documents.residents.passport",
                      "Valid Passport Copy"
                    )}
                  />
                  <DocumentItem
                    icon={CreditCard}
                    text={t(
                      "documents.residents.license",
                      "Valid UAE Driving License"
                    )}
                  />
                  <DocumentItem
                    icon={User}
                    text={t("documents.residents.id", "Copy of Emirates ID")}
                  />
                </div>
              </div>

              <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-4 text-white">
                  {t(
                    "documents.tourists.title",
                    "For Foreign Tourists in Dubai"
                  )}
                </h3>
                <div className="space-y-2">
                  <DocumentItem
                    icon={FileText}
                    text={t(
                      "documents.tourists.passport",
                      "Valid Passport Copy"
                    )}
                  />
                  <DocumentItem
                    icon={CreditCard}
                    text={t(
                      "documents.tourists.license",
                      "Valid Home Country Driving License"
                    )}
                  />
                  <DocumentItem
                    icon={User}
                    text={t("documents.tourists.visa", "Valid UAE Visa Stamp")}
                  />
                  <DocumentItem
                    icon={Plane}
                    text={t(
                      "documents.tourists.stamp",
                      "Airport Entry Stamp On Passport"
                    )}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-white text-center">
              {t("services.title", "Our Premium Services")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={Clock}
                title={t("services.delivery.title", "24/7 Free Delivery")}
              >
                <p>
                  {t(
                    "services.delivery.description",
                    "We offer complimentary vehicle delivery anywhere in Dubai, available 24 hours a day, 7 days a week. No matter when you need your luxury vehicle, we'll ensure it reaches you on time."
                  )}
                </p>
              </FeatureCard>

              <FeatureCard
                icon={User}
                title={t("services.chauffeur.title", "Chauffeur Service")}
              >
                <p>
                  {t(
                    "services.chauffeur.description",
                    "Enhance your experience with our professional chauffeur service. Our experienced drivers provide a premium transportation experience, allowing you to enjoy Dubai in complete comfort."
                  )}
                </p>
              </FeatureCard>

              <FeatureCard
                icon={Plane}
                title={t("services.airport.title", "Airport Pickup")}
              >
                <p>
                  {t(
                    "services.airport.description",
                    "Start your Dubai experience the moment you land. We provide convenient airport pickup services to ensure a seamless transition from your flight to your destination."
                  )}
                </p>
              </FeatureCard>
            </div>
          </section>

          <section className="mb-16">
            <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-8 border border-gray-800 text-center">
              <div className="bg-black/50 p-4 rounded-lg inline-block mb-6">
                <Check className="w-12 h-12 text-orange-500 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white">
                {t("noDeposit.title", "No Deposit Required")}
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {t(
                  "noDeposit.description",
                  "Experience hassle-free luxury car rental with zero deposit. We believe in making luxury accessible without the burden of large security deposits."
                )}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8 text-white">
              {t("generalTerms.title", "General Terms")}
            </h2>

            <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-6 border border-gray-800 space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {t("generalTerms.rentalPeriod.title", "Rental Period")}
                </h3>
                <p className="text-gray-300">
                  {t(
                    "generalTerms.rentalPeriod.description",
                    "The minimum rental period is 24 hours. A grace period of 1 hour is provided for returns, after which an additional day will be charged."
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {t("generalTerms.insurance.title", "Insurance")}
                </h3>
                <p className="text-gray-300">
                  {t(
                    "generalTerms.insurance.description",
                    "All our vehicles come with comprehensive insurance coverage. However, the renter is responsible for any damage not covered by the insurance policy."
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {t("generalTerms.fuelPolicy.title", "Fuel Policy")}
                </h3>
                <p className="text-gray-300">
                  {t(
                    "generalTerms.fuelPolicy.description",
                    "All vehicles are delivered with a full tank of fuel and should be returned with a full tank. Otherwise, a refueling fee plus the cost of fuel will be charged."
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {t("generalTerms.mileageLimit.title", "Mileage Limit")}
                </h3>
                <p className="text-gray-300">
                  {t(
                    "generalTerms.mileageLimit.description",
                    "Our luxury vehicles come with a daily mileage limit of 300 km. Additional kilometers will be charged at a rate specific to the vehicle model."
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {t("generalTerms.cancellation.title", "Cancellation Policy")}
                </h3>
                <p className="text-gray-300">
                  {t(
                    "generalTerms.cancellation.description",
                    "Cancellations made 48 hours or more before the scheduled pickup time receive a full refund. Cancellations made less than 48 hours in advance are subject to a one-day rental fee."
                  )}
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Terms;
