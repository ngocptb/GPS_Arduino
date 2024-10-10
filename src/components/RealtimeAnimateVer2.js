import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { ref, onValue } from 'firebase/database';
import TrainIcon from '../images/train2.png';
import { db } from '../firebaseConfig'; // Adjust the path as needed

const RealtimeAnimateVer2 = () => {
    const [locations, setLocations] = useState([]);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [visitedPoints, setVisitedPoints] = useState([]); // Store visited points
    const [lastUpdate, setLastUpdate] = useState(Date.now()); // Track last update time
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

                // Update locations and visited points
                if (markerPosition === null && locationList.length > 0) {
                    const firstLocation = locationList[0];
                    setMarkerPosition(firstLocation);
                    setVisitedPoints([firstLocation]); // Initialize with the first location
                }

                const latestLocation = locationList[locationList.length - 1];
                if (latestLocation) {
                    setMarkerPosition(latestLocation); // Move marker to the latest position
                    setLastUpdate(Date.now()); // Reset last update time
                    setVisitedPoints(prev => {
                        // Only add the latest location if it's new
                        if (!prev.some(pt => pt.lat === latestLocation.lat && pt.lng === latestLocation.lng)) {
                            return [...prev, latestLocation];
                        }
                        return prev; // No change if the point already exists
                    });
                }
            }
        });

        return () => unsubscribe(); // Cleanup subscription
    }, []); // Only run once

    useEffect(() => {
        const checkForUpdates = setInterval(() => {
            if (Date.now() - lastUpdate > 10000 && markerPosition) { // If no update in 10 seconds
                setVisitedPoints(prev => {
                    if (!prev.some(pt => pt.lat === markerPosition.lat && pt.lng === markerPosition.lng)) {
                        return [...prev, markerPosition]; // Mark last position
                    }
                    return prev; // No change if the point already exists
                });
            }
        }, 1000); // Check every second

        return () => clearInterval(checkForUpdates); // Cleanup interval
    }, [lastUpdate, markerPosition]); // Depend on lastUpdate and markerPosition

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={markerPosition || { lat: 10.7769, lng: 106.6959 }} // Default center
                zoom={12}
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

export default RealtimeAnimateVer2;
