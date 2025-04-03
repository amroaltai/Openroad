import React, { useEffect } from "react";

const VehiclesSchema = ({ vehicles = [] }) => {
  useEffect(() => {
    // Create vehicle schema dynamically
    const createVehicleSchema = () => {
      // Remove any existing schema to prevent duplicates
      const existingSchema = document.getElementById("vehicles-schema");
      if (existingSchema) {
        existingSchema.remove();
      }

      // Extract vehicle data
      const vehicleOffers = vehicles.slice(0, 10).map((car) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Car",
          name: `${car.brand} ${car.model}`,
          manufacturer: car.brand,
          model: car.model,
          modelDate: car.year,
          vehicleConfiguration: car.type || "Luxury",
          vehicleSeatingCapacity: car.seats || 5,
          cargoVolume: {
            "@type": "QuantitativeValue",
            unitCode: "LTR",
            value: "400",
          },
        },
        priceSpecification: {
          "@type": "PriceSpecification",
          price: car.price_per_day,
          priceCurrency: "AED",
          validFrom: new Date().toISOString().split("T")[0],
          validThrough: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          )
            .toISOString()
            .split("T")[0],
        },
        offeredBy: {
          "@type": "AutoRental",
          name: "Open Road Car Rental Dubai",
        },
        areaServed: {
          "@type": "City",
          name: "Dubai",
          address: {
            "@type": "PostalAddress",
            addressCountry: "AE",
          },
        },
        availability: "https://schema.org/InStock",
      }));

      // Create list schema
      const vehicleListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: vehicleOffers.map((offer, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: offer,
        })),
        numberOfItems: vehicleOffers.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
      };

      // Create the script element and add to document
      const script = document.createElement("script");
      script.id = "vehicles-schema";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(vehicleListSchema);
      document.head.appendChild(script);
    };

    // Only create schema if we have vehicle data
    if (vehicles.length > 0) {
      createVehicleSchema();
    }

    // Clean up schema when component unmounts
    return () => {
      const existingSchema = document.getElementById("vehicles-schema");
      if (existingSchema) {
        existingSchema.remove();
      }
    };
  }, [vehicles]);

  // This component doesn't render anything visible
  return null;
};

export default VehiclesSchema;
