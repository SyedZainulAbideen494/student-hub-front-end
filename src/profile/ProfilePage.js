import React, { useEffect, useState } from 'react';
import './ProfilePage.css';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
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
          const { data } = await axios.post('http://localhost:8080/getPosts', { token });
          setPosts(data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchDataForActiveTab();
  }, [activeTab]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile data available</p>;

  return (
    <div className="profile-page">
      <div className="profile-info">
        <img
          className="profile-avatar"
          src={`${API_ROUTES.displayImg}/${profile.avatar}` || 'default-avatar-url'}
          alt="Profile Avatar"
        />
        <h2 className="profile-name">{profile.name}</h2>
        <p className="profile-username">{profile.user_name}</p>
        <p className="profile-bio">{profile.bio}</p>
        <p className="profile-unique-id">@{profile.unique_id}</p>
        <p className="profile-location">{profile.location}</p>
        <div className="profile-stats">
          <div className="profile-stat">{profile.following} Following</div>
          <div className="profile-stat">Flashcards: {flashcards.length}</div>
          <div className="profile-stat">Posts: {posts.length}</div>
        </div>
        <div className="profile-actions">
          <button className="profile-follow-button">Follow</button>
        </div>
      </div>
      <div className="profile-media">
        <div className="profile-tabs">
          {['Flashcards', 'Quizzes', 'EduScribe', 'Posts'].map(tab => (
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
          {activeTab === 'Flashcards' && flashcards.map((card, index) => (
            <div key={index} className="flashcard">{card.title}</div>
          ))}
          {activeTab === 'Quizzes' && quizzes.map((quiz, index) => (
            <div key={index} className="quiz">{quiz.title}</div>
          ))}
          {activeTab === 'EduScribe' && eduScribe.map((item, index) => (
            <div key={index} className="edu-scribe">{item.title}</div>
          ))}
          {activeTab === 'Posts' && posts.map((post, index) => (
            <div key={index} className="post">{post.title}</div>
          ))}
        </div>
      </div>
      <FooterNav />
    </div>
  );
};

export default ProfilePage;