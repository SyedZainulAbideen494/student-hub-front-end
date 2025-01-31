import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import "./StudyPlanPage.css";
import { FaBook, FaClock } from "react-icons/fa";
import { API_ROUTES } from "../app_modules/apiRoutes";
import { Link, useNavigate } from "react-router-dom";

const StudyPlanPage = () => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);
const nav = useNavigate()
  // Track the modified study plan
  const [modifiedStudyPlan, setModifiedStudyPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode

  useEffect(() => {
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
            setModifiedStudyPlan(data.data); // Set initial state to the received data
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

  const handleUpdate = (dayIndex, subjectIndex, newValue, field) => {
    const updatedStudyPlan = { ...modifiedStudyPlan };
    const updatedDayPlan = { ...updatedStudyPlan.study_plan.weekly_timetable[dayIndex] };
  
    // Update the specific field based on the input
    if (field === "subject") {
      updatedDayPlan.hours_allocation[subjectIndex].subject = newValue;
    } else if (field === "tips") {
      updatedDayPlan.tips = newValue;
    } else if (field === "hours") {
      updatedDayPlan.hours_allocation[subjectIndex].hours = newValue;
    }
  
    // Recalculate total hours for the day
    const totalHours = calculateTotalHours(updatedDayPlan.hours_allocation);
    updatedDayPlan.total_study_time = totalHours; // Store the updated total hours in the day plan
  
    updatedStudyPlan.study_plan.weekly_timetable[dayIndex] = updatedDayPlan;
    setModifiedStudyPlan(updatedStudyPlan); // Update the state with the modified plan
  };
  

  const handlegetStarted = () => {
    nav('/')
  }

  const handleSave = () => {
    const token = localStorage.getItem("token");

    if (token && modifiedStudyPlan) {
      // Make API call to save the updated study plan
      fetch(API_ROUTES.updateStudyPlan, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, studyPlan: modifiedStudyPlan }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setIsEditing(false)
          } else {
            setError(data.message || "Failed to update the study plan");
          }
        })
        .catch(() => {
          setError("Error updating study plan");
        });
    }
  };

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
        recycle={false}
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
      {weeklyTimetable.map((dayPlan, dayIndex) => {
        const totalHours = calculateTotalHours(dayPlan?.hours_allocation || []);
        return (
          <div key={dayIndex} className="day-card__Ai__result__plan">
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
                <div className="center-value__Ai__result__plan">
                  {totalHours.toFixed(1)}h
                </div>
              </div>
            </div>
  
            {/* Subjects */}
            <div className="subjects__Ai__result__plan">
              <ul className="subjects-list__Ai__result__plan">
                {(dayPlan?.hours_allocation || []).map((allocation, subjectIndex) => (
                  <li key={subjectIndex} className="subject-item__Ai__result__plan">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={allocation?.subject || ""}
                          onChange={(e) =>
                            handleUpdate(dayIndex, subjectIndex, e.target.value, "subject")
                          }
                          style={{
                            padding: "10px",
                            borderRadius: "20px",
                            border: "1px solid #ccc",
                            width: "100%",
                            marginBottom: "8px",
                            fontSize: "14px",
                            boxSizing: "border-box",
                          }}
                        />
                        <input
                          type="number"
                          value={allocation?.hours || ""}
                          onChange={(e) =>
                            handleUpdate(dayIndex, subjectIndex, e.target.value, "hours")
                          }
                          style={{
                            padding: "10px",
                            borderRadius: "20px",
                            border: "1px solid #ccc",
                            width: "100%",
                            fontSize: "14px",
                            boxSizing: "border-box",
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <span>{allocation?.subject || "N/A"}</span>
                        <span>{allocation?.hours || "0"}h</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Tips */}
            <div className="tips__Ai__result__plan">
              {isEditing ? (
                <input
                  type="text"
                  value={dayPlan?.tips || ""}
                  onChange={(e) => handleUpdate(dayIndex, null, e.target.value, "tips")}
                  style={{
                    padding: "10px",
                    borderRadius: "20px",
                    border: "1px solid #ccc",
                    width: "100%",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              ) : (
                <span>{dayPlan?.tips || "No Tips"}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  
    {/* Toggle Edit Mode Button */}
    <div className="sticky-button__Ai__result__plan">
      <button
        onClick={() => setIsEditing((prev) => !prev)}
        className="get-started-button__Ai__result__plan"
      >
        {isEditing ? "Cancel Edit" : "Edit Study Plan"}
      </button>
  
      {/* Conditionally render the Get Started button */}
      {!isEditing && (
        <button
          onClick={handlegetStarted}
          className="get-started-button__Ai__result__plan"
        >
          Get Started
        </button>
      )}
  
      {/* Save Study Plan button only visible when editing */}
      {isEditing && (
        <button onClick={handleSave} className="get-started-button__Ai__result__plan">
          Save Study Plan
        </button>
      )}
    </div>
  </div>
  
  );
};

export default StudyPlanPage;
