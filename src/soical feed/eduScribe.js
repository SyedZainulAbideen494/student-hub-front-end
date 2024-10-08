import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaRegThumbsUp } from 'react-icons/fa';
import './eduScribe.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';

const EduScribe = ({ activeTab }) => {
  const [eduscribes, setEduscribes] = useState([]);
  const [liked, setLiked] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEduscribes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User not authenticated');
        }

        const { data } = await axios.get(API_ROUTES.fetchAllEduscribes, {
          headers: {
            Authorization: token
          },
          params: { tab: activeTab }
        });

        // Shuffle the eduscribes array
        const shuffledEduscribes = data.sort(() => Math.random() - 0.5);
        setEduscribes(shuffledEduscribes);

        const likedState = {};
        shuffledEduscribes.forEach(eduscribe => {
          likedState[eduscribe.id] = eduscribe.isLiked > 0;
        });
        setLiked(likedState);
      } catch (error) {
        console.error('Error fetching Eduscribes:', error);
      }
    };

    fetchEduscribes();
  }, [activeTab]);

  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      await axios.post(`${API_ROUTES.handleLikeEduscribes}/${id}`, { token });
      setLiked((prev) => ({
        ...prev,
        [id]: !prev[id]
      }));
    } catch (error) {
      console.error('Error liking eduscribe:', error.response ? error.response.data : error.message);
    }
  };

  const displayLikesCount = (eduscribe) => {
    // Hard-code likes for specific eduscribe IDs
    switch (eduscribe.id) {
      case 11:
        return "20k";
      case 12:
        return "14k";
      case 15:
        return "7k";
      case 18:
        return "22k";
      default:
        // Otherwise, show the actual likes count
        return eduscribe.likesCount;
    }
  };

  return (
    <div className="eduscribe-container">
      {eduscribes.map((eduscribe) => (
        <div key={eduscribe.id} className="eduscribe-card">
          <div className="eduscribe-header">
            <a href={`/profile/${eduscribe.user_id}`}>
              <img
                src={`${API_ROUTES.displayImg}/${eduscribe.avatar}`}
                alt="Profile Avatar"
                className="eduscribe-avatar"
              />
            </a>
            <div className="eduscribe-info">
              <a href={`/profile/${eduscribe.user_id}`} className="eduscribe-username">
                {eduscribe.user_name || 'User'}
              </a>
            </div>
          </div>
          <div className="eduscribe-content" style={{ whiteSpace: 'pre-wrap' }}>
            {eduscribe.content}
          </div>
          {eduscribe.image && (
            <img
              src={`${API_ROUTES.displayImg}/${eduscribe.image}`}
              alt="Eduscribe"
              className="eduscribe-image"
            />
          )}
          <div className="eduscribe-actions">
            <button 
              className={`eduscribe-action-button eduscribe-like-button ${liked[eduscribe.id] ? 'liked' : ''}`} 
              onClick={() => handleLike(eduscribe.id)}
            >
              <FaRegThumbsUp 
                className={`eduscribe-like-icon ${liked[eduscribe.id] ? 'liked' : ''}`}
                size={20}
              />
              <span>Like {displayLikesCount(eduscribe)}</span>
            </button>
          </div>
        </div>
      ))}
      <FooterNav />
    </div>
  );
};

export default EduScribe;
