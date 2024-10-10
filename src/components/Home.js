import RealtimeAnimate from "./RealtimeAnimate";
import RealTimeMap from "./RealtimeMap";
import RealtimeAnimateVer3 from "./RealtimeAnimateVer3";
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
                <RealtimeAnimateVer3/>
            </div>
        </div>
    );

};

export default Home;