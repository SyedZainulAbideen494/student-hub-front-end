import React, { useState, useEffect, useCallback } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import axios from "axios";
import "react-circular-progressbar/dist/styles.css";
import "./PomodoroChallenge.css";
import { FiCheckCircle, FiGift, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../app_modules/apiRoutes";

const PomodoroChallenge = () => {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [challengeGoal, setChallengeGoal] = useState(90000); // 25 Hours in seconds
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProgress = useCallback(async () => {
    try {
      const response = await axios.get(API_ROUTES.fetchPomodoroChallengeProgress, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      const claimResponse = await axios.get(API_ROUTES.checkWeeklyRewardClaimed, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      const { total_time = 0, challenge_goal = 90000 } = response.data;
      setChallengeGoal(challenge_goal);
      setTotalTime(total_time);
      setProgress((total_time / challenge_goal) * 100);
      setCompleted(total_time >= challenge_goal);
      setClaimed(claimResponse.data.claimed);
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
    const interval = setInterval(fetchProgress, 5000);
    return () => clearInterval(interval);
  }, [fetchProgress]);

  const claimReward = async () => {
    try {
      const response = await axios.post(API_ROUTES.claimPremiumReward, {
        token: localStorage.getItem("token"),
      });
  
      if (response.data.message === "Premium claimed successfully" || response.data.message === "Premium extended successfully") {
        setClaimed(true);
        navigate("/payment-success");
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    }
  };

  return (
    <div className="container__pomodoro__weekly__challenge">
      <div className="card__pomodoro__weekly__challenge">
        <div className="header__pomodoro__weekly__challenge">
          <h1>Weekly Pomodoro Challenge</h1>
          <p>Complete 25 hours of study this week to claim 1-day Premium!</p>
        </div>

        {/* Progress Bar */}
        <div className="progress__wrapper__pomodoro__weekly__challenge">
          <div className={`glow__pomodoro__weekly__challenge ${progress > 75 ? "glow-active" : ""}`} />
          <CircularProgressbar
            value={progress}
            text={loading ? "..." : `${progress.toFixed(0)}%`}
            styles={buildStyles({
              pathColor: "#007aff",
              textColor: "#1d1d1f",
              trailColor: "#e0e0e0",
            })}
          />
        </div>

        {/* Hours Completed Text */}
        <p className="hours__text__pomodoro__weekly__challenge">
          {loading ? "Loading..." : `${(totalTime / 3600).toFixed(1)} hrs / 25 hrs completed`}
        </p>

        {/* Claim Button */}
        {claimed ? (
          <p className="claimed__text__pomodoro__weekly__challenge"><FiCheckCircle/> Claimed</p>
        ) : completed ? (
          <button className="claim__button__pomodoro__weekly__challenge" onClick={claimReward}>
            <FiGift /> Claim 1-Day Premium
          </button>
        ) : (
          <button className="claim__button__locked__pomodoro__weekly__challenge" disabled>
            <FiLock /> Claim 1-Day Premium
          </button>
        )}

        {/* Back Button */}
        <button className="back__button__pomodoro__weekly__challenge" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PomodoroChallenge;
