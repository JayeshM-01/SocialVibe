import React from 'react';
import './loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="container">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
      </div>
    </div>
  );
};

export default Loader;
