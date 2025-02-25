import React, { useEffect, useState } from 'react';
import './leaderBoard.css';
import { FaTrophy, FaArrowLeft,FaQuestionCircle } from 'react-icons/fa';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [profile, setProfile] = useState(null); // State for profile data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [userStats, setUserStats] = useState({ position: null, points: 0 }); // State for user's stats
  const [showInstructions, setShowInstructions] = useState(false);

  const nav = useNavigate();

  const InstructionsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay__leaderboard__instr" onClick={onClose}>
        <div className="modal-content__leaderboard__instr" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal-title__leaderboard__instr">How to Gain Points</h2>
          <p className="modal-description__leaderboard__instr">
            1. Add tasks manually: <strong>5 points</strong>
          </p>
          <p className="modal-description__leaderboard__instr">
            2. Complete tasks: <strong>3 points</strong>
          </p>
          <p className="modal-description__leaderboard__instr">
            3. Add events to your calendar: <strong>3 points</strong>
          </p>
          <p className="modal-description__leaderboard__instr">
            4. Attend quizzes: <strong>15 points</strong>
          </p>
          <p className="modal-description__leaderboard__instr">
            5. Learn using flashcards: <strong>5 points</strong>
          </p>
          <p className="modal-description__leaderboard__instr">
            6. Complete a Pomodoro session: <strong>10 points</strong>
          </p>
          <p className="modal-description__leaderboard__instr">
            7. Creating Notes: <strong>10 points</strong>
          </p>
          <button className="modal-close-btn__leaderboard__instr" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  };
  
  


  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await axios.get(API_ROUTES.leaderboard);
  
        // Filter out the user with user_id 147 (the banned user)
        const filteredData = response.data.filter(user => user.user_id !== 147);
  
        setLeaderboardData(filteredData);
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

  const maxPoints = leaderboardData.length > 0 ? Math.max(...leaderboardData.map(user => user.points)) : 1; // Default to 1 to avoid division by zero
 
 
  const ProgressBar = ({ currentPoints, maxPoints, topUserPoints }) => {
    const fillPercentage = (currentPoints / maxPoints) * 100;

    // Determine the color class based on fill percentage
    let colorClass = '';
    if (fillPercentage < 50) {
        colorClass = 'red';
    } else if (fillPercentage < 80) {
        colorClass = 'orange';
    } else {
        colorClass = 'green';
    }

    // Calculate the difference from the top user points
    const pointsDifference = topUserPoints - currentPoints;

    return (
        <div className="progress-bar__leaderboard__page">
            <div
                className={`progress__leaderboard__page ${colorClass}`}
                style={{ width: `${fillPercentage}%` }}
            ></div><br/>
            <p className="progress-text__leaderboard__page">
                {pointsDifference > 0 
                    ? `You're ${pointsDifference} points away from the top!` 
                    : `You've reached the top!`}
            </p>
        </div>
    );
};

const handleProfileClick = (userId) => {
  nav(`/profile/${userId}`);
};

  return (
<div className="leaderboard__page__container">
  {/* Header Section */}
  <div className="header__leaderboard__page">
    <button className="back-btn__leaderboard__page" onClick={handleBack}>
      <FaArrowLeft size={16} />
    </button>
    <h1 className="leaderboard-title__leaderboard__page">Leaderboard</h1>
   
     <button className="instructions-btn__leaderboard__page" onClick={() => setShowInstructions(true)}>
          <FaQuestionCircle size={20} />
        </button>
  </div>
  
  <p className="leaderboard-subtitle__leaderboard__page">See how you stack up!</p>


  {/* User Stats Section */}
  <div className="user-stats__leaderboard__page">
    {userStats.position !== null && (
      <div className="user-card__leaderboard__page">
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

{/* Progress Bar */}
 {/* Progress Bar */}
 <ProgressBar currentPoints={userStats.points} maxPoints={maxPoints} topUserPoints={maxPoints} />

  {/* Leaderboard Overview */}
  <div className="leaderboard-overview__leaderboard__page">
    <h2 className="overview-title__leaderboard__page">Top Performers</h2>
    <div className="table-label__leaderboard__page">
      <span className="label__leaderboard__page position__leaderboard__page">Pos</span>
      <span className="label__leaderboard__page profile__leaderboard__page">Users</span>
      <span className="label__leaderboard__page points__leaderboard__page">Points</span>
    </div>

    <div className="user-list__leaderboard__page">
      {leaderboardData.slice(0, 10).map((user, index) => {
        const bgClass = index === 0 ? 'gold-bg__leaderboard__page' :
                        index === 1 ? 'silver-bg__leaderboard__page' :
                        index === 2 ? 'bronze-bg__leaderboard__page' : '';

        return (
          <div key={user.id} className={`user-card__leaderboard__page ${bgClass}`} onClick={() => handleProfileClick(user.id)}>
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
                {bgClass === 'gold-bg__leaderboard__page' ? '🥇' : 
                 bgClass === 'silver-bg__leaderboard__page' ? '🥈' : '🥉'}
              </span>
            )}
          </div>
        );
      })}
    </div>
    <div className="more-users__suggested__page">
  <h2 className="suggested-title__page">Suggested for You</h2>
  <div className="scroll-container__suggested__page">
    {leaderboardData
      .slice(10)
      .filter(user => user.points > 40)
      .sort(() => Math.random() - 0.5)
      .map((user) => (
        <div
          key={user.id}
          className="suggested-card__page"
          onClick={() => handleProfileClick(user.id)}
        >
          <img
            src={`${API_ROUTES.displayImg}/${user.avatar}` || 'default-avatar-url'}
            alt={user.username}
            className="avatar__suggested__page"
          />
          <div className="user-details__suggested__page">
            <span className="username__suggested__page">
              {user.unique_id.length > 15 ? `${user.unique_id.slice(0, 12)}...` : user.unique_id}
            </span>
          </div>
          <button className="view-btn__suggested__page">View</button>
        </div>
      ))}
  </div>
</div>
   <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
  </div>
</div>

  );
};

export default Leaderboard;
