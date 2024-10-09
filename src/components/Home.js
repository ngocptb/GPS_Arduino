import RealtimeAnimate from "./RealtimeAnimate";
import RealTimeMap from "./RealtimeMap";
import CoordinateForm from "./CoordinateForm";
import Pagination from "./Pagination";
import "./Home.css"; 
import React from 'react';



const Home = () => {
    return (
        <div className="split-screen" >
            <div className="left-section" >
                <Pagination/>
            </div>
            <div className='right-section'>
                <RealtimeAnimate/>
            </div>
        </div>
    );

};

export default Home;