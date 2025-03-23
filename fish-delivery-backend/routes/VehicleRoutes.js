const express = require("express");
const router = express.Router();

// Import the VehicleController
const VehicleController = require("../controllers/VehicleController");

// Route to get all vehicles
router.get("/", VehicleController.getAllVehicles);

// Route to create a new vehicle
router.post("/", VehicleController.createVehicle);

// Route to get a single vehicle by ID
router.get("/:id", VehicleController.getVehicleById);

// Route to update a vehicle by ID
router.put("/:id", VehicleController.updateVehicle);

// Route to delete a vehicle by ID
router.delete("/:id", VehicleController.deleteVehicle);

module.exports = router;
