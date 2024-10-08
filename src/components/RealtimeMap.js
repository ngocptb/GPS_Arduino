import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebaseConfig'; // Adjust the path as needed


const RealTimeMap = () => {
    const [locations, setLocations] = useState([]);
    const [directions, setDirections] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    const mapContainerStyle = {
        height: "100%",
        width: "100%"
    };

    const center = { lat: locations[0]?.lat || 0, lng: locations[0]?.lng || 0 };

    useEffect(() => {
        const locationsRef = ref(db, 'coordinates'); // Adjust path as needed
        const unsubscribe = onValue(locationsRef, (snapshot) => {
            const data = snapshot.val();
            if(data){

            const locationList = Object.values(data).map(item => ({
                lat: parseFloat(item.latitude), // Ensure it's a number
                lng: parseFloat(item.longitude)
            }));
            setLocations(locationList);
            if (locationList.length > 1) {
                calculateRoute(locationList[0], locationList[locationList.length - 1]);
            }
        } else{
            alert("No Data Available");
            console.error('No data available');
        }

        });

        return () => unsubscribe(); // Cleanup subscription
    }, []);

    const calculateRoute = (start, end) => {

        if (!window.google) {
            console.error('Google Maps not loaded');
            return;
        }
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin: new window.google.maps.LatLng(start.lat, start.lng),
                destination: new window.google.maps.LatLng(end.lat, end.lng),
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error(`Error fetching directions ${result}`);
                }
            }
        );
        console.log(start);
        console.log(end);
        console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    };

    return (
        <LoadScript googleMapsApiKey="AIzaSyC8HsyqOhE3LNUUJjTrpRU3tQRpNfflhSA" onLoad={() => setMapLoaded(true)}>
           
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={14}
            >
                {locations.map((location, index) => (
                    <Marker key={index} position={location} />
                ))}
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default RealTimeMap;
