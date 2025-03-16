import React from "react";
import Lottie from "lottie-react";
import pomodoroAnimation from "./pomodoro.json"; // Ensure this file exists in src
import "./PomodoroChallengeBannerPremium.css";
import { Link } from "react-router-dom";

const PomodoroChallengeBannerPremium = () => {
  return (
    <div className="pomodoro__challenge__banner__premium">
      <div className="animation__wrapper__challenge__banner__premium">
        <Lottie animationData={pomodoroAnimation} loop={true} />
      </div>
      <div className="text__content__challenge__banner__premium">
        <h2 className="challenge__title__challenge__banner__premium">
          Pomodoro Challenge
        </h2>
        <p className="challenge__description__challenge__banner__premium">
          Stay focused, complete the challenge, and unlock <strong>1-Day Premium</strong> for free.
        </p>
        <Link to='/week-challenge' style={{textDecoration: 'none'}}>
        <button className="challenge__btn__challenge__banner__premium">
          Claim Free Premium
        </button>
        </Link>
      </div>
    </div>
  );
};

export default PomodoroChallengeBannerPremium;
