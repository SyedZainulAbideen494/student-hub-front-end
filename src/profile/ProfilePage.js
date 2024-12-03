import React, { useEffect, useState } from 'react';
import './ProfilePage.css';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { Link, useNavigate } from 'react-router-dom';
import FooterNav from '../app_modules/footernav';
import { FaSignOutAlt } from 'react-icons/fa';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Flashcards');
  const [flashcards, setFlashcards] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [eduscribes, setEduScribe] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [touchStartX, setTouchStartX] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate()



  const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/login');
  };


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

  const hasProfileIssues = profile && (!profile.user_name || !profile.bio);

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
          const { data } = await axios.post(API_ROUTES.getUserOwnProfileEdusify, { token });
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
      const images = posts.find(post => post.id === postId).images;
      const newIndex = (prevIndices[postId] - 1 + images.length) % images.length;
      return { ...prevIndices, [postId]: newIndex };
    });
  };

  const handleNextImage = (postId) => {
    setCurrentImageIndex((prevIndices) => {
      const images = posts.find(post => post.id === postId).images;
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

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_ROUTES.deleteEduScribe}/${deleteId}`);
      setEduScribe(eduscribes.filter(eduscribe => eduscribe.id !== deleteId));
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting eduscribe:', err);
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile data available</p>;

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h3>Profile</h3>
        <button className="nav-btn-footer-nav" onClick={handleLogout} style={{color: 'black'}}>
                    <FaSignOutAlt className="icon-footer-nav" />
                    <span className="btn-label">Logout</span>
                </button>
        <Link to="/settings">
          <button className="settings-icon-button">
            <i className="fas fa-cog">{hasProfileIssues && <span className="issue-icon">!</span>}</i> {/* Font Awesome cog icon */}
          </button>
        </Link>

      </header>
      <div className="profile-info">
        <img
          className="profile-avatar__profile"
          src={`${API_ROUTES.displayImg}/${profile.avatar}` || 'default-avatar-url'}
          alt="Profile Avatar"
        />
        <h2 className="profile-name">{profile.name}</h2>
        <p className="profile-username">{profile.user_name}</p>
        <p className="profile-bio">{profile.bio}</p>
        <p className="profile-unique-id">@{profile.unique_id}</p>
        <div className="profile-actions">
          {/* Additional profile actions can be added here */}
        </div>
      </div>
      <div className="profile-media">
        <div className="profile-tabs">
          {['Notes', 'Quizzes', 'EduScribe'].map(tab => (
            <button
              key={tab}
              className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          <div className="profile-tab-underline" style={{ width: `${100 / 4}%`, left: `${['Flashcards', 'Quizzes', 'EduScribe', 'Posts'].indexOf(activeTab) * (100 / 4)}%` }} />
        </div>
        <div className="profile-content">
          {activeTab === 'Notes' && flashcards.map((card, index) => (
            <div key={index} className="card flashcard-item">
              <Link to={`/note/view/${card.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                <div className="card-content">{card.title}</div>
              </Link>
            </div>
          ))}
          {activeTab === 'Quizzes' && quizzes.map((quiz, index) => (
            <div key={index} className="card quiz-item">
              <Link to={`/quiz/${quiz.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                <div className="card-content">{quiz.title}</div>
              </Link>
            </div>
          ))}
            {activeTab === 'EduScribe' && eduscribes.map((eduscribe) => (
            <div key={eduscribe.id} className="card-user-profile-guest eduscribe-item-user-profile-guest">
              
              <div className="eduscribe-header">
                
                <Link to={`/profile/${profile.id}`}>
                  <img
                    src={`${API_ROUTES.displayImg}/${profile.avatar}`}
                    alt="Profile Avatar"
                    className="eduscribe-avatar"
                  />
                </Link>
     
                <div className="eduscribe-info">
                  <Link to={`/profile/${profile.id}`} className="eduscribe-username">
                    {profile.user_name}
                  </Link>
                  <span className="eduscribe-date">{new Date(eduscribe.created_at).toLocaleString()}</span>
                </div>
                <button className="delete-button" onClick={() => openDeleteModal(eduscribe.id)} style={{marginLeft: '40px'}}>
<i className="fas fa-trash"></i>
</button>
              </div>
              <div className="eduscribe-content">{eduscribe.content}</div>
              
              {eduscribe.image && (
                <img
                  src={`${API_ROUTES.displayImg}/${eduscribe.image}`}
                  alt="Eduscribe"
                  className="eduscribe-image"
                />
              )}
              
            </div>
          ))}
          
{showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to delete this EduScribe?</p>
      <button className="modal-button" onClick={handleDelete}>Yes, Delete</button>
      <button className="modal-button" onClick={closeDeleteModal}>Cancel</button>
    </div>
  </div>
)}



        </div>
      </div>
      <FooterNav />
    </div>
  );
};

export default ProfilePage;
