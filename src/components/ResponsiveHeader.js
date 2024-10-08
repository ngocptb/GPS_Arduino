import React, { useState } from 'react';
import "./ResponsiveHeader.css"; 
import { Link } from 'react-router-dom';
import { PinDropOutlined, ShareLocationOutlined, HomeOutlined } from '@mui/icons-material';
import CompanyLogo from '../images/Image1.png';

const ResponsiveHeader = () => {
  const [click, setClick] = useState(false);
  const currentTime = new Date().toLocaleTimeString(); // Example for current time

  const handleClick = () => setClick(!click);

  const [active, IsActive] = useState(false);

    const handleNavClick = () =>{
        IsActive(false);
    }

  return (
    <div className='Navbar'>
            <span className='nav-logo'>
                <img src={CompanyLogo} alt="" />
            </span>
            <span>
              <p>Time</p>
            </span>

            <div className={`nav-items ${active && "switch"}`}>
                <a>The Telecommunication And Signaling Team</a>
                <Link to={"/"} onClick={handleNavClick}>Home</Link>
                <Link to={"/about"} onClick={handleNavClick}>About</Link>
                <Link to={"/services"} onClick={handleNavClick}>Services</Link>
                <Link to={"/contact"} onClick={handleNavClick}>Contact</Link>
                <button>
                    <span>Get Started</span>
                </button>
            </div>

            <div className={`nav-toggle ${active && "switch"}`}
            onClick={() => IsActive(!active)}>
                <div className='hamburger'></div>
            </div>
    </div>
  );
};

export default ResponsiveHeader;
