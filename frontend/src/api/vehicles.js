import { api } from "../utils/api.js";

export const vehicleApi = {
  //vehicle management endpoints
  getAllVehicles: () => api.get("/vehicles"),
  createNewVehicle: (data) => api.post("/vehicles", data),
};
