import React from 'react';
import './Loader.scss';

const Loader = ({ size = 'medium', fullScreen = false, text = 'Kraunama...' }) => {
  const loaderClasses = `loader loader-${size} ${fullScreen ? 'loader-fullscreen' : ''}`;
  
  return (
    <div className={loaderClasses}>
      <div className="loader-container">
        <div className="spinner-container">
          <div className="spinner-outer">
            <div className="spinner-inner"></div>
          </div>
        </div>
        {text && <p className="loader-text">{text}</p>}
      </div>
    </div>
  );
};

export default Loader;