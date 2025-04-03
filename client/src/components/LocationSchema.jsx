import React, { useEffect } from "react";

const LocationSchema = () => {
  useEffect(() => {
    // Create location schema dynamically to avoid issues with server-side rendering
    const createLocationSchema = () => {
      // Remove any existing schema to prevent duplicates
      const existingSchema = document.getElementById("location-schema");
      if (existingSchema) {
        existingSchema.remove();
      }

      // Location data
      const businessInfo = {
        name: "Open Road Car Rental Dubai",
        description:
          "24/7 car rental service in Dubai offering luxury and economy vehicles with free delivery anywhere in Dubai. Daily, weekly, and monthly rates available at competitive prices.",
        image: "https://www.openroadcarrental.ae/storefront.jpg",
        logo: "https://www.openroadcarrental.ae/logga.png",
        telephone: "+971563995002",
        email: "info@openroadcarrental.ae",
        address: {
          streetAddress:
            "Ibn Al Zahrawi Street, Al Jaddaf Dubai, Azurite Tower, Shop 16",
          addressLocality: "Dubai",
          addressRegion: "Dubai",
          addressCountry: "AE",
          postalCode: "",
        },
        geo: {
          latitude: "25.2285",
          longitude: "55.3273",
        },
        priceRange: "$$-$$$",
        paymentMethods: ["Cash", "Credit Card", "Debit Card"],
      };

      // Create local business schema
      const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: businessInfo.name,
        description: businessInfo.description,
        image: businessInfo.image,
        telephone: businessInfo.telephone,
        email: businessInfo.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: businessInfo.address.streetAddress,
          addressLocality: businessInfo.address.addressLocality,
          addressRegion: businessInfo.address.addressRegion,
          addressCountry: businessInfo.address.addressCountry,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: businessInfo.geo.latitude,
          longitude: businessInfo.geo.longitude,
        },
        url: "https://www.openroadcarrental.ae",
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
        priceRange: businessInfo.priceRange,
        paymentAccepted: businessInfo.paymentMethods.join(", "),
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Service Hours",
            value: "24/7 Service",
          },
          {
            "@type": "PropertyValue",
            name: "Delivery",
            value: "Free vehicle delivery throughout Dubai",
          },
        ],
      };

      // Create the script element and add to document
      const script = document.createElement("script");
      script.id = "location-schema";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(localBusinessSchema);
      document.head.appendChild(script);
    };

    // Add schema when component mounts
    createLocationSchema();

    // Clean up schema when component unmounts
    return () => {
      const existingSchema = document.getElementById("location-schema");
      if (existingSchema) {
        existingSchema.remove();
      }
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default LocationSchema;
