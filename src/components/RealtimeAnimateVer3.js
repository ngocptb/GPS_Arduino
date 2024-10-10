import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { ref, onValue } from 'firebase/database';
import TrainIcon from '../images/train3.png';
import { db } from '../firebaseConfig'; // Adjust the path as needed

const RealtimeAnimateVer3 = () => {
    const [locations, setLocations] = useState([]);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [visitedPoints, setVisitedPoints] = useState([]); // Store visited points
    const mapContainerStyle = {
        height: "100%",
        width: "100%"
    };

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
                }
            }
        });

        return () => unsubscribe(); // Cleanup subscription
    }, []); // Only run once

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={markerPosition || { lat: 10.7769, lng: 106.6959 }} // Default center
                zoom={17}
            >
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
