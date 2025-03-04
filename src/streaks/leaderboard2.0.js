import React, { useEffect, useState } from 'react';
import './leaderboard2.0.css';
import { FaTrophy, FaArrowLeft,FaQuestionCircle, FaCrown } from 'react-icons/fa';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { useNavigate } from 'react-router-dom';

const Leaderboard2 = () => {
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
            7. Create Notes: <strong>10 points</strong>
          </p>
          <p className="modal-warning__leaderboard__instr">
            ⚠️ <strong>Stay Active!</strong> If you don’t perform any activity for 24 hours, <strong>10 points will be deducted</strong>.
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
  <div className="leaderboard__page__container__leader__board__2">
      <div className="header__leaderboard__page__leader__board__2">
        <button className="back-btn__leaderboard__page__leader__board__2" onClick={handleBack}>
          <FaArrowLeft size={16} />
        </button>
        <h1 className="leaderboard-title__leaderboard__page__leader__board__2">Leaderboard</h1>
        <button className="instructions-btn__leaderboard__page__leader__board__2" onClick={() => setShowInstructions(true)}>
          <FaQuestionCircle size={20} />
        </button>
      </div>

      <p className="leaderboard-subtitle__leaderboard__page__leader__board__2">See how you stack up!</p>

      <div className="user-stats__leaderboard__page__leader__board__2">
        {userStats.position !== null && (
          <div className="user-card__leaderboard__page__leader__board__2">
            <div className="left-section__leaderboard__page__leader__board__2">
              <span className="position__leaderboard__page__leader__board__2">{userStats.position}</span>
              <img
                src={`${API_ROUTES.displayImg}/${profile.avatar}` || 'default-avatar-url'}
                alt={profile.username}
                className="avatar__leaderboard__page__leader__board__2"
              />
              <span className="username__leaderboard__page__leader__board__2">{profile.unique_id}</span>
            </div>
            <span className="points__leaderboard__page__leader__board__2">{userStats.points} pts</span>
          </div>
        )}
      </div>

      <ProgressBar currentPoints={userStats.points} maxPoints={maxPoints} topUserPoints={maxPoints} />

      <div className="leaderboard-overview__leaderboard__page__leader__board__2">
        <h2 className="overview-title__leaderboard__page__leader__board__2">Top Performers</h2>
        <div className="table-label__leaderboard__page__leader__board__2">
          <span className="label__leaderboard__page__leader__board__2 position__leaderboard__page__leader__board__2">Pos</span>
          <span className="label__leaderboard__page__leader__board__2 profile__leaderboard__page__leader__board__2">Users</span>
          <span className="label__leaderboard__page__leader__board__2 points__leaderboard__page__leader__board__2">Points</span>
        </div>

        <div className="user-list__leaderboard__page__leader__board__2">
          {leaderboardData.slice(0, 10).map((user, index) => {
            const bgClass = index === 0 ? 'gold-bg__leaderboard__page__leader__board__2' :
                            index === 1 ? 'silver-bg__leaderboard__page__leader__board__2' :
                            index === 2 ? 'bronze-bg__leaderboard__page__leader__board__2' : '';

            const crownClass = user.isPremium ? 'premium-crown__leaderboard' : ''; // Add crown class for premium users

            return (
              <div key={user.id} className={`user-card__leaderboard__page__leader__board__2 ${bgClass}`} onClick={() => handleProfileClick(user.id)}>
                <div className="left-section__leaderboard__page__leader__board__2">
                  <span className="position__leaderboard__page__leader__board__2">{index + 1}</span>
                  <img
                    src={`${API_ROUTES.displayImg}/${user.avatar}` || 'default-avatar-url'}
                    alt={user.username}
                    className="avatar__leaderboard__page__leader__board__2"
                  />
                  <span className="username__leaderboard__page__leader__board__2">{user.unique_id}  {user.isPremium && <FaCrown className="premium-crown__leaderboard" />}</span>
                </div>
                <span className="points__leaderboard__page__leader__board__2">{user.points} pts</span>
                {bgClass && (
                  <span className="medal__leaderboard__page__leader__board__2">
                    {bgClass === 'gold-bg__leaderboard__page__leader__board__2' ? '🥇' :
                     bgClass === 'silver-bg__leaderboard__page__leader__board__2' ? '🥈' : '🥉'}
                  </span>
                )}
               {/* Display crown for premium users */}
              </div>
            );
          })}
        </div>
      </div>

      <div className="more-users__suggested__page__leader__board__2">
        <h2 className="suggested-title__page__leader__board__2">Suggested for You</h2>
        <div className="scroll-container__suggested__page__leader__board__2">
          {leaderboardData
            .slice(10)
            .filter(user => user.points > 40)
            .sort(() => Math.random() - 0.5)
            .map((user) => (
              <div
                key={user.id}
                className="suggested-card__page__leader__board__2"
                onClick={() => handleProfileClick(user.id)}
              >
                <img
                  src={`${API_ROUTES.displayImg}/${user.avatar}` || 'default-avatar-url'}
                  alt={user.username}
                  className="avatar__suggested__page__leader__board__2"
                />
                {user.isPremium && <FaCrown className="premium-crown__leaderboard" />}
                <div className="user-details__suggested__page__leader__board__2">
                  <span className="username__suggested__page__leader__board__2">
                    {user.unique_id.length > 15 ? `${user.unique_id.slice(0, 12)}...` : user.unique_id}
                  </span>
                </div>
                <button className="view-btn__suggested__page__leader__board__2">View</button>
              </div>
            ))}
        </div>
      </div>

      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
    </div>
  );
};

export default Leaderboard2;
