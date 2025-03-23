const express = require("express");
require("dotenv").config();

const router = express.Router();

//import all routes
const authRoutes = require("./AuthRoutes");
const vehicleRoutes = require("./VehicleRoutes");

//use all routes
router.use("/auth", authRoutes);
router.use("/vehicles", vehicleRoutes);

router.get("/health-check", (req, res) => {
  res.json({
    status: "Sucess",
    message: "API Running Perfect",
    version: process.env.API_VERSION || "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
