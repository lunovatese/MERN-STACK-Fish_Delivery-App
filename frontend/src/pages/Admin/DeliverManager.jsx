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
import VehicleDetails from "../../components/dataPopups/VehicleDetails";

const DeliverManager = ({ isSidebarCollapsed }) => {
  const [vehicleFormPopup, setVehicleFormPopup] = useState(false);
  const [vehicleDisplay, setVehicleDisplay] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState();
  const [vehicles, setVehicles] = useState([]);
  const [formType, setFormType] = useState("add");
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [approvedVehicles, setApprovedVehicles] = useState(0);
  const [rejectedVehicles, setRejectedVehicles] = useState(0);

  const closeVehicleFormPopup = () => {
    setVehicleFormPopup(false);
    setFormType("add");
    setSelectedVehicle(null);
  };

  const openVehicleFormPopup = () => {
    setVehicleFormPopup(true);
  };

  const closeVehicleDisplayPopup = () => {
    setVehicleDisplay(false);
  };

  const openVehicleDisplayPopup = (vehicle) => {
    setVehicleDisplay(true);
    setSelectedVehicle(vehicle);
  };

  const handleVehicleUpdate = (vehicle) => {
    setFormType("edit");
    setSelectedVehicle(vehicle);
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
            Vehicle Management
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
              className="bg-green-400 hover:bg-green-500 transition-all duration-300 p-5 rounded-full shadow-lg text-white"
              onClick={openVehicleFormPopup}
            >
              <span className="text-4xl">+</span>{" "}
              <span className="text-white text-md"> Add Vehicle</span>
            </Button>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 mt-10 mr-5 ">
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
          <Card className="mx-5 mt-10 pr-10 bg-white shadow-xl rounded-2xl border border-gray-200">
            <CardContent>
              <Table className="mt-5">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold text-gray-600">
                      Number Plate
                    </TableHead>
                    <TableHead className="font-semibold text-gray-600">
                      Vehicle Type
                    </TableHead>
                    <TableHead className="font-semibold text-gray-600">
                      Vehicle Capacity
                    </TableHead>
                    <TableHead className="font-semibold text-gray-600">
                      Fuel Type
                    </TableHead>
                    <TableHead className="font-semibold text-gray-600">
                      Mileage
                    </TableHead>
                    <TableHead className="font-semibold text-gray-600">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-600">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle._id}>
                      <TableCell>{vehicle.numberPlate}</TableCell>
                      <TableCell>{vehicle.vehicleType}</TableCell>
                      <TableCell>{vehicle.vehicleCapacity}</TableCell>
                      <TableCell>{vehicle.fuelType}</TableCell>
                      <TableCell>{vehicle.mileage}</TableCell>
                      <TableCell>{vehicle.status}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="default"
                            className="bg-blue-300 hover:bg-blue-400 transition-all duration-300"
                            onClick={() => openVehicleDisplayPopup(vehicle)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="default"
                            className="bg-green-300 hover:bg-green-400 transition-all duration-300"
                            onClick={() => handleVehicleUpdate(vehicle)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="destructive"
                            className="bg-red-400 hover:bg-red-500 transition-all duration-300"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>

            <Modal
              isOpen={vehicleFormPopup}
              onRequestClose={closeVehicleFormPopup}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl mx-auto mt-20 z-10"
              overlayClassName="fixed inset-0 bg-opacity-50 flex backdrop-blur-md justify-center items-center z-10"
            >
              <motion.button
                className="absolute p-1 ml-9 left-4/5 text-black bg-red-500 rounded-xl mt-3"
                onClick={closeVehicleFormPopup}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Close className="w-2" />
              </motion.button>
              {formType === "add" && (
                <VehiclesManagement type={formType} vehicle={null} />
              )}
              {formType === "edit" && (
                <VehiclesManagement type={formType} vehicle={selectedVehicle} />
              )}
            </Modal>

            <Modal
              isOpen={vehicleDisplay}
              onRequestClose={closeVehicleDisplayPopup}
              className="bg-white rounded-2xl w-5xl shadow-2xl  mx-auto mt-20 z-10"
              overlayClassName="fixed inset-0 bg-opacity-50 flex backdrop-blur-md justify-center items-center z-10"
            >
              <motion.button
                className="absolute p-1 ml-9 left-4/5 text-black bg-red-500 rounded-xl mt-3"
                onClick={closeVehicleDisplayPopup}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Close className="w-2" />
              </motion.button>
              <VehicleDetails vehicle={selectedVehicle} />
            </Modal>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DeliverManager;
