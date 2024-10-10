import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Adjust the path as necessary
import { ref, set, onValue } from 'firebase/database';
import "./CoordinateForm.css"; 


// add data latitude and longitude to firebase
const CoordinateForm = () => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [coordinates, setCoordinates] = useState([]);
    const showtime = Date.now();

    useEffect(() => {
        const coordinatesRef = ref(db, 'coordinates');
        onValue(coordinatesRef, (snapshot) => {
            const coords = snapshot.val();
            const currentTime = Date.now(); // Capture the current timestamp when receive data
            const coordsArray = [];
            for (let id in coords) {
                coordsArray.push({ id, ...coords[id] , 
                    receivedTime: currentTime // Add received time to each coordinate
                 });
            }
            setCoordinates(coordsArray);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const timestamp = Date.now();

        const newCoord = {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            time: timestamp,
        };

        await saveCoordinates(newCoord);

         // Clear the inputs after submission

        setLatitude('');
        setLongitude('');
    };

    const saveCoordinates = async (coord) => {
        try {
            await set(ref(db, 'coordinates/' +  Date.now()), coord); // Unique ID for each entry
            console.log('Coordinates saved successfully');
        } catch (error) {
            console.error('Error saving coordinates:', error);
        }
    };

    // Function to format the timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString(); // Adjust format as needed
    };

    return (
        <div>
            <h2>Store Latitude and Longitude</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            {/* <h2>Stored Coordinates In FireBase</h2>
            <ul>
                {coordinates.map((coord) => (
                    <li key={coord.id} >
                        Latitude: {coord.latitude}, Longitude: {coord.longitude}, Received Time: {formatTimestamp(coord.receivedTime)}
                    </li>
                ))}
            </ul> */}
           
        </div>
    );
};

export default CoordinateForm;
