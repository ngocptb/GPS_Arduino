import React from "react";
import CompanyLogo from '../images/Image1.png';
import "./Header.css"; 
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ShareLocationOutlinedIcon from '@mui/icons-material/ShareLocationOutlined';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';


function Header() {
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
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <p>The Telecommunication And Signaling Team</p>
          <div className='nav-menu'>{currentTime}</div>

          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
            <Link to="/manual"><PinDropOutlinedIcon className='nav-links' fontSize="large"/> </Link> 
            </li>
            <li className='nav-item'>
              <ShareLocationOutlinedIcon className='nav-links' fontSize="large"/>  
            </li>
            <li className='nav-item'>
              <Link to="/home"><HomeOutlinedIcon className='nav-links' fontSize="large"/></Link>
            </li>
           
            <li className='nav-item'>
              <img src={CompanyLogo} alt="Company" className='nav-logo'/>
            </li>


          </ul>
          
        </div>
      </nav>
     
    </>
  );
}

export default Header;
