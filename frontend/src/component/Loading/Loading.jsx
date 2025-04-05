import React from "react";
import "./Loading.css";

const LoadingSpinner = () => {
  return (
    <div className="spinner-wrapper">
      <div className="spinner"></div>
      <p className="spinner-text">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
