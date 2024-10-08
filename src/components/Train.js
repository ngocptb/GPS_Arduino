import React from 'react';
import './Train.css';

const MetroTrain = () => {
    return (
        <div className="metro-container">
            {/* First Train */}
            <div className={`metro train-animation`} style={{ animationDelay: '0s'   }}>
                <div className="wheel left"></div>
                <div className="wheel right"></div>
            </div>
            {/* Second Train */}
            <div className={`metro train-animation`} style={{ animationDelay: '0.4s'  }}>
                <div className="wheel left"></div>
                <div className="wheel right"></div>
            </div>
            {/* Third Train */}
            <div className={`metro train-animation`} style={{ animationDelay: '0.8s'  }}>
                <div className="wheel left"></div>
                <div className="wheel right"></div>
            </div>
        </div>
    );
};

export default MetroTrain;