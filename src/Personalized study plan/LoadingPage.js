import React from "react";
import "./LoadingPage.css"; // Create CSS for loading spinner

const LoadingPage = () => {
  return (
    <div className="loading__container">
      <div className="loading__spinner"></div>
      <h1>Generating Your Study Plan...</h1>
    </div>
  );
};

export default LoadingPage;
