import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { ref, onValue } from 'firebase/database';
import TrainIcon from '../images/train2.png';
import { db } from '../firebaseConfig'; // Adjust the path as needed

const RealtimeAnimate = () => {
    const [locations, setLocations] = useState([]);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [visitedPoints, setVisitedPoints] = useState([]); // Store visited points
    const [currentIndex, setCurrentIndex] = useState(0);
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
                setLocations(locationList);
                setMarkerPosition(locationList[0]); // Set initial marker position
                setVisitedPoints([locationList[0]]); // Initialize visited points
            }
        });

        return () => unsubscribe(); // Cleanup subscription
    }, []);

    useEffect(() => {
        if (locations.length === 0) return;

        const interval = setInterval(() => {
            if (currentIndex < locations.length - 1) {
                const nextPosition = locations[currentIndex + 1];
                setMarkerPosition(nextPosition); // Move to next point
                setVisitedPoints(prev => [...prev, nextPosition]); // Add next position to visited points
                setCurrentIndex(prevIndex => prevIndex + 1);
            } else {
                clearInterval(interval); // Stop if at last point
            }
        }, 3000); // Move every 3 seconds

        return () => clearInterval(interval); // Cleanup interval
    }, [locations, currentIndex]);

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={markerPosition || { lat: 10.7769, lng: 106.6959 }} // Default center
                zoom={12}
            >
                {visitedPoints.length > 1 && ( // Ensure there are at least 2 points to draw a polyline
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
                    />)}
                {markerPosition && <Marker position={markerPosition} 
                        icon={{url: TrainIcon, // Use imported icon
                            scaledSize: new window.google.maps.Size(30, 30) // Adjust size as needed
                        }}/>}
                
            </GoogleMap>
        </LoadScript>
    );
};

export default RealtimeAnimate;
