import React, { useState } from "react";
import "./StudyPlanBuilder.css";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../app_modules/apiRoutes";

const defaultDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const StudyPlanBuilder = () => {
  const [studyData, setStudyData] = useState(
    defaultDays.map((day) => ({
      day,
      tips: "",
      method: "Pomodoro",
      subjects: [],
      subjectInput: "",
      hoursInput: "",
      aiInstructions: "",
    }))
  );

  const naviagte = useNavigate()

  const handleSubjectChange = (index, field, value) => {
    const newData = [...studyData];
    newData[index][field] = value;
    setStudyData(newData);
  };

  const addSubjectToDay = (index) => {
    const dayData = studyData[index];
    if (!dayData.subjectInput || !dayData.hoursInput) return;

    const newSubjects = [...dayData.subjects, {
      subject: dayData.subjectInput,
      hours: dayData.hoursInput,
    }];

    const newData = [...studyData];
    newData[index].subjects = newSubjects;
    newData[index].subjectInput = "";
    newData[index].hoursInput = "";
    setStudyData(newData);
  };

  const generateFinalJSON = async () => {
    const weekly_timetable = studyData.map((day) => ({
      day: day.day,
      tips: day.tips,
      method: day.method,
      subjects: day.subjects.map((s) => s.subject),
      hours_allocation: day.subjects,
      total_study_time: day.subjects.reduce((sum, s) => sum + parseInt(s.hours || 0), 0),
      current_situation: 7,
      AI_task_generation_instructions:
        day.aiInstructions ||
        `I have ${day.subjects.map(s => s.subject).join(", ")} for about ${day.subjects.reduce((sum, s) => sum + parseInt(s.hours || 0), 0)} hours. Today is ${day.day}. Help me study effectively.`,
    }));
  
    const finalJSON = {
      study_plan: {
        goal: "Maintain consistent study habits for economics and accounts, aiming for a strong performance in the board exams on Feb 18th.",
        notes: "This plan is a suggestion and can be adjusted to suit your needs...",
        speed: "fast",
        subjects: [],
        daily_study_time: "2-4 hours",
        weekly_timetable,
        pomodoro_preference: true,
      },
    };
  
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(API_ROUTES.saveStudyPlanManual, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studyPlan: finalJSON }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        naviagte('/my-ai-plan');
        console.log("Saved Plan ID:", result.id);
      } else {
        console.error("Save failed:", result.error);
        alert("❌ Failed to save study plan: " + result.error);
      }
    } catch (err) {
      console.error("Network or server error:", err);
      alert("❌ Something went wrong while saving. Check the console.");
    }
  };
  
  return (
    <div className="builder-container__manual__builder__Study__Plan__Page">
      <h2 className="title__manual__builder__Study__Plan__Page">Study Plan Builder</h2>
      <div className="week-grid__manual__builder__Study__Plan__Page">
        {studyData.map((day, index) => (
          <div key={index} className="day-card__manual__builder__Study__Plan__Page">
            <h3>{day.day}</h3>

            <div className="input-group__manual__builder__Study__Plan__Page">
              <input
                type="text"
                placeholder="Subject"
                value={day.subjectInput}
                onChange={(e) => handleSubjectChange(index, "subjectInput", e.target.value)}
              />
              <input
                type="number"
                placeholder="Hours"
                value={day.hoursInput}
                onChange={(e) => handleSubjectChange(index, "hoursInput", e.target.value)}
              />
              <button onClick={() => addSubjectToDay(index)}>＋</button>
            </div>

            <ul className="subject-list__manual__builder__Study__Plan__Page">
              {day.subjects.map((subj, i) => (
                <li key={i}>
                  {subj.subject} - {subj.hours} hrs
                </li>
              ))}
            </ul>

            <textarea
              placeholder="Tips"
              value={day.tips}
              onChange={(e) => handleSubjectChange(index, "tips", e.target.value)}
            />
            <select
              value={day.method}
              onChange={(e) => handleSubjectChange(index, "method", e.target.value)}
            >
              <option value="Pomodoro">Pomodoro</option>
              <option value="Relaxation">Quizzes</option>
            </select>
          </div>
        ))}
      </div>

      <button
        className="generate-btn__manual__builder__Study__Plan__Page"
        onClick={generateFinalJSON}
      >
Save Study plan
     </button>
    </div>
  );
};

export default StudyPlanBuilder;
