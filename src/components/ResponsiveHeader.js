import React from "react";
import CompanyLogo from '../images/Image1.png';
import "./ResponsiveHeader.css"; 
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ShareLocationOutlinedIcon from '@mui/icons-material/ShareLocationOutlined';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';


function ResponsiveHeader() {
  const [click, setClick] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const updateTime = () => {
    const now = new Date();
    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    setCurrentTime(now.toLocaleString('en-US', options));
  };

  useEffect(() => {
    updateTime();
    const timer = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(timer); // Clean up on component unmount
  }, []);
  

  return (
    <nav className='navbar'>
    <div className='navbar-container'>
        <p className='header-text'>The Telecommunication And Signaling Team</p>
        <p className='header-text'>{currentTime}</p>
        <li className='nav-links'><PinDropOutlinedIcon fontSize="large"/></li> 
        <li className='nav-links'><ShareLocationOutlinedIcon fontSize="large"/></li>
        <li className='nav-links'><HomeOutlinedIcon fontSize="large"/></li> 
        <div className='menu-icon' onClick={() => setClick(!click)}>
            <span className='menu-icon-line'></span>
            <span className='menu-icon-line'></span>
            <span className='menu-icon-line'></span>
        </div>
        <img src={CompanyLogo} alt="Company" className='nav-logo' />
    </div>

    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
        <li className='nav-item'>
            <PinDropOutlinedIcon className='nav-links' fontSize="small" />
        </li>
        <li className='nav-item'>
            <ShareLocationOutlinedIcon className='nav-links' fontSize="large" />
        </li>
        <li className='nav-item'>
            <Link to="/home"><HomeOutlinedIcon className='nav-links' fontSize="large" /></Link>
        </li>
    </ul>
</nav>
  );
}

export default ResponsiveHeader;
