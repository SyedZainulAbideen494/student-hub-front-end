import React, { useEffect, useState } from 'react';
import './leaderBoard.css';
import { FaTrophy, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [profile, setProfile] = useState(null); // State for profile data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [userStats, setUserStats] = useState({ position: null, points: 0 }); // State for user's stats
  const nav = useNavigate();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await axios.get(API_ROUTES.leaderboard);
        setLeaderboardData(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }

        const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
        setProfile(data); // Set the profile data

        // After fetching the profile data, fetch leaderboard data to check for user's stats
        fetchLeaderboardData();
      } catch (err) {
        setError('Error fetching profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData(); // Fetch profile data
  }, []);

  useEffect(() => {
    // Check if the profile data is available
    if (profile) {
      // Find the user's stats from leaderboardData
      const userPosition = leaderboardData.findIndex(user => user.id === profile.id);
      if (userPosition !== -1) {
        // If user is found in leaderboard, set their position and points
        setUserStats({
          position: userPosition + 1, // Positions are 1-indexed
          points: leaderboardData[userPosition].points
        });
      } else {
        // If user is not found, set position as null and points as 0
        setUserStats({
          position: null,
          points: 0
        });
      }
    }
  }, [profile, leaderboardData]); // Run this effect whenever profile or leaderboard data changes

  const handleBack = () => {
    nav('/');
  };

  return (
    <div className="leaderboard__page__container">
      <div className="header__leaderboard__page">
        <button className="back-btn__leaderboard__page" onClick={handleBack}>
          <FaArrowLeft size={20} />
        </button>
        <h1 className="leaderboard-title__leaderboard__page">
          
          Leaderboard
        </h1>
        {profile && ( // Conditionally render the user's avatar
          <img
            src={`${API_ROUTES.displayImg}/${profile.avatar}` || 'default-avatar-url'}
            alt="User Avatar"
            className="user-avatar__leaderboard__page"
          />
        )}
      </div>
      <p className="leaderboard-subtitle__leaderboard__page">See how you stack up against others!</p>

      {/* User Stats Section */}
      <div className='banner__leaderboard__page'></div>
      <div className="user-stats__leaderboard__page">
        {/* Render user stats at the top if they exist */}
        {userStats.position !== null && (
          <div className="user-item__leaderboard__page" style={{ backgroundColor: '#ffd700' }}>
            <span className="position__leaderboard__page">{userStats.position}</span>
            <img
              src={`${API_ROUTES.displayImg}/${profile.avatar}` || 'default-avatar-url'}
              alt={profile.username}
              className="avatar__leaderboard__page"
            />
            <span className="username__leaderboard__page">{profile.unique_id}</span>
            <span className="points__leaderboard__page">{userStats.points}</span>
          </div>
        )}
      </div>
      <div className="table-label__leaderboard__page">
        <span className="label__leaderboard__page position__leaderboard__page">Pos</span>
        <span className="label__leaderboard__page profile__leaderboard__page">Profile</span>
        <span className="label__leaderboard__page points__leaderboard__page">Points</span>
      </div>

      <div className="user-list__leaderboard__page">
        {leaderboardData.slice(0, 5).map((user, index) => {
          let bgClass = '';
          if (index === 0) bgClass = 'gold-bg__leaderboard__page';
          else if (index === 1) bgClass = 'silver-bg__leaderboard__page';
          else if (index === 2) bgClass = 'bronze-bg__leaderboard__page';

          return (
            <div key={user.id} className={`user-item__leaderboard__page ${bgClass}`}>
              <span className="position__leaderboard__page">{index + 1}</span>
              <img
                src={`${API_ROUTES.displayImg}/${user.avatar}` || 'default-avatar-url'}
                alt={user.username}
                className="avatar__leaderboard__page"
              />
              <span className="username__leaderboard__page">{user.unique_id}</span>
              <span className="points__leaderboard__page">{user.points}</span>
              {bgClass && (
                <span className="medal__leaderboard__page">
                  {bgClass === 'gold-bg__leaderboard__page' ? '🥇' : bgClass === 'silver-bg__leaderboard__page' ? '🥈' : '🥉'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
