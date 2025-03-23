// models/Vehicles.js
const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema(
  {
    numberPlate: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    vehicleType: {
      type: String,
      enum: ["bike", "three_wheel", "diesel_wheel", "lorry"],
      required: true,
    },
    vehicleCapacity: {
      type: Number,
      required: true,
    },
    fuelType: { type: String, required: true },
    mileage: { type: Number },
    insuranceExpiryDate: { type: Date },
    LicenedDate: {
      type: Date,
      required: true,
    },
    lastServiceDate: { type: Date },
    nextServiceDue: { type: Date },
    vehicleImgUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["available", "on_delivery", "under_maintenance"],
      default: "available",
    },
    isAssigned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", VehicleSchema);
