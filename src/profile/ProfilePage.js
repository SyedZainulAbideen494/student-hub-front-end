import React, { useEffect, useState } from 'react';
import './ProfilePage.css';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { Link, useNavigate } from 'react-router-dom';
import FooterNav from '../app_modules/footernav';
import { FaSignOutAlt, FaCrown } from 'react-icons/fa'; // Import FaCrown
import LoadingSpinner from '../app_modules/LoadingSpinner';

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
  const [isPremium, setIsPremium] = useState(null);
  const navigate = useNavigate();

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
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
        .then(response => setIsPremium(response.data.premium))
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // Full viewport height to center vertically
          width: '100vw', // Full viewport width to center horizontally
          backgroundColor: '#f8f8f8', // Optional: Add a light background
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile data available</p>;

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="settings-icon-button" onClick={handleLogout} style={{ color: 'black' }}>
          <FaSignOutAlt className="icon-footer-nav" />
          <span className="btn-label">Logout</span>
        </button>
        <Link to="/settings">
          <button className="settings-icon-button">
            <i className="fas fa-cog">{hasProfileIssues && <span className="issue-icon">!</span>}</i>
          </button>
        </Link>
      </header>
      <div className="profile-info">
        <div className={`profile-avatar-container ${isPremium ? 'premium' : ''}`}>
          <img
            className="profile-avatar__profile"
            src={`${API_ROUTES.displayImg}/${profile.avatar}` || 'default-avatar-url'}
            alt="Profile Avatar"
          />
          {isPremium && <FaCrown className="crown-icon" />}
        </div>
        <p className="profile-username">
  {profile.user_name && profile.user_name.toLowerCase() !== 'null' ? profile.user_name : 'Username not provided'}
</p>
<p className="profile-bio" style={{ whiteSpace: 'pre-wrap' }}>
  {profile.bio && profile.bio.toLowerCase() !== 'null' ? profile.bio : 'No bio available'}
</p>

        <p className="profile-unique-id">@{profile.unique_id}</p>
        <div className="profile-actions">
          {/* Additional profile actions can be added here */}
        </div>
      </div>

      <FooterNav />
    </div>
  );
};

export default ProfilePage;