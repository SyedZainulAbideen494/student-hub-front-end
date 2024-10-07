import React, { useState } from 'react';
import './SeasonalBanner.css'; // Import the CSS file
import BannerImgSeason from './images/season1.jpg'; // Use your image import

const SeasonalBanner = () => {
  const [isHovered, setIsHovered] = useState(false); // State for hover effect

  return (
    <div
      className="banner-container__Seasonal__banner__component"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={BannerImgSeason} // Use your image import
        alt="Seasonal Banner"
        className="banner-image__Seasonal__banner__component"
      />
      <div className={`banner-content__Seasonal__banner__component ${isHovered ? 'hovered' : ''}`}>
        <h1>Seasonal Specials</h1>
        <p>Discover the best of the season!</p>
        <button className="explore-button__Seasonal__banner__component">Explore More</button>
      </div>
    </div>
  );
};

export default SeasonalBanner;
