import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { ref, onValue } from 'firebase/database';
import TrainIcon from '../images/train3.png';
import StationIcon from '../images/station.png';
import { db } from '../firebaseConfig'; // Adjust the path as needed

const RealtimeAnimateVer3 = () => {
    const [locations, setLocations] = useState([]);

    const [markerPosition, setMarkerPosition] = useState(null);
    const [visitedPoints, setVisitedPoints] = useState([]); // Store visited points
    const mapContainerStyle = {
        height: "100%",
        width: "100%"
    };

    const stations = [
        { id: 1, lat: 10.77038, lng: 106.69687 }, // BTN
        { id: 2, lat: 10.77694, lng: 106.70261 }, // OPH
        { id: 3, lat: 10.78151, lng: 106.70792 }, // BSN    
        { id: 4, lat: 10.79575, lng: 106.71508 }, // VTP
        { id: 5, lat: 10.79854, lng: 106.72315 }, // TCN
        { id: 6, lat: 10.84637, lng: 106.77159 }, // TDN
        { id: 7, lat: 10.80214, lng: 106.74224 }, // ANP
        { id: 8, lat: 10.80853, lng: 106.75510 }, // RCC
        { id: 9, lat: 10.82139, lng: 106.75814 }, // PCL
        { id: 10, lat: 10.83637, lng: 106.76572 }, // BTI
        { id: 11, lat: 10.84633, lng: 106.77157 }, // TDC
        { id: 12, lat: 10.85905, lng: 106.78878 }, // HTP
        { id: 13, lat: 10.86620, lng: 106.80106 }, // NUN
        { id: 14, lat: 10.87952, lng: 106.81408 }, // STN - Ga Ben Xe Suoi Tien
        // Add remaining stations...
    ];

    
  

    useEffect(() => {
        const locationsRef = ref(db, 'coordinates'); // Adjust path as needed
        const unsubscribe = onValue(locationsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const locationList = Object.values(data).map(item => ({
                    lat: parseFloat(item.latitude),
                    lng: parseFloat(item.longitude)
                }));

                // Update marker position and visited points
                const latestLocation = locationList[locationList.length - 1];
                if (latestLocation) {
                    setMarkerPosition(latestLocation); // Move marker to the latest position

                    // Update visited points
                    setVisitedPoints(prev => {
                        if (!prev.some(pt => pt.lat === latestLocation.lat && pt.lng === latestLocation.lng)) {
                            return [...prev, latestLocation]; // Add new location
                        }
                        return prev; // No change if the point already exists
                    });
                    console.log(visitedPoints);
                }
            }
        });

      

        return () => unsubscribe(); // Cleanup subscription
    }, []); // Only run once

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={markerPosition || { lat: 10.87874, lng: 106.82323 }} // Default center
                zoom={16}
            >
               

               {/* Mark 14 stations position */}
                {visitedPoints.length > 0 && stations.map((station, index) => (
                    <Marker
                        key={index} // Ensure each marker has a unique key
                        position={station} // Position of the station
                        icon={{
                            url: StationIcon, // Use imported icon
                            scaledSize: new window.google.maps.Size(30, 30) // Adjust size as needed
                        }}
                    />
                ))}





                {visitedPoints.length > 1 && (
                    <Polyline
                        path={visitedPoints} // Connect all visited points
                        options={{
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                        }}
                    />
                )}

                {/* Mark the first position */}
                {visitedPoints.length > 0 && (
                    <Marker
                        position={visitedPoints[0]} // First position
                        icon={{
                            url: TrainIcon, // Use imported icon
                            scaledSize: new window.google.maps.Size(30, 30) // Adjust size as needed
                        }}
                    />
                    
                )}

                {markerPosition && (
                    <Marker 
                        position={markerPosition} 
                        icon={{
                            url: TrainIcon, // Use imported icon
                            scaledSize: new window.google.maps.Size(30, 30) // Adjust size as needed
                        }}
                    />
                )}
            </GoogleMap>
            
        </LoadScript>
    );
};

export default RealtimeAnimateVer3;
