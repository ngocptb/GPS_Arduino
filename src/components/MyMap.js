import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

//Function to convert lat/long to decimal
const convertToDecimal = (degrees, minutes, direction) => {
    const decimal = degrees + minutes / 60;
    return direction === 'S' || direction === 'W' ? -decimal : decimal;
};


const convertToDegreesMinutes = (decimalDegrees, direction) => {
    const strDegree = String(decimalDegrees);// Convert to string
    const degreeLength = strDegree.length;
    const DegreeAfterDot = strDegree.split('.')[0]; // get the first part 10639.37005 => get 10639
    const degree = DegreeAfterDot.length > 4 ? DegreeAfterDot.slice(0, 3) : DegreeAfterDot.slice(0, 2);
    const minutes = DegreeAfterDot.length > 4 ? strDegree.slice(3, degreeLength) : strDegree.slice(2, degreeLength);
    
    
    const result = Number(degree) + Number(minutes) / 60;
    // return `${degree}° ${minutes}′`;
    return result;
};

// Your coordinates
const latitude = convertToDecimal(10, 51.31192, 'N');
const longitude = convertToDecimal(106, 39.37005, 'E');

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};


// Initial center position
const initialCenter = { lat: latitude, lng: longitude };

const MyMapComponent = () => {

    const [center, setCenter] = useState(initialCenter);
        
    
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



export default MyMapComponent;
