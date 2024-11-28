import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaComment, FaRegThumbsUp, FaTrash } from 'react-icons/fa'; // Import FaTrash for delete icon
import './eduScribe.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';

const EduScribe = ({ activeTab }) => {
  const [eduscribes, setEduscribes] = useState([]);
  const [liked, setLiked] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null); // Track current user's ID
  const [deleteId, setDeleteId] = useState(null); // Track eduscribe to delete
  const navigate = useNavigate();

  // Fetch current user profile
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User not authenticated');
        }

        const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
        setCurrentUserId(data.id); // Store the current user's ID
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  // Fetch all Eduscribes
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

  // Handle like functionality
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

  // Display likes count based on hardcoded IDs
  const displayLikesCount = (eduscribe) => {
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
        return eduscribe.likesCount;
    }
  };

  // Handle delete eduscribe
  const handleDelete = async (deleteId) => {
    try {
      await axios.delete(`${API_ROUTES.deleteEduScribe}/${deleteId}`);
      setEduscribes(eduscribes.filter(eduscribe => eduscribe.id !== deleteId));
    } catch (err) {
      console.error('Error deleting eduscribe:', err);
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
              {/* Display delete button if the current user is the owner */}
              
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
            <button 
              className={`eduscribe-action-button eduscribe-like-button ${liked[eduscribe.id] ? 'liked' : ''}`} 
              onClick={() => handleLike(eduscribe.id)}
            >
              <FaComment 
                className={`eduscribe-like-icon`}
                size={20}
              />
            </button>
            {currentUserId === eduscribe.user_id && (
                <button className="delete-button" onClick={() => handleDelete(eduscribe.id)}style={{marginLeft: '40px'}}>
                <i className="fas fa-trash"></i>
                </button>
              )}
          </div>
        </div>
      ))}
      <FooterNav />
    </div>
  );
};

export default EduScribe;
