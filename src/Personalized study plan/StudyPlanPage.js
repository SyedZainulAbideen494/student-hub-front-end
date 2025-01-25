import React, { useEffect, useState } from "react";
import "./StudyPlanPage.css";

const StudyPlanPage = () => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:8080/api/study-plan", {
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
    if (!Array.isArray(hoursAllocation)) return 0; // Ensure hoursAllocation is an array
    return hoursAllocation.reduce((total, allocation) => {
      const hours = parseFloat(allocation?.hours || 0);
      return total + hours;
    }, 0);
  };

  if (error) {
    return <div className="error-message__goal__Plan__Ai_result">Error: {error}</div>;
  }

  if (!studyPlan) {
    return <div className="loading-message__goal__Plan__Ai_result">Loading...</div>;
  }

  const weeklyTimetable = studyPlan.study_plan?.weekly_timetable || [];

  const totalWeekHours = weeklyTimetable.reduce(
    (total, dayPlan) => total + calculateTotalHours(dayPlan?.hours_allocation || []),
    0
  );

  return (
    <div className="study-plan-container__goal__Plan__Ai_result">
      <h1 className="heading__goal__Plan__Ai_result">Your Personalized Study Plan is Ready</h1>
      <div className="cards-container__goal__Plan__Ai_result">
        {weeklyTimetable.map((dayPlan, index) => {
          const totalHours = calculateTotalHours(dayPlan?.hours_allocation || []);
          return (
            <div key={index} className="day-card__goal__Plan__Ai_result">
              <div className="round-graph__goal__Plan__Ai_result">
                <div
                  className="progress__goal__Plan__Ai_result"
                  style={{
                    "--progress": `${(totalHours / 12) * 100}%`,
                  }}
                ></div>
                <div className="center-value__goal__Plan__Ai_result">
                  {totalHours}h
                </div>
              </div>
              <h3 className="day-title__goal__Plan__Ai_result">{dayPlan?.day || "Unknown Day"}</h3>
              <ul className="subjects-list__goal__Plan__Ai_result">
                {(dayPlan?.hours_allocation || []).map((allocation, i) => (
                  <li key={i} className="subject-item__goal__Plan__Ai_result">
                    {allocation?.subject || "Unknown Subject"} - {dayPlan?.tips || ""}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        <div className="day-card__goal__Plan__Ai_result total-card__goal__Plan__Ai_result">
          <div className="round-graph__goal__Plan__Ai_result">
            <div
              className="progress__goal__Plan__Ai_result"
              style={{
                "--progress": `${(totalWeekHours / 84) * 100}%`,
              }}
            ></div>
            <div className="center-value__goal__Plan__Ai_result">{totalWeekHours}h</div>
          </div>
          <h3 className="day-title__goal__Plan__Ai_result">Week Total</h3>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanPage;
