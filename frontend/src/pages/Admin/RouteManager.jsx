import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import VehiclesManagement from "../../components/forms/VehiclesManagement";
import Modal from "react-modal";
import { Close } from "@mui/icons-material";
import { vehicleApi } from "../../../api/vehicles";
import { motion } from "framer-motion";
import RouteMap from "../../components/admin/RouteMap";

const RouteManager = ({ isSidebarCollapsed }) => {
  const [vehicleFormPopup, setVehicleFormPopup] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [approvedVehicles, setApprovedVehicles] = useState(0);
  const [rejectedVehicles, setRejectedVehicles] = useState(0);

  const closeVehicleFormPopup = () => {
    setVehicleFormPopup(false);
  };

  const openVehicleFormPopup = () => {
    setVehicleFormPopup(true);
  };

  // Fetch all vehicles when the component mounts
  useEffect(() => {
    fetchAllVehicles();
  }, [vehicleFormPopup]);

  const fetchAllVehicles = async () => {
    try {
      const vehicles = await vehicleApi.getAllVehicles();
      setVehicles(vehicles.data);
      setTotalVehicles(vehicles.data.length);
      setApprovedVehicles(
        vehicles.data.filter((v) => v.status === "Approved").length
      );
      setRejectedVehicles(
        vehicles.data.filter((v) => v.status === "Rejected").length
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <main
        style={{
          marginLeft: isSidebarCollapsed ? "60px" : "220px",
          transition: "margin-left 0.3s",
        }}
        className="bg-gradient-to-r from-indigo-50 to-slate-200 min-h-screen rounded-2xl"
      >
        <div className="pl-20 items-center justify-center text-center">
          <h2 className="text-4xl font-extrabold text-black pt-10">
            Route Management
          </h2>

          {/* Floating Add New Vehicle Button */}
          <motion.div
            className="absolute top-10 right-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="default"
              className="bg-green-400 hover:bg-green-500 transition-all duration-300 p-5 rounded-full shadow-lg"
              onClick={openVehicleFormPopup}
            >
              <span className="text-white text-md">+ Add Route</span>
            </Button>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 mt-10 mr-5">
            <Card className="p-5 bg-white shadow-xl rounded-2xl border border-gray-200">
              <CardContent>
                <CardTitle className="text-xl font-semibold">
                  Total Vehicles
                </CardTitle>
                <div className="text-3xl font-bold">{totalVehicles}</div>
              </CardContent>
            </Card>
            <Card className="p-5 bg-white shadow-xl rounded-2xl border border-gray-200">
              <CardContent>
                <CardTitle className="text-xl font-semibold">
                  Approved Vehicles
                </CardTitle>
                <div className="text-3xl font-bold text-green-500">
                  {approvedVehicles}
                </div>
              </CardContent>
            </Card>
            <Card className="p-5 bg-white shadow-xl rounded-2xl border border-gray-200">
              <CardContent>
                <CardTitle className="text-xl font-semibold">
                  Rejected Vehicles
                </CardTitle>
                <div className="text-3xl font-bold text-red-500">
                  {rejectedVehicles}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table Section */}
          <RouteMap />
        </div>
      </main>
    </div>
  );
};

export default RouteManager;
