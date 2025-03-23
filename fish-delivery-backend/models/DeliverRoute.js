// models/DeliverRoute.js
const mongoose = require("mongoose");

const DeliverRouteSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: true,
      maxlength: [100, "Route name cannot exceed 100 characters"],
    },
    routeSlug: {
      type: String,
      maxlength: [100, "Route slug cannot exceed 100 characters"],
    },
    startLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    endLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    routePath: [
      {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliverRoute", DeliverRouteSchema);
