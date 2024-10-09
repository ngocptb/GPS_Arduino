import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import "./Pagination.css"; 

const Pagination = () => {
    // coordinates: Holds the data retrieved from Firebase.
    const [coordinates, setCoordinates] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(20); // Default to 20 items per page


    useEffect(() => {
        const db = getDatabase();
        const coordinatesRef = ref(db, 'coordinates');

        const unsubscribe = onValue(coordinatesRef, (snapshot) => {
            const coords = snapshot.val();
            const coordsArray = [];
            const currentTime = Date.now(); // Capture the current timestamp

            for (let id in coords) {
                coordsArray.push({ id, ...coords[id], receivedTime: currentTime });
            }
            setCoordinates(coordsArray);
        });

        // Adjust itemsPerPage based on screen size
        const updateItemsPerPage = () => {
            if (window.innerWidth <= 768) {
                setItemsPerPage(5); // 5 items for mobile
            } else {
                setItemsPerPage(20); // 20 items for desktop
            }
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);

        return () => {
            unsubscribe();
        }
    }, []);

    // Function to format the timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    // Calculate the data to display based on the current page
    const indexOfLastCoord = (currentPage + 1) * itemsPerPage;
    const indexOfFirstCoord = indexOfLastCoord - itemsPerPage;
    // currentCoords is the subset of coordinates that corresponds to the current page
    const currentCoords = coordinates.slice(indexOfFirstCoord, indexOfLastCoord);

    const totalPages = Math.ceil(coordinates.length / itemsPerPage);

    return (
        <div className="coordinate-container">
            <h3>Data Coordinates In Firebase</h3>
            <ul>
                {currentCoords.map(coord => (
                    <li key={coord.id}>
                        Latitude: {coord.latitude}, Longitude: {coord.longitude}, 
                        Received Time: {formatTimestamp(coord.receivedTime)}
                    </li>
                ))}
            </ul>
            <div className="pagination">
                <button 
                    className="pagination-button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0}
                >
                    Previous
                </button>
                <span>Page {currentPage + 1} of {totalPages}</span>
                <button
                    className="pagination-button" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                    disabled={currentPage === totalPages - 1}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
