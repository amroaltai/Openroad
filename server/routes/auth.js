// routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { compare, hash } from "bcrypt";
import rateLimit from "express-rate-limit";

dotenv.config();

const router = express.Router();

// Skydd mot brute force-attacker
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuter
  max: 5, // max 5 försök per IP under fönstret
  message: {
    success: false,
    message: "För många inloggningsförsök. Försök igen senare.",
  },
});

// Admin inloggningsuppgifter - sätts vid serverstart om de inte är definierade i .env
let ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
let ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// Om vi inte har ett lösenordshash i miljövariablerna, skapa ett från hårdkodat lösenord
// Detta är endast för att bibehålla bakåtkompatibilitet med din befintliga kod
// I en produktionsmiljö bör du alltid använda hashed lösenord i .env-filen
const initAdminCredentials = async () => {
  if (!ADMIN_PASSWORD_HASH) {
    const defaultPassword = process.env.ADMIN_PASSWORD || "password123";
    try {
      ADMIN_PASSWORD_HASH = await hash(defaultPassword, 10);
      console.log("Generated temporary password hash for admin account");
    } catch (error) {
      console.error("Error generating admin password hash:", error);
    }
  }
};

initAdminCredentials();

// Validera admin-inloggning
router.post("/admin/auth", loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  try {
    // Kontrollera användarnamn
    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({
        success: false,
        message: "Incorrect username or password",
      });
    }

    // Kontrollera lösenord med bcrypt
    let passwordMatches = false;

    try {
      passwordMatches = await compare(password, ADMIN_PASSWORD_HASH);
    } catch (error) {
      console.error("Error comparing passwords:", error);
    }

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Incorrect username or password",
      });
    }

    // Skapa JWT token
    const JWT_SECRET =
      process.env.JWT_SECRET || "fallback_secret_change_this_in_production";
    const token = jwt.sign({ username, role: "admin" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Sätt HTTP-only cookie för ökad säkerhet
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 timme
    });

    // Returnera token också för klientsidan
    res.json({
      success: true,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

// Verifiera admin token middleware
export const verifyAdminToken = (req, res, next) => {
  // Hämta token från cookies eller auth header
  const token =
    req.cookies?.adminToken ||
    req.headers.authorization?.split(" ")[1] ||
    req.query.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Authentication required.",
    });
  }

  try {
    // Verifiera token
    const JWT_SECRET =
      process.env.JWT_SECRET || "fallback_secret_change_this_in_production";
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Validera om användaren är inloggad
router.get("/admin/validate", verifyAdminToken, (req, res) => {
  res.json({
    success: true,
    user: {
      username: req.user.username,
      role: req.user.role,
    },
  });
});

// Utloggning
router.post("/admin/logout", (req, res) => {
  res.clearCookie("adminToken");
  res.json({
    success: true,
    message: "Logout successful",
  });
});

export default router;
