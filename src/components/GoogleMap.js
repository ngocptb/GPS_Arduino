import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Function to convert lat/long to decimal
const convertToDecimal = (degrees, minutes, direction) => {
  const decimal = degrees + minutes / 60;
  return direction === 'S' || direction === 'W' ? -decimal : decimal;
};

// Your coordinates
const latitude = convertToDecimal(10, 46.39939, 'N');
const longitude = convertToDecimal(106, 39.40447, 'E');

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: latitude,
  lng: longitude,
};

const GoogleMapComponent = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyC8HsyqOhE3LNUUJjTrpRU3tQRpNfflhSA">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};



export default GoogleMapComponent;
