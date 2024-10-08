import React, { useState , useEffect  } from 'react';
import "./FileReader.css"; 
import MyMapComponent from './MyMap';





const FileUpLoader = () => {
  const [fileContent, setFileContent] = useState('');
  const [parsedData, setParsedData] = useState({});
  const [time, setTime] = useState('');
  const [formattedLatitude, setFormattedLatitude] = useState('');
  const [formattedLongitude, setFormattedLongitude] = useState('');
  
  var myContent = "";


  const handleFileChange = (event) => {
    const file = event.target.files[0]; 
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);
        parseNmeaSentence(content);
      };

      reader.onerror = (e) => {
        console.error("Error reading file", e);
      };
      reader.readAsText(file);
    }

  };
  
  const parseNmeaSentence = (sentence) => {
    // Check if the sentence starts with $GNGGA
    if (sentence.startsWith('$GPGGA')) {
      const parts = sentence.split(',');

      const timeInUTC = parts[1]; // '094350.000'
      const formattedTime = convertUTCToTimeString(timeInUTC);
      setTime(formattedTime);

      const latitude = parts[2]; // '1046.39939'
      // const formattedLat = convertLatitude(latitude);
      // setFormattedLatitude(formattedLat);
      setFormattedLatitude(convertToDegreesMinutes(latitude));

      const longitude = parts[4]; // '10639.40447'
      // const formattedLon = convertLongitude(longitude);
      // setFormattedLongitude(formattedLon);
      setFormattedLongitude(convertToDegreesMinutes(longitude));

      if (parts.length >= 15) {
        const data = {
          time: parts[1],
          latitude: parts[2],
          northSouth: parts[3],
          longitude: parts[4],
          eastWest: parts[5],
          fixQuality: parts[6],
          satellites: parts[7],
          hdop: parts[8],
          altitude: parts[9],
          altitudeUnits: parts[10],
          geoidalSeparation: parts[11],
          geoidalUnits: parts[12],
        };
        setParsedData(data);

      } else {
        console.error("Invalid NMEA sentence");
      }
    } else {
      console.error("Not a GNGGA sentence");
    }
  };

  const convertUTCToTimeString = (utcTime) => {
    const hours = utcTime.slice(0, 2);
    const minutes = utcTime.slice(2, 4);
    const seconds = utcTime.slice(4, 6);
    const milliseconds = utcTime.slice(7, 10);

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  };


  const convertLatitude = (lat) => {
    const degrees = Math.floor(lat.slice(0, 2));
    const minutes = lat.slice(2); // This includes the decimal part
    return `${degrees}° ${minutes}`;
  };

  const convertLongitude = (lon) => {
    const degrees = Math.floor(lon.slice(0, 3)); // First three digits for degrees
    const minutes = lon.slice(3); // Remaining part for minutes
    return `${degrees}° ${minutes}'`; // Format as desired
  };


  const convertToDegreesMinutes = (decimalDegrees) => {
    const degrees = decimalDegrees > 10000 ?  Math.floor(decimalDegrees.slice(0, 3)) : Math.floor(decimalDegrees.slice(0, 2));
    const minutes = decimalDegrees - degrees // Get minutes with 5 decimal precision
  
    return `${degrees}° ${minutes}′`;
  };
  


 


  return (
    <div className="split-screen" >
      <div className="left-section" >
        <div className="file-upload">
          <h3>Arduino GPS Reader</h3>
          <br/>
          <input type="file" accept=".txt" onChange={handleFileChange} />
        </div>
     
      {/* <div>
        <p>File Content:</p>
        <pre>{fileContent}</pre>
        <p>NMEA GNGGA Parser</p>
        <pre>{JSON.stringify(parsedData, null, 2)}</pre>
      </div> */}
     
      <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ margin: '0' }}>Time</h3>
            <h4 style={{ margin: '0', marginLeft: '10px' }}>{time} &nbsp; UTC</h4>
      </div>
      <br/>
      <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ margin: '0' }}>The Latitude</h3>
            <h4 style={{ margin: '0', marginLeft: '10px' }}>{formattedLatitude}&nbsp;{parsedData.northSouth}</h4>
      </div>
      <br/>
      <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ margin: '0' }}>The Longitude</h3>
            <h4 style={{ margin: '0', marginLeft: '10px' }}>{formattedLongitude}&nbsp;{parsedData.eastWest}</h4>
      </div>
      <br/>
      <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ margin: '0' }}>The Altitude</h3>
            <h4 style={{ margin: '0', marginLeft: '10px' }}>{parsedData.altitude}&nbsp;<i>In meters above mean sea level</i></h4>
      </div>
      <br/>
      <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ margin: '0' }}>Fix Quality</h3>
            <h4 style={{ margin: '0', marginLeft: '10px' }}>{parsedData.fixQuality}</h4>
      </div>
      <br/>
      <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ margin: '0' }}>Satellites in use</h3>
            <h4 style={{ margin: '0', marginLeft: '10px' }}>{parsedData.satellites}</h4>
      </div>
      <br/>
      <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ margin: '0' }}>HDOP</h3>
            <h4 style={{ margin: '0', marginLeft: '10px' }}>{parsedData.hdop}</h4>
      </div>
      <br/>
      </div>


      
      <div className='right-section'>
        {/* <iframe id='gmap_canvas' width="520" height="400" frameborder="0" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=520&amp;height=400&amp;hl=en&amp;q=Long%20B%C3%ACnh,%20Th%E1%BB%A7%20%C4%90%E1%BB%A9c,%20Ho%20Chi%20Minh,%20Viet%20Nam+(C%C3%B4ng%20ty%20Metro%20HCM)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/">gps vehicle tracker</a></iframe> */}
        {/* <iframe id='gmap_canvas' width="100%" height="100%" src="https://maps.google.com/maps?width=520&amp;height=400&amp;hl=en&amp;q=Long%20B%C3%ACnh,%20Th%E1%BB%A7%20%C4%90%E1%BB%A9c,%20Ho%20Chi%20Minh,%20Viet%20Nam+(C%C3%B4ng%20ty%20Metro%20HCM)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/">gps vehicle tracker</a></iframe> */}
        {/* <GoogleMapComponent /> */}
        <MyMapComponent  />
       
      </div>
      
    
      
    </div>
  );
};

export default FileUpLoader;
