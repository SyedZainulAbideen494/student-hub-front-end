import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AchievementPage.css'


const AchievementPage = () => {
  const [toggle, setToggle] = useState('achieved'); // 'achieved' or 'locked'
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    // Fetch achievements based on toggle state (achieved or locked)
    axios
      .get(`http://localhost:5000/api/achievements/${toggle}`)
      .then((response) => {
        setAchievements(response.data);
      })
      .catch((error) => {
        console.error("Error fetching achievements", error);
      });
  }, [toggle]);

  return (
    <div className="achievement-page">
      {/* Header with back button */}
      <div className="header">
        <button onClick={() => window.history.back()}>Back</button>
        <h2>Achievements</h2>
      </div>

      {/* Toggle buttons for Achieved/Locked */}
      <div className="toggle-buttons">
        <button onClick={() => setToggle('achieved')} className={toggle === 'achieved' ? 'active' : ''}>
          Achieved
        </button>
        <button onClick={() => setToggle('locked')} className={toggle === 'locked' ? 'active' : ''}>
          Locked
        </button>
      </div>

      {/* Display achievements */}
      <div className="achievements-list">
        {achievements.map((achievement) => (
          <div className="achievement-card" key={achievement.id}>
            <div className="trophy-icon">
              <img src="/path-to-trophy-icon.png" alt="Trophy" />
            </div>
            <div className="achievement-details">
              <h3>{achievement.name}</h3>
              <p>{toggle === 'achieved' ? achievement.date : 'Locked'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementPage;
