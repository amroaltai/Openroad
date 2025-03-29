const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Konfigurera app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API fungerar!" });
});

// Starta server
app.listen(PORT, () => {
  console.log(`Server körs på port ${PORT}`);
});
