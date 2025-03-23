//controllers/VehicleContrller.js
const Vehicle = require("../models/Vehicles");

class VehicleController {
  static async getAllVehicles(req, res) {
    try {
      const vehicles = await Vehicle.find();
      res.status(200).json(vehicles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createVehicle(req, res, next) {
    try {
      const {
        numberPlate,
        vehicleType,
        vehicleCapacity,
        fuelType,
        mileage,
        insuranceExpiryDate,
        LicenedDate,
        lastServiceDate,
        nextServiceDue,
        vehicleImgUrl,
      } = req.body;

      if (!numberPlate || !vehicleType || !vehicleCapacity) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      const newVehicle = new Vehicle({
        numberPlate,
        vehicleType,
        vehicleCapacity,
        fuelType,
        mileage,
        insuranceExpiryDate,
        LicenedDate,
        lastServiceDate,
        nextServiceDue,
        vehicleImgUrl,
        status: "available",
        isAssigned: false,
      });
      await newVehicle.save();
      res
        .status(201)
        .json({ message: "Vehicle added successfully!", newVehicle });
    } catch (error) {
      next(error);
    }
  }

  static async getVehicleById(req, res) {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.status(200).json(vehicle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateVehicle(req, res) {
    try {
      const updatedVehicle = await Vehicle.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedVehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res
        .status(200)
        .json({ message: "Vehicle updated successfully!", updatedVehicle });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteVehicle(req, res) {
    try {
      const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
      if (!deletedVehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.status(200).json({ message: "Vehicle deleted successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = VehicleController;
