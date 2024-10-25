// YouTubeSearch.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlay } from '@fortawesome/free-solid-svg-icons';
import './YouTubeSearch.css'; // Import the CSS file
import FooterNav from '../app_modules/footernav';

const YouTubeSearch = () => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('https://g3zvcp57-8080.inc1.devtunnels.ms/api/youtube/recommendations');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const searchVideos = async () => {
    if (!query) return fetchRecommendations(); // Show recommendations if query is empty

    try {
      const response = await axios.get('https://g3zvcp57-8080.inc1.devtunnels.ms/api/youtube/search', { params: { query } });
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  // Handle search on Enter key press
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchVideos();
    }
  };

  return (
    <div className="youtube__Search__page__container">
      {/* Header */}
      <div className="youtube__Search__page__header">
        <img src='https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg' alt="YouTube Logo" className="youtube__Search__page__logo" />
      </div>

      <div className="youtube__Search__page__searchContainer">
        <div className="youtube__Search__page__inputContainer">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for videos"
            className="youtube__Search__page__input"
          />
          <button onClick={searchVideos} className="youtube__Search__page__button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

      <div className="youtube__Search__page__videoList">
        {videos.map(video => (
          <Link to={`/video/${video.videoId}`} key={video.videoId} className="youtube__Search__page__videoCardLink">
            <div className="youtube__Search__page__videoCard">
              <img src={video.thumbnail} alt={video.title} className="youtube__Search__page__videoImage" />
              <button className="youtube__Search__page__playButton">
                <FontAwesomeIcon icon={faPlay} />
              </button>
              <div className="youtube__Search__page__videoCardContent">
                <h3 className="youtube__Search__page__videoCardTitle">{video.title}</h3>
                <p className="youtube__Search__page__videoCardDescription">
                  {video.description.length > 100 ? `${video.description.slice(0, 100)}...` : video.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <FooterNav />
    </div>
  );
};

export default YouTubeSearch;
