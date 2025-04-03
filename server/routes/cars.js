// server/routes/cars.js
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { db } from "../db/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDir = path.join(__dirname, "..", "temp-uploads");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

// GET all cars
router.get("/", async (req, res) => {
  try {
    const cars = await db.query("SELECT * FROM cars ORDER BY id");
    console.log(`Returning ${cars.rows.length} cars`);
    res.json(cars.rows);
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});

// GET car by ID
router.get("/:id", async (req, res) => {
  try {
    const car = await db.query("SELECT * FROM cars WHERE id = $1", [
      req.params.id,
    ]);

    if (car.rows.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(car.rows[0]);
  } catch (err) {
    console.error("Error fetching car:", err);
    res.status(500).json({ error: "Failed to fetch car" });
  }
});

// Helper function to process car data and upload images
const processCarData = async (req) => {
  const {
    brand,
    model,
    year,
    color,
    seats,
    horsepower,
    type,
    category,
    uploadMethod,
    imageUrl1,
    imageUrl2,
    imageUrl3,
    price_per_day,
    price_per_week,
    price_per_month,
  } = req.body;

  // Validate required fields
  if (!brand || !model || !year) {
    throw new Error("Brand, model, and year are required");
  }

  // Process pricing data (log it for debugging)
  const processedPricePerDay = price_per_day ? parseFloat(price_per_day) : null;
  const processedPricePerWeek = price_per_week
    ? parseFloat(price_per_week)
    : null;
  const processedPricePerMonth = price_per_month
    ? parseFloat(price_per_month)
    : null;

  // Log pricing info for debugging
  console.log("Processing price data:", {
    price_per_day: processedPricePerDay,
    price_per_week: processedPricePerWeek,
    price_per_month: processedPricePerMonth,
  });

  // Initialize image URLs
  let image1 = null;
  let image2 = null;
  let image3 = null;

  // Handle different upload methods
  if (uploadMethod === "url") {
    // Use provided URLs directly
    image1 = imageUrl1 || null;
    image2 = imageUrl2 || null;
    image3 = imageUrl3 || null;
  } else {
    // Handle file uploads to Cloudinary
    if (req.files && req.files.length > 0) {
      // Upload each file to Cloudinary
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        try {
          console.log(`Uploading file ${i + 1} to Cloudinary: ${file.path}`);
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "car-images",
          });

          console.log(`File ${i + 1} uploaded successfully to Cloudinary`);

          // Assign to the appropriate image field
          if (i === 0) image1 = result.secure_url;
          else if (i === 1) image2 = result.secure_url;
          else if (i === 2) image3 = result.secure_url;

          // Delete temp file
          fs.unlinkSync(file.path);
        } catch (uploadError) {
          console.error(
            `Error uploading file: ${file.originalname}`,
            uploadError
          );
          // Continue with other files even if one fails
        }
      }
    }
  }

  return {
    brand,
    model,
    year,
    image1,
    image2,
    image3,
    color: color || null,
    seats: seats ? parseInt(seats) : null,
    horsepower: horsepower ? parseInt(horsepower) : null,
    type: type || "Luxury",
    category: category ? parseInt(category) : 5, // Default to Luxury (5) if not specified
    price_per_day: processedPricePerDay,
    price_per_week: processedPricePerWeek,
    price_per_month: processedPricePerMonth,
  };
};

// POST a new car (with file upload)
router.post("/", upload.array("images", 3), async (req, res) => {
  try {
    console.log("Received car data at /api/cars:", req.body);
    console.log("Files:", req.files);

    const carData = await processCarData(req);

    // Insert car into database
    const result = await db.query(
      `INSERT INTO cars (
        brand, model, year, image1, image2, image3, color, seats, horsepower, type, category,
        price_per_day, price_per_week, price_per_month
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        carData.brand,
        carData.model,
        carData.year,
        carData.image1,
        carData.image2,
        carData.image3,
        carData.color,
        carData.seats,
        carData.horsepower,
        carData.type,
        carData.category,
        carData.price_per_day,
        carData.price_per_week,
        carData.price_per_month,
      ]
    );

    console.log(`New car added with ID: ${result.rows[0].id}`);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ error: "Failed to add car: " + error.message });

    // Clean up any uploaded files
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
  }
});

// PUT (update car)
router.put("/:id", upload.array("images", 3), async (req, res) => {
  try {
    console.log("Updating car with ID:", req.params.id);
    console.log("Update data:", req.body);
    console.log("Files:", req.files);

    const { id } = req.params;
    const {
      brand,
      model,
      year,
      color,
      seats,
      horsepower,
      type,
      category,
      uploadMethod,
      imageUrl1,
      imageUrl2,
      imageUrl3,
      keepImage1,
      keepImage2,
      keepImage3,
      price_per_day,
      price_per_week,
      price_per_month,
    } = req.body;

    if (!brand || !model || !year) {
      return res.status(400).json({
        error: "Brand, model, and year are required",
      });
    }

    // First get the current car data
    const currentCar = await db.query("SELECT * FROM cars WHERE id = $1", [id]);

    if (currentCar.rows.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    const car = currentCar.rows[0];

    // Initialize image URLs, potentially keeping existing ones
    let image1 = keepImage1 === "true" ? car.image1 : null;
    let image2 = keepImage2 === "true" ? car.image2 : null;
    let image3 = keepImage3 === "true" ? car.image3 : null;

    // Handle different upload methods
    if (uploadMethod === "url") {
      // Use provided URLs
      if (imageUrl1) image1 = imageUrl1;
      if (imageUrl2) image2 = imageUrl2;
      if (imageUrl3) image3 = imageUrl3;
    } else if (req.files && req.files.length > 0) {
      // Handle file uploads
      let fileIndex = 0;

      // If we're not keeping image1 and have a new file, upload it
      if (keepImage1 !== "true" && fileIndex < req.files.length) {
        try {
          const result = await cloudinary.uploader.upload(
            req.files[fileIndex].path,
            {
              folder: "car-images",
            }
          );
          image1 = result.secure_url;
          fileIndex++;
        } catch (uploadError) {
          console.error("Error uploading image 1:", uploadError);
        }
      }

      // Same for image2
      if (keepImage2 !== "true" && fileIndex < req.files.length) {
        try {
          const result = await cloudinary.uploader.upload(
            req.files[fileIndex].path,
            {
              folder: "car-images",
            }
          );
          image2 = result.secure_url;
          fileIndex++;
        } catch (uploadError) {
          console.error("Error uploading image 2:", uploadError);
        }
      }

      // And image3
      if (keepImage3 !== "true" && fileIndex < req.files.length) {
        try {
          const result = await cloudinary.uploader.upload(
            req.files[fileIndex].path,
            {
              folder: "car-images",
            }
          );
          image3 = result.secure_url;
        } catch (uploadError) {
          console.error("Error uploading image 3:", uploadError);
        }
      }

      // Clean up temp files
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    // Process pricing data
    const processedPricePerDay = price_per_day
      ? parseFloat(price_per_day)
      : null;
    const processedPricePerWeek = price_per_week
      ? parseFloat(price_per_week)
      : null;
    const processedPricePerMonth = price_per_month
      ? parseFloat(price_per_month)
      : null;

    console.log("Updating with price data:", {
      price_per_day: processedPricePerDay,
      price_per_week: processedPricePerWeek,
      price_per_month: processedPricePerMonth,
    });

    // Now update the car in the database
    const result = await db.query(
      `UPDATE cars 
       SET brand = $1, model = $2, year = $3, image1 = $4, image2 = $5, image3 = $6, 
           color = $7, seats = $8, horsepower = $9, type = $10, category = $11,
           price_per_day = $12, price_per_week = $13, price_per_month = $14
       WHERE id = $15 
       RETURNING *`,
      [
        brand,
        model,
        year,
        image1,
        image2,
        image3,
        color || null,
        seats ? parseInt(seats) : null,
        horsepower ? parseInt(horsepower) : null,
        type || "Luxury",
        category ? parseInt(category) : 5,
        processedPricePerDay,
        processedPricePerWeek,
        processedPricePerMonth,
        id,
      ]
    );

    console.log(`Car with ID ${id} updated successfully`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ error: "Failed to update car: " + error.message });

    // Clean up any uploaded files
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
  }
});

// DELETE a car
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Get car details first to handle image deletion from Cloudinary
    const car = await db.query(
      "SELECT image1, image2, image3 FROM cars WHERE id = $1",
      [id]
    );

    if (car.rows.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    // Delete images from Cloudinary if they are Cloudinary URLs
    const images = [car.rows[0].image1, car.rows[0].image2, car.rows[0].image3];

    for (const imageUrl of images) {
      if (imageUrl && imageUrl.includes("cloudinary.com")) {
        try {
          // Korrekt extrahering av public_id från Cloudinary URL
          // Exempel URL: https://res.cloudinary.com/dxxgkf6qr/image/upload/v1650123456/car-images/abcd1234.jpg
          const urlParts = imageUrl.split("/");

          // Hitta 'upload' index, som markerar var versionen börjar
          const uploadIndex = urlParts.findIndex((part) => part === "upload");

          if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
            // Hoppa över versionen (v1234567) och ta resten som public_id
            // Detta inkluderar både 'car-images' och filnamnet
            const publicIdParts = urlParts.slice(uploadIndex + 2);
            const publicId = publicIdParts.join("/").split(".")[0]; // Ta bort filändelsen

            console.log(
              `Attempting to delete image with public_id: ${publicId}`
            );

            // Radera från Cloudinary
            const result = await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted image from Cloudinary: ${publicId}`, result);
          } else {
            console.error(`Could not parse Cloudinary URL format: ${imageUrl}`);
          }
        } catch (deleteError) {
          console.error("Error deleting image from Cloudinary:", deleteError);
          // Continue with deletion even if image deletion fails
        }
      }
    }

    // Delete from database
    const result = await db.query("DELETE FROM cars WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    console.error("Error deleting car:", err);
    res.status(500).json({ error: "Failed to delete car" });
  }
});

// Legacy endpoint for compatibility
// IMPROVED: Better error handling and logging for the legacy endpoint
router.post("/upload", upload.array("images", 3), async (req, res) => {
  try {
    console.log("Legacy /upload endpoint called with data:", req.body);
    console.log("Legacy /upload files:", req.files);

    // Forward request to the main endpoint's logic
    const carData = await processCarData(req);

    // Insert car into database
    const result = await db.query(
      `INSERT INTO cars (
        brand, model, year, image1, image2, image3, color, seats, horsepower, type, category,
        price_per_day, price_per_week, price_per_month
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        carData.brand,
        carData.model,
        carData.year,
        carData.image1,
        carData.image2,
        carData.image3,
        carData.color,
        carData.seats,
        carData.horsepower,
        carData.type,
        carData.category,
        carData.price_per_day,
        carData.price_per_week,
        carData.price_per_month,
      ]
    );

    console.log(
      `New car added with ID: ${result.rows[0].id} via legacy endpoint`
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Detailed error in legacy /upload endpoint:", error);

    if (error.message.includes("required")) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to add car: " + error.message });
    }

    // Clean up any uploaded files
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
            console.log(`Cleaned up temp file: ${file.path}`);
          } catch (cleanupError) {
            console.error(
              `Error cleaning up temp file: ${file.path}`,
              cleanupError
            );
          }
        }
      });
    }
  }
});

// Legacy PUT endpoint
router.put("/:id/upload", upload.array("images", 3), async (req, res) => {
  try {
    console.log(
      "Legacy /:id/upload endpoint called, forwarding to main endpoint"
    );

    // Skapar en kopia av request
    const { id } = req.params;

    // Utför samma logik som i den vanliga PUT-endpointen
    const {
      brand,
      model,
      year,
      color,
      seats,
      horsepower,
      type,
      category,
      uploadMethod,
      imageUrl1,
      imageUrl2,
      imageUrl3,
      keepImage1,
      keepImage2,
      keepImage3,
      price_per_day,
      price_per_week,
      price_per_month,
    } = req.body;

    console.log("Legacy upload price data:", {
      price_per_day,
      price_per_week,
      price_per_month,
    });

    if (!brand || !model || !year) {
      return res.status(400).json({
        error: "Brand, model, and year are required",
      });
    }

    // First get the current car data
    const currentCar = await db.query("SELECT * FROM cars WHERE id = $1", [id]);

    if (currentCar.rows.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    const car = currentCar.rows[0];

    // Initialize image URLs, potentially keeping existing ones
    let image1 = keepImage1 === "true" ? car.image1 : null;
    let image2 = keepImage2 === "true" ? car.image2 : null;
    let image3 = keepImage3 === "true" ? car.image3 : null;

    // Handle different upload methods
    if (uploadMethod === "url") {
      // Use provided URLs
      if (imageUrl1) image1 = imageUrl1;
      if (imageUrl2) image2 = imageUrl2;
      if (imageUrl3) image3 = imageUrl3;
    } else if (req.files && req.files.length > 0) {
      // Handle file uploads
      let fileIndex = 0;

      // If we're not keeping image1 and have a new file, upload it
      if (keepImage1 !== "true" && fileIndex < req.files.length) {
        try {
          const result = await cloudinary.uploader.upload(
            req.files[fileIndex].path,
            {
              folder: "car-images",
            }
          );
          image1 = result.secure_url;
          fileIndex++;
        } catch (uploadError) {
          console.error("Error uploading image 1:", uploadError);
        }
      }

      // Same for image2
      if (keepImage2 !== "true" && fileIndex < req.files.length) {
        try {
          const result = await cloudinary.uploader.upload(
            req.files[fileIndex].path,
            {
              folder: "car-images",
            }
          );
          image2 = result.secure_url;
          fileIndex++;
        } catch (uploadError) {
          console.error("Error uploading image 2:", uploadError);
        }
      }

      // And image3
      if (keepImage3 !== "true" && fileIndex < req.files.length) {
        try {
          const result = await cloudinary.uploader.upload(
            req.files[fileIndex].path,
            {
              folder: "car-images",
            }
          );
          image3 = result.secure_url;
        } catch (uploadError) {
          console.error("Error uploading image 3:", uploadError);
        }
      }

      // Clean up temp files
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    // Process pricing data with enhanced error handling
    let processedPricePerDay = null;
    let processedPricePerWeek = null;
    let processedPricePerMonth = null;

    try {
      processedPricePerDay = price_per_day ? parseFloat(price_per_day) : null;
      processedPricePerWeek = price_per_week
        ? parseFloat(price_per_week)
        : null;
      processedPricePerMonth = price_per_month
        ? parseFloat(price_per_month)
        : null;
    } catch (parseError) {
      console.error("Error parsing price values:", parseError);
      // Continue with null values if parsing fails
    }

    // Check for database compatibility
    const columnCheck = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      AND table_name = 'cars'
      AND column_name IN ('price_per_day', 'price_per_week', 'price_per_month')
    `);

    const columns = columnCheck.rows.map((row) => row.column_name);
    console.log("Available price columns:", columns);

    // Now update the car in the database
    const result = await db.query(
      `UPDATE cars 
       SET brand = $1, model = $2, year = $3, image1 = $4, image2 = $5, image3 = $6, 
           color = $7, seats = $8, horsepower = $9, type = $10, category = $11,
           price_per_day = $12, price_per_week = $13, price_per_month = $14
       WHERE id = $15 
       RETURNING *`,
      [
        brand,
        model,
        year,
        image1,
        image2,
        image3,
        color || null,
        seats ? parseInt(seats) : null,
        horsepower ? parseInt(horsepower) : null,
        type || "Luxury",
        category ? parseInt(category) : 5,
        processedPricePerDay,
        processedPricePerWeek,
        processedPricePerMonth,
        id,
      ]
    );

    console.log(`Car with ID ${id} updated successfully via legacy endpoint`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating car via legacy endpoint:", error);
    res.status(500).json({ error: "Failed to update car: " + error.message });

    // Clean up any uploaded files
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
  }
});

// Legacy properties endpoint
router.put("/:id/properties", async (req, res) => {
  try {
    console.log(
      "Legacy /:id/properties endpoint called, forwarding to main endpoint"
    );

    const { id } = req.params;
    const {
      brand,
      model,
      year,
      color,
      seats,
      horsepower,
      type,
      category,
      price_per_day,
      price_per_week,
      price_per_month,
    } = req.body;

    if (!brand || !model || !year) {
      return res
        .status(400)
        .json({ error: "Brand, model, and year are required" });
    }

    // Först hämta befintlig bil för att behålla bilderna
    const currentCar = await db.query("SELECT * FROM cars WHERE id = $1", [id]);

    if (currentCar.rows.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    const car = currentCar.rows[0];

    // Process pricing data
    const processedPricePerDay = price_per_day
      ? parseFloat(price_per_day)
      : null;
    const processedPricePerWeek = price_per_week
      ? parseFloat(price_per_week)
      : null;
    const processedPricePerMonth = price_per_month
      ? parseFloat(price_per_month)
      : null;

    // Uppdatera bilen men behåll bilderna
    const result = await db.query(
      `UPDATE cars 
       SET brand = $1, model = $2, year = $3, color = $4, seats = $5, horsepower = $6, type = $7, category = $8,
           price_per_day = $9, price_per_week = $10, price_per_month = $11
       WHERE id = $12 
       RETURNING *`,
      [
        brand,
        model,
        year,
        color || null,
        seats ? parseInt(seats) : null,
        horsepower ? parseInt(horsepower) : null,
        type || "Luxury",
        category ? parseInt(category) : 5,
        processedPricePerDay,
        processedPricePerWeek,
        processedPricePerMonth,
        id,
      ]
    );

    console.log(`Car with ID ${id} properties updated successfully`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating car properties:", error);
    res
      .status(500)
      .json({ error: "Failed to update car properties: " + error.message });
  }
});

// Export both named and default exports
export { router };
export default router;
