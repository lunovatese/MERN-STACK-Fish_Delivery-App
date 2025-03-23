const DeliverRoute = require("../models/DeliverRoute");

class DeliverRouteController {
  static async getAllDeliverRoutes(req, res) {
    try {
      const routes = await DeliverRoute.find();
      res.status(200).json(routes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createDeliverRoute(req, res) {
    try {
      const { routeName, startLocation, endLocation, routePath } = req.body;

      if (!routeName || !startLocation || !endLocation) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      const newRoute = new DeliverRoute({
        routeName,
        routeSlug,
        startLocation,
        endLocation,
        routePath,
      });
      await newRoute.save();
      res
        .status(201)
        .json({ message: "Route created successfully!", newRoute });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDeliverRouteById(req, res) {
    try {
      const route = await DeliverRoute.findById(req.params.id);
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      res.status(200).json(route);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateDeliverRoute(req, res) {
    try {
      const updatedRoute = await DeliverRoute.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedRoute) {
        return res.status(404).json({ error: "Route not found" });
      }
      res
        .status(200)
        .json({ message: "Route updated successfully!", updatedRoute });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteDeliverRoute(req, res) {
    try {
      const deletedRoute = await DeliverRoute.findByIdAndDelete(req.params.id);
      if (!deletedRoute) {
        return res.status(404).json({ error: "Route not found" });
      }
      res.status(200).json({ message: "Route deleted successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DeliverRouteController;
