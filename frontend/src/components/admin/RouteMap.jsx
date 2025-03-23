import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const center = { lat: 6.9271, lng: 79.8612 }; // Colombo, Sri Lanka

const RouteMap = () => {
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);

  const origin = "Colombo, Sri Lanka";
  const destination = "Kandy, Sri Lanka";

  return (
    <LoadScript googleMapsApiKey="AIzaSyAgeApu7MuMxyU4jj7nXzZ3JqrZ0yQEGl0">
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={7} center={center}>
        {/* Directions Service to fetch route */}
        <DirectionsService
          options={{
            origin,
            destination,
            travelMode: "DRIVING",
          }}
          callback={(result, status) => {
            if (status === "OK") {
              setDirections(result);
            } else {
              setError("Unable to fetch directions");
            }
          }}
        />

        {/* Render Directions with custom polyline options */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#0000FF", // Blue color
                strokeOpacity: 0.8,
                strokeWeight: 6,
              },
            }}
          />
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
      </GoogleMap>
    </LoadScript>
  );
};

export default RouteMap;
