import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import LeftImg from "../../assets/images/web-tyre-case.jpg";
import { Stepper, Step, StepLabel } from "@mui/material";
import { vehicleApi } from "../../../api/vehicles";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../lib/firebase.js";
const steps = ["Vehicle Details", "Insurance & Service", "Confirm & Submit"];

const formatDate = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const VehiclesManagement = ({ type, vehicle }) => {
  console.log(type, vehicle);
  const [formData, setFormData] = useState({
    numberPlate: vehicle?.numberPlate || "",
    vehicleType: vehicle?.vehicleType || "",
    vehicleCapacity: vehicle?.vehicleCapacity || "",
    fuelType: vehicle?.fuelType || "",
    mileage: vehicle?.mileage || "",
    insuranceExpiryDate: formatDate(vehicle?.insuranceExpiryDate) || "",
    LicenedDate: formatDate(vehicle?.LicenedDate) || "",
    lastServiceDate: formatDate(vehicle?.lastServiceDate) || "",
    nextServiceDue: formatDate(vehicle?.nextServiceDue) || "",
    vehicleImgUrl: vehicle?.vehicleImgUrl || "",
  });
  const [step, setStep] = useState(0);

  const [image, setImage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageURL, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const storage = getStorage(app);

  const nextStep = () =>
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpload = () => {
    const storage = getStorage();
    const storageRef = ref(storage, `item_images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    setLoading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (uploadError) => {
        console.error("Error uploading image:", uploadError);
        Swal.fire("Upload Error", "Error uploading image.", "error");
        setLoading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Download URL:", downloadURL);
          setImageURL(downloadURL);
          setFormData((prevData) => ({
            ...prevData,
            vehicleImgUrl: downloadURL,
          }));
          setLoading(false);
        } catch (error) {
          console.error("Error getting download URL:", error);
          Swal.fire("URL Error", "Error getting the download URL.", "error");
          setLoading(false);
        }
      }
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await vehicleApi.createNewVehicle(formData);
    } catch (error) {
      console.error(error);
    }
  };

  const renderStepOne = () => (
    <>
      <div className="space-y-4">
        <div className="text-left">
          <Label>Vehicle No:</Label>
          <Input
            name="numberPlate"
            value={formData.numberPlate}
            onChange={handleInputChange}
            placeholder="Enter Vehicle No"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-10">
          <div className="text-left">
            <Label>Vehicle Type:</Label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-input bg-blue-50 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
            >
              <option value="">Select Vehicle Type</option>
              <option value="bike">Bike</option>
              <option value="three_wheel">Three Wheel</option>
              <option value="diesel_wheel">Diesel Wheel</option>
              <option value="lorry">Lorry</option>
            </select>
          </div>
          <div className="text-left">
            <Label>Vehicle Capacity:</Label>
            <Input
              name="vehicleCapacity"
              type="number"
              value={formData.vehicleCapacity}
              onChange={handleInputChange}
              placeholder="Enter Vehicle Capacity"
              required
            />
          </div>
        </div>
        <div className="text-left">
          <Label>Fuel Type:</Label>
          <Input
            name="fuelType"
            value={formData.fuelType}
            onChange={handleInputChange}
            placeholder="Select Fuel Type"
            required
          />
        </div>
        <div className="text-left">
          <Label>Mileage:</Label>
          <Input
            name="mileage"
            type="number"
            value={formData.mileage}
            onChange={handleInputChange}
            placeholder="Enter Mileage"
            required
          />
        </div>
      </div>

      <Button onClick={nextStep} className="bg-green-300 mt-10">
        Next
      </Button>
    </>
  );

  const renderStepTwo = () => (
    <>
      <div className="space-y-4">
        <div className="text-left">
          <Label>Insurance Expiry Date:</Label>
          <Input
            type="date"
            name="insuranceExpiryDate"
            value={formData.insuranceExpiryDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="text-left">
          <Label>Licensed Date:</Label>
          <Input
            type="date"
            name="LicenedDate"
            value={formData.LicenedDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="text-left">
          <Label>Last Service Date:</Label>
          <Input
            type="date"
            name="lastServiceDate"
            value={formData.lastServiceDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="text-left">
          <Label>Next Service Due:</Label>
          <Input
            type="date"
            name="nextServiceDue"
            value={formData.nextServiceDue}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="flex justify-between mt-10">
        <Button onClick={prevStep} className="bg-gray-300">
          Back
        </Button>
        <Button onClick={nextStep} className="bg-green-300">
          Next
        </Button>
      </div>
    </>
  );

  const renderStepThree = () => (
    <>
      <div className="space-y-4">
        <div className="text-left">
          <Label>Vehicle Image URL:</Label>
          <Input
            type="file"
            name="image"
            onChange={(e) => setImage(e.target.files[0])}
            placeholder="Enter Image URL"
            required
          />
        </div>
        {uploadProgress > 0 && (
          <div className="w-full max-w-sm mt-4">
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold inline-block py-1 px-2 rounded text-teal-600 bg-teal-200">
                  Upload Progress
                </span>
                <span className="text-xs font-semibold inline-block py-1 px-2 rounded text-teal-600 bg-teal-200">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <div className="flex-1">
                <div className="relative flex items-center justify-center w-full">
                  <div className="w-full bg-gray-200 rounded">
                    <div
                      className="bg-teal-600 text-xs leading-none py-1 text-center text-white rounded"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center mb-4">
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-black text-white text-xl px-4 py-2 rounded-md mt-5"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <div className="flex justify-between mt-10">
        <Button onClick={prevStep} className="bg-gray-300">
          Back
        </Button>
        <Button className="bg-blue-500 text-white" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </>
  );

  return (
    <div className="w-5xl grid grid-cols-2 gap-5 h-full">
      <img src={LeftImg} className="rounded-l-2xl h-full object-cover" />
      <div className="p-10 flex flex-col justify-center w-full">
        <h2 className="font-extrabold text-3xl mb-8">Vehicles Management</h2>

        {/* Stepper */}
        <Stepper activeStep={step} alternativeLabel className="mb-2">
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Form Sections */}
        {step === 0 && renderStepOne()}
        {step === 1 && renderStepTwo()}
        {step === 2 && renderStepThree()}
      </div>
    </div>
  );
};

export default VehiclesManagement;
