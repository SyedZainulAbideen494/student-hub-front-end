import React, { useState } from "react";
import axios from "axios";
import "./InputFlowStudyPlan.css";

const InputFlowStudyPlan = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    educationLevel: "",
    dailyStudyTime: "",
    studyPerformance: "",
    subjects: [],
    goals: "",
  });
  const [subjectInput, setSubjectInput] = useState("");

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleButtonChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/save-study-data",
        formData
      );
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Error saving data.");
    }
  };

  return (
    <div className="container__flow__inp__user__Data">
      {/* Progress Bar */}
      <div className="progress-bar__flow__inp__user__Data">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`progress-step__flow__inp__user__Data ${
              index < step ? "active__flow__inp__user__Data" : ""
            }`}
          ></div>
        ))}
      </div>

      <h1 className="header__flow__inp__user__Data">Personalized Study Plan</h1>

      {step === 1 && (
        <div className="step__flow__inp__user__Data">
          <h2 className="subheader__flow__inp__user__Data">Step 1: Education Details</h2>
          <p>Select your education level:</p>
          <div className="buttons-row__flow__inp__user__Data">
            {["Primary School", "Middle School", "High School", "College", "Degree"].map((level) => (
              <button
                key={level}
                className={`btn__flow__inp__user__Data ${
                  formData.educationLevel === level ? "selected__flow__inp__user__Data" : ""
                }`}
                onClick={() => handleButtonChange("educationLevel", level)}
              >
                {level}
              </button>
            ))}
          </div>
          <button
            className={`next-btn__flow__inp__user__Data ${
              formData.educationLevel ? "" : "disabled__flow__inp__user__Data"
            }`}
            onClick={handleNext}
            disabled={!formData.educationLevel}
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="step__flow__inp__user__Data">
          <h2 className="subheader__flow__inp__user__Data">Step 2: Study Details</h2>
          <p>How much time can you study daily?</p>
          <div className="buttons-row__flow__inp__user__Data">
            {["<1 hr", "1-2 hrs", "2-4 hrs", "4-8 hrs"].map((time) => (
              <button
                key={time}
                className={`btn__flow__inp__user__Data ${
                  formData.dailyStudyTime === time ? "selected__flow__inp__user__Data" : ""
                }`}
                onClick={() => handleButtonChange("dailyStudyTime", time)}
              >
                {time}
              </button>
            ))}
          </div>
          <div className="buttons-container__flow__inp__user__Data">
            <button className="back-btn__flow__inp__user__Data" onClick={handleBack}>
              Back
            </button>
            <button
              className={`next-btn__flow__inp__user__Data ${
                formData.dailyStudyTime ? "" : "disabled__flow__inp__user__Data"
              }`}
              onClick={handleNext}
              disabled={!formData.dailyStudyTime}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step__flow__inp__user__Data">
          <h2 className="subheader__flow__inp__user__Data">Step 3: Study Performance</h2>
          <p>How would you describe your current study performance?</p>
          <div className="buttons-row__flow__inp__user__Data">
            {[
              "Struggling, I need to improve.",
              "Doing okay but can do better.",
              "Performing well and want to stay consistent.",
            ].map((performance) => (
              <button
                key={performance}
                className={`btn__flow__inp__user__Data ${
                  formData.studyPerformance === performance ? "selected__flow__inp__user__Data" : ""
                }`}
                onClick={() => handleButtonChange("studyPerformance", performance)}
              >
                {performance}
              </button>
            ))}
          </div>
          <div className="buttons-container__flow__inp__user__Data">
            <button className="back-btn__flow__inp__user__Data" onClick={handleBack}>
              Back
            </button>
            <button
              className={`next-btn__flow__inp__user__Data ${
                formData.studyPerformance ? "" : "disabled__flow__inp__user__Data"
              }`}
              onClick={handleNext}
              disabled={!formData.studyPerformance}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="step__flow__inp__user__Data">
          <h2 className="subheader__flow__inp__user__Data">Step 4: Subjects</h2>
          <p>Add the subjects you want to focus on:</p>
          <div className="subject-input__flow__inp__user__Data">
            <input
              type="text"
              placeholder="Enter a subject"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              className="input__flow__inp__user__Data"
            />
            <button
              onClick={() => {
                if (subjectInput.trim() && !formData.subjects.includes(subjectInput)) {
                  setFormData({
                    ...formData,
                    subjects: [...formData.subjects, subjectInput.trim()],
                  });
                  setSubjectInput("");
                }
              }}
              className="add-btn__flow__inp__user__Data"
            >
              Add
            </button>
          </div>
          <div className="subjects-list__flow__inp__user__Data">
            {formData.subjects.map((subject, index) => (
              <div key={index} className="subject-chip__flow__inp__user__Data">
                {subject}
                <span
                  className="remove-btn__flow__inp__user__Data"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      subjects: formData.subjects.filter((_, i) => i !== index),
                    })
                  }
                >
                  &times;
                </span>
              </div>
            ))}
          </div>
          <div className="buttons-container__flow__inp__user__Data">
            <button className="back-btn__flow__inp__user__Data" onClick={handleBack}>
              Back
            </button>
            <button
              className={`next-btn__flow__inp__user__Data ${
                formData.subjects.length > 0 ? "" : "disabled__flow__inp__user__Data"
              }`}
              onClick={handleNext}
              disabled={formData.subjects.length === 0}
            >
              Next
            </button>
          </div>
        </div>
      )}

{step === 5 && (
  <div className="step__flow__inp__user__Data">
    <h2 className="subheader__flow__inp__user__Data">Step 5: Goals</h2>
    <p>Select your goals:</p>
    <div className="buttons-row__flow__inp__user__Data">
      {[
        "Improve grades",
        "Prepare for exams",
        "Learn new subjects",
        "Master time management",
        "Build a study routine",
      ].map((goal) => (
        <button
          key={goal}
          className={`btn__flow__inp__user__Data ${
            formData.goals.includes(goal) ? "selected__flow__inp__user__Data" : ""
          }`}
          onClick={() => {
            if (formData.goals.includes(goal)) {
              setFormData({
                ...formData,
                goals: formData.goals.filter((g) => g !== goal),
              });
            } else {
              setFormData({ ...formData, goals: [...formData.goals, goal] });
            }
          }}
        >
          {goal}
        </button>
      ))}
    </div>
    <div className="buttons-container__flow__inp__user__Data">
      <button className="back-btn__flow__inp__user__Data" onClick={handleBack}>
        Back
      </button>
      <button
        className={`next-btn__flow__inp__user__Data ${
          formData.goals.length > 0 ? "" : "disabled__flow__inp__user__Data"
        }`}
        onClick={handleSubmit}
        disabled={formData.goals.length === 0}
      >
        Submit
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default InputFlowStudyPlan;
