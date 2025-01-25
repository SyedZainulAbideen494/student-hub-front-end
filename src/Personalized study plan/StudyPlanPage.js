import React, { useEffect, useState } from "react";
import Confetti from "react-confetti"; // Import the Confetti library
import "./StudyPlanPage.css";
import { FaBook, FaClock } from "react-icons/fa";
import { API_ROUTES } from "../app_modules/apiRoutes";
import { Link } from "react-router-dom";

const StudyPlanPage = () => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 7000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch(API_ROUTES.getStudyPlan, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setStudyPlan(data.data);
          } else {
            setError(data.message || "Failed to fetch the study plan");
          }
        })
        .catch(() => {
          setError("Error fetching study plan");
        });
    } else {
      setError("No token found");
    }
  }, []);

  // Helper function to calculate total hours
  const calculateTotalHours = (hoursAllocation) => {
    if (!Array.isArray(hoursAllocation)) return 0;
    return hoursAllocation.reduce((total, allocation) => {
      const hours = parseFloat(allocation?.hours || 0);
      return total + hours;
    }, 0);
  };

  if (error) {
    return <div className="error-message__Ai__result__plan">Error: {error}</div>;
  }

  if (!studyPlan) {
    return <div className="loading-message__Ai__result__plan">Loading...</div>;
  }

  const weeklyTimetable = studyPlan.study_plan?.weekly_timetable || [];

  return (
    <div className="study-plan-container__Ai__result__plan">
      {/* Confetti effect */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false} // Only show confetti once
        />
      )}

      {/* Top Section */}
      <div className="top-section__Ai__result__plan">
        <h1 className="main-heading__Ai__result__plan">Achieve Your Goals</h1>
        <p className="description__Ai__result__plan">
          Your personalized study plan is designed to help you manage your time
          effectively, stay focused, and achieve academic success.
        </p>
      </div>

      <h1 className="heading__Ai__result__plan">
        Your Personalized <br />
        Study Plan
      </h1>
      <div className="cards-container__Ai__result__plan">
        {weeklyTimetable.map((dayPlan, index) => {
          const totalHours = calculateTotalHours(dayPlan?.hours_allocation || []);
          return (
            <div key={index} className="day-card__Ai__result__plan">
              {/* Day and Hours */}
              <div className="day-and-hours__Ai__result__plan">
                <div className="day-title__Ai__result__plan">
                  {dayPlan?.day || "Unknown Day"}
                </div>
                <div className="hours-circle__Ai__result__plan">
                  <div
                    className="progress__Ai__result__plan"
                    style={{
                      "--progress": `${(totalHours / 12) * 100}%`,
                    }}
                  ></div>
                <div className="center-value__Ai__result__plan">{totalHours.toFixed(1)}h</div>

                </div>
              </div>

              {/* Subjects */}
              <div className="subjects__Ai__result__plan">
                <ul className="subjects-list__Ai__result__plan">
                  {(dayPlan?.hours_allocation || []).map((allocation, i) => (
                    <li key={i} className="subject-item__Ai__result__plan">
                      {allocation?.subject || "Unknown Subject"}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips */}
              <div className="tips__Ai__result__plan">
                {dayPlan?.tips ? (
                  <p>{dayPlan?.tips}</p>
                ) : (
                  <p>No tips available for this day</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Get Started Button */}
      <div className="sticky-button__Ai__result__plan">
        <Link to='/'>
        <button className="get-started-button__Ai__result__plan">Get Started</button>
        </Link>
      </div>
    </div>
  );
};

export default StudyPlanPage;
