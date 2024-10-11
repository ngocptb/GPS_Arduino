import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { ref, onValue } from 'firebase/database';
import TrainIcon from '../images/train2.png';
import StationIcon from '../images/station.png';
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
                zoom={15}
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
