import React, { useState, useEffect } from 'react';
import { FaPoll, FaSearch, FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './socialfeed.css';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import EduScribe from './eduScribe';
import { QuestionAnswer } from '@mui/icons-material';
import QuestionCard from './QuestionCard';

const SocialFeed = () => {
  const [activeTab, setActiveTab] = useState('ForYou');
  const [question, setQuestion] = useState('');
  const [profile, setProfile] = useState({ avatar: 'default-avatar-url' });

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token: localStorage.getItem('token') });
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleQuestionSubmit = () => {
    // Handle the question submit logic here
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="social-media-container">
      <header className="header-social-media">
        <div className="app-name-social-media">Edusify</div>
        <img
          src={`${API_ROUTES.displayImg}/${profile.avatar}`}
          alt="Profile Avatar"
          className="profile-avatar-social-media"
        />
      </header>
      <div className="tabs-social-media">
        <button
          className={`tab-button-social-media ${activeTab === 'ForYou' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('ForYou')}
        >
          For You
        </button>
        <button
          className={`tab-button-social-media ${activeTab === 'Following' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('Following')}
        >
          Following
        </button>
      </div>
      <QuestionCard/>
      <EduScribe activeTab={activeTab}/> {/* Pass activeTab as a prop */}
    </div>
  );
}

export default SocialFeed;