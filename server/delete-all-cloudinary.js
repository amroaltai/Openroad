// server/delete-all-cloudinary.js
import dotenv from "dotenv";
import cloudinary from "./config/cloudinary.js";

// Ladda miljövariabler
dotenv.config();

async function deleteAllImages() {
  try {
    console.log("Raderar alla bilder i car-images-mappen...");

    // Detta raderar alla resurser med prefixet "car-images/"
    const result = await cloudinary.api.delete_resources_by_prefix(
      "car-images/"
    );

    console.log("Alla bilder har raderats:", result);
  } catch (error) {
    console.error("Fel vid radering av bilder:", error);
  }
}

deleteAllImages();
