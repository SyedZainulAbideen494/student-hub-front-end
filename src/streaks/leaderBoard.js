import React, { useEffect, useState } from 'react';
import './leaderBoard.css';
import { FaTrophy, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios'; // Make sure to install axios if you haven't
import { API_ROUTES } from '../app_modules/apiRoutes';
import { useNavigate } from 'react-router-dom';


const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const nav = useNavigate()

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await axios.get(API_ROUTES.leaderboard);
        setLeaderboardData(response.data); // Assuming your API returns an array of users
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboardData();
  }, []);

  const handleBack = () => {
    nav('/')
  }

  return (
    <div className="leaderboard__page__container">
      <div className="header__leaderboard__page">
        <button className="back-btn__leaderboard__page" onClick={handleBack}>
          <FaArrowLeft />
        </button>
        <h1 className="leaderboard-title__leaderboard__page">Leaderboard</h1>
      </div>

      <div className="banner__leaderboard__page">
       
      </div>

      <div className="table-label__leaderboard__page">
        <span className="label__leaderboard__page position__leaderboard__page">Pos</span>
        <span className="label__leaderboard__page profile__leaderboard__page">Profile</span>
        <span className="label__leaderboard__page points__leaderboard__page">Points</span>
      </div>

      <div className="user-list__leaderboard__page">
        {leaderboardData.map((user, index) => {
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
