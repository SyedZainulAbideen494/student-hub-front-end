import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import './birthdayCelebration.css'; // Assuming you have the CSS file for styles
import { API_ROUTES } from './apiRoutes';

const BirthdayCelebration = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isBirthday, setIsBirthday] = useState(false); // Flag for birthday check
  const [showCelebration, setShowCelebration] = useState(false); // Flag for celebration modal
  const [confettiVisible, setConfettiVisible] = useState(false); // Flag for confetti visibility
  const [balloonsVisible, setBalloonsVisible] = useState(false); // Flag for balloons visibility
  const [candleBlown, setCandleBlown] = useState(false); // Flag for candle blow out animation

  // Fetch user profile data
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

        // Check if today is their birthday
        const today = new Date();
        const userBirthday = new Date(data.birthday); // Assuming the API returns birthday as 'YYYY-MM-DD'
        if (userBirthday.getDate() === today.getDate() && userBirthday.getMonth() === today.getMonth()) {
          setIsBirthday(true); // Set flag to true if today is the user's birthday
        }
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
    if (isBirthday) {
      setShowCelebration(true);
      setTimeout(() => {
        setBalloonsVisible(true);
      }, 500); // Balloons appear half a second after modal shows
      setTimeout(() => {
        setConfettiVisible(true);
      }, 1500); // Confetti starts after balloons
    }
  }, [isBirthday]);

  const handleCakeCut = () => {
    setCandleBlown(true); // Trigger candle blow out animation
  };

  const handleCloseModal = () => {
    setShowCelebration(false); // Close celebration modal
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="birthday__celeb__page__modal">
      {showCelebration && (
        <div className="birthday__celeb__page__modal__content">
          {/* Balloons Animation */}
          {balloonsVisible && (
            <div className="balloons">
              <div className="balloon balloon-1"></div>
              <div className="balloon balloon-2"></div>
              <div className="balloon balloon-3"></div>
            </div>
          )}

          {/* Confetti Animation */}
          {confettiVisible && <Confetti />}

          {/* Birthday Cake with Candle Animation */}
          <div className="cake-container">
            <div className="birthday-cake">
              <div className={`candle-flame ${candleBlown ? 'blown' : ''}`} />
              <div className="cake-body"></div>
              <div className="cake-frosting"></div>
              <div className="candle"></div>
              <button onClick={handleCakeCut} className="cut-cake-btn">Cut the Cake 🎂</button>
            </div>
          </div>

          {/* Celebration Message */}
          <div className="birthday__celeb__page__modal__message">
            <h2 className="celebration__title">🎉 Happy Birthday! 🎉</h2>
            <p className="celebration__text">Wishing you a fantastic day filled with joy and happiness!</p>
          </div>

          {/* Personalized birthday wish */}
          <div className="birthday__celeb__page__modal__celebration">
            <h2>🎉 Happy Birthday, {profile?.unique_id}! 🎉</h2>
            <p>Wishing you a day full of joy, celebration, and all your heart's desires!</p>
          </div>

          {/* Close buttons */}
          <div className="birthday__celeb__page__modal__buttons">
            <button onClick={handleCloseModal} className="thank-you-btn">
              Thank You 🎂
            </button>
            <button onClick={handleCloseModal} className="not-thank-you-btn">
              Nah, Not Thank You 😜
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayCelebration;
