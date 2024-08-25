import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaThumbsUp, FaComment, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import './userProfile.css';
import FooterNav from '../app_modules/footernav';
import { API_ROUTES } from '../app_modules/apiRoutes';

const UserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Flashcards');
  const [flashcards, setFlashcards] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [eduscribes, setEduscribes] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${API_ROUTES.profileView}/${id}`);
        setProfile(data);
        setLoading(false);

        // Check if the current user is following this profile
        if (token) {
          const response = await axios.post(`${API_ROUTES.isFollowing}`, { id, token });
          setIsFollowing(response.data.following); // Corrected access to response data
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to fetch profile data');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, token]);

  useEffect(() => {
    const fetchDataForActiveTab = async () => {
      if (!token) return;

      try {
        const { data } = await axios.get(`${API_ROUTES.profileItems}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (activeTab === 'Flashcards') {
          setFlashcards(data.flashcards);
        } else if (activeTab === 'Quizzes') {
          setQuizzes(data.quizzes);
        } else if (activeTab === 'EduScribe') {
          setEduscribes(data.eduscribes);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchDataForActiveTab();
  }, [activeTab, id, token]);

  const handleFollow = async () => {
    try {
      await axios.post(`${API_ROUTES.follow}`, { id, token });
      setIsFollowing(true);
    } catch (err) {
      console.error('Error following user:', err);
    }
  };
  
  const handleUnfollow = async () => {
    try {
      await axios.post(`${API_ROUTES.unfollow}`, { id, token });
      setIsFollowing(false);
    } catch (err) {
      console.error('Error unfollowing user:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile data available</p>;

  return (
    <div className="profile-page-user-profile-guest">
      <div className="profile-info">
        <img
          className="profile-avatar-user-profile-guest"
          src={`${API_ROUTES.displayImg}/${profile.avatar}` || 'default-avatar-url'}
          alt="Profile Avatar"
        />
        
        <h2 className="profile-name-user-profile-guest">{profile.name}</h2>
        <p className="profile-username-user-profile-guest">{profile.user_name}</p>
        <p className="profile-bio-user-profile-guest">{profile.bio}</p>
        <p className="profile-unique-id-user-profile-guest">@{profile.unique_id}</p>
        <p className="profile-location-user-profile-guest">{profile.location}</p>
        <button 
          className="follow-button-user-profile-guest" 
          onClick={isFollowing ? handleUnfollow : handleFollow}
        >
          {isFollowing ? <FaUserMinus className="react-icon" /> : <FaUserPlus className="react-icon" />} 
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </div>
      <div className="profile-media-user-profile-guest">
        <div className="profile-tabs-user-profile-guest">
          {['Flashcards', 'Quizzes', 'EduScribe'].map(tab => (
            <button
              key={tab}
              className={`profile-tab-user-profile-guest ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          <div className="profile-tab-underline-user-profile-guest" style={{ width: `${100 / 3}%`, left: `${['Flashcards', 'Quizzes', 'EduScribe'].indexOf(activeTab) * (100 / 3)}%` }} />
        </div>
        <div className="profile-content-user-profile-guest">
          {activeTab === 'Flashcards' && flashcards.map((card, index) => (
            <div key={index} className="card-user-profile-guest flashcard-item-user-profile-guest">
              <Link to={`/note/view/${card.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                <div className="card-content-user-profile-guest">{card.title}</div>
              </Link>
            </div>
          ))}
          {activeTab === 'Quizzes' && quizzes.map((quiz, index) => (
            <div key={index} className="card-user-profile-guest quiz-item-user-profile-guest">
              <Link to={`/quiz/${quiz.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                <div className="card-content-user-profile-guest">{quiz.title}</div>
              </Link>
            </div>
          ))}
          {activeTab === 'EduScribe' && eduscribes.map((eduscribe) => (
            <div key={eduscribe.id} className="card-user-profile-guest eduscribe-item-user-profile-guest">
              <div className="eduscribe-header">
                <Link to={`/profile/${profile.user_id}`}>
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
        </div>
      </div>
      <FooterNav />
    </div>
  );
};

export default UserProfile;