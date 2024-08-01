import React, { useEffect, useState } from 'react';
import './ProfilePage.css';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { Link } from 'react-router-dom';
import FooterNav from '../app_modules/footernav';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Flashcards');
  const [flashcards, setFlashcards] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [eduScribe, setEduScribe] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [touchStartX, setTouchStartX] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }

        const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
        setProfile(data);
      } catch (err) {
        setError('Error fetching profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const fetchDataForActiveTab = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        if (activeTab === 'Flashcards') {
          const { data } = await axios.get(API_ROUTES.getUserNotes, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFlashcards(data.filter(card => card.is_public === 'true'));
        } else if (activeTab === 'Quizzes') {
          const { data } = await axios.post(API_ROUTES.getUserQuizzes, { token });
          setQuizzes(data);
        } else if (activeTab === 'EduScribe') {
          const { data } = await axios.post('http://localhost:8080/getEduScribe', { token });
          setEduScribe(data);
        } else if (activeTab === 'Posts') {
          const { data } = await axios.post(API_ROUTES.getUserPosts, { token });
          setPosts(data);
          const initialIndices = data.reduce((acc, post) => {
            acc[post.id] = 0;
            return acc;
          }, {});
          setCurrentImageIndex(initialIndices);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchDataForActiveTab();
  }, [activeTab]);

  const handlePrevImage = (postId) => {
    setCurrentImageIndex((prevIndices) => {
      const images = posts.find(post => post.id === postId)?.images || [];
      const newIndex = (prevIndices[postId] - 1 + images.length) % images.length;
      return { ...prevIndices, [postId]: newIndex };
    });
  };

  const handleNextImage = (postId) => {
    setCurrentImageIndex((prevIndices) => {
      const images = posts.find(post => post.id === postId)?.images || [];
      const newIndex = (prevIndices[postId] + 1) % images.length;
      return { ...prevIndices, [postId]: newIndex };
    });
  };

  const handleDotClick = (postId, index) => {
    setCurrentImageIndex((prevIndices) => ({
      ...prevIndices,
      [postId]: index
    }));
  };

  const handleTouchStart = (event, postId) => {
    if (event.touches.length > 0) {
      setTouchStartX({ ...touchStartX, [postId]: event.touches[0].clientX });
    }
  };

  const handleTouchEnd = (event, postId) => {
    if (event.changedTouches.length > 0) {
      const touchEndX = event.changedTouches[0].clientX;
      const touchStartXValue = touchStartX[postId];
      
      if (touchStartXValue !== undefined) {
        const swipeThreshold = 50; // Adjust this value as needed
        if (touchStartXValue - touchEndX > swipeThreshold) {
          handleNextImage(postId);
        } else if (touchEndX - touchStartXValue > swipeThreshold) {
          handlePrevImage(postId);
        }
        setTouchStartX({ ...touchStartX, [postId]: undefined }); // Reset touch start position
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-page">
      <header>
        <h1>&larr;</h1>
      </header>
      <div className="profile">
        {profile && (
          <>
            <img className="avatar"
             src={`${API_ROUTES.displayImg}/${profile.avatar || 'default-avatar-url'}`} 
             alt="avatar"
             />
            <h2>{profile.user_name}</h2>
            <p>@{profile.unique_id}</p>
            <p>{profile.location}</p>
            <div className="stats">
              <div> Fans</div>
              <div> Following</div>
              <div> Posts</div>
              <div> Stories</div>
            </div>
            <div className="actions">
              <button className="follow">Follow</button>
              <button className="message">Message</button>
            </div>
          </>
        )}
      </div>
      <div className="media">
        <div className="tabs">
          <button onClick={() => setActiveTab('Flashcards')}>Flashcards</button>
          <button onClick={() => setActiveTab('Quizzes')}>Quizzes</button>
          <button onClick={() => setActiveTab('EduScribe')}>EduScribe</button>
          <button onClick={() => setActiveTab('Posts')}>Posts</button>
        </div>
        <div className="photos">
          {/* Render photos based on activeTab */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;