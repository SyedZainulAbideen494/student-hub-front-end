import React, { useState } from "react";
import "./UserFlow.css"; // Import CSS file
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../app_modules/apiRoutes";

const UserFlow = () => {
  const [step, setStep] = useState(1); // Track current step
  const [selectedGrade, setSelectedGrade] = useState(null); // Track grade
  const [selectedGoal, setSelectedGoal] = useState(null); // Track goal
  const [selectedStudyTime, setSelectedStudyTime] = useState(null); // Track study time
  const [selectedSpeed, setSelectedSpeed] = useState(null); // Track speed
  const [selectedRevisionMethod, setSelectedRevisionMethod] = useState(null); // Track revision method
  const [selectedPomodoro, setSelectedPomodoro] = useState(null); // Track Pomodoro preference
  const [selectedSubjects, setSelectedSubjects] = useState([]); // Track selected subjects
  const [subjectInput, setSubjectInput] = useState(""); // Track user input for subjects
  const [subjectDifficulty, setSubjectDifficulty] = useState(""); // Track difficulty level for each subject
  const navigate = useNavigate(); // For page transitions

  const steps = [
    {
      id: 1,
      question: "What grade are you in?",
      subtext: "This helps us understand your academic level.",
      options: ["Primary School", "Middle School", "High School", "College"],
      setSelection: setSelectedGrade
    },
    {
      id: 2,
      question: "What's your primary goal?",
      subtext: "Choose what you want to achieve.",
      options: [
        "Improve Grades",
        "Stay Constant with Studies",
        "Prepare for an Exam",
      ],
      setSelection: setSelectedGoal
    },
    {
      id: 3,
      question: "How much time can you allocate for studying each day?",
      subtext: "Select the daily hours you can commit.",
      options: [
        "Less than 1 hour",
        "1 - 2 hours",
        "2 - 4 hours",
        "4 - 8 hours",
        "8+ hours",
      ],
      setSelection: setSelectedStudyTime
    },
    {
      id: 4,
      question: "How fast would you like to accomplish your goal?",
      subtext: "Choose the pace that suits your style.",
      options: ["Slow and Steady", "Average Speed", "Fast"],
      setSelection: setSelectedSpeed
    },
    {
      id: 5,
      question: "Select your preferred revision method:",
      subtext: "You can choose one or both.",
      options: ["Flashcards", "Quizzes", "Both"],
      setSelection: setSelectedRevisionMethod
    },
    {
      id: 6,
      question: "Which Pomodoro technique do you prefer?",
      subtext: "Choose your preferred study/break duration.",
      options: [
        "25 minutes of study with 5 minutes break",
        "50 minutes of study with 10 minutes break"
      ],
      setSelection: setSelectedPomodoro
    },    
    {
      id: 7,
      question: "Enter the subjects you study:",
      subtext: "Enter the subject and choose its difficulty (Easy, Moderate, or Difficult).",
      isManualInput: true, // Indicate that this step allows manual input
    },
  ];

  const currentStep = steps.find((s) => s.id === step);

  const handleNext = async () => {
    // Check if a selection is made for the current step
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      const data = {
        grade: selectedGrade,
        goal: selectedGoal,
        study_time: selectedStudyTime,
        speed: selectedSpeed,
        revision_method: selectedRevisionMethod,
        pomodoro_preference: selectedPomodoro,
        subjects: JSON.stringify(selectedSubjects),
      };
  
      try {
        const token = localStorage.getItem("token");
  
        navigate("/loading-goal-plan"); // Show loading screen
  
        const response = await fetch(API_ROUTES.generateStudyPlan, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, data }),
        });
  
        const result = await response.json();
  
        if (result.success) {
          // Navigate to the Study Plan Page and pass the study plan
          navigate("/study-plan", { state: { studyPlan: result.studyPlan } });
        } else {
          alert("Failed to save goal");
          navigate(-1); // Go back to the user flow
        }
      } catch (error) {
        console.error("Error saving goal:", error);
        navigate(-1); // Go back to the user flow
      }
    }
  };
  
  // Disable the "Next" button if no option is selected for the current step
  const isStepSelected = () => {
    if (currentStep.id === 1) return selectedGrade !== null;
    if (currentStep.id === 2) return selectedGoal !== null;
    if (currentStep.id === 3) return selectedStudyTime !== null;
    if (currentStep.id === 4) return selectedSpeed !== null;
    if (currentStep.id === 5) return selectedRevisionMethod !== null;
    if (currentStep.id === 6) return selectedPomodoro !== null;
    if (currentStep.id === 7) return selectedSubjects.length > 0;
    return false;
  };
  

  const handleSubjectInput = () => {
    if (subjectInput && subjectDifficulty) {
      setSelectedSubjects((prev) => [
        ...prev,
        { subject: subjectInput, difficulty: subjectDifficulty },
      ]);
      setSubjectInput(""); // Clear the input after adding
      setSubjectDifficulty(""); // Clear the difficulty selection
    }
  };

  return (
    <div className="flow__user__container">
    {/* Progress Bar */}
    <div className="flow__user__progress">
      <div
        className="flow__user__progress-bar"
        style={{ width: `${(step / steps.length) * 100}%` }}
      />
    </div>

    {/* Main Content */}
    <div className="flow__user__content">
      <h1 className="flow__user__question">{currentStep.question}</h1>
      <p className="flow__user__subtext">{currentStep.subtext}</p>

      {/* Manual Subject Input Section */}
      {currentStep.isManualInput ? (
        <div className="flow__user__manual-input">
          <input
            type="text"
            value={subjectInput}
            placeholder="Enter subject"
            onChange={(e) => setSubjectInput(e.target.value)}
            className="flow__user__input"
          />
          <select
            value={subjectDifficulty}
            onChange={(e) => setSubjectDifficulty(e.target.value)}
            className="flow__user__select"
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Difficult">Difficult</option>
          </select>
          <button
            onClick={handleSubjectInput}
            className="flow__user__btn"
            disabled={!subjectInput || !subjectDifficulty}
          >
            Add Subject
          </button>
          <div className="flow__user__subjects-list">
            {selectedSubjects.map((item, index) => (
              <div key={index} className="flow__user__subject-item">
                <p>{item.subject} - {item.difficulty}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flow__user__options">
          {currentStep.options.map((option, index) => (
            <button
              key={index}
              className={`flow__user__option ${
                (currentStep.setSelection === setSelectedGrade && selectedGrade === option) ||
                (currentStep.setSelection === setSelectedGoal && selectedGoal === option) ||
                (currentStep.setSelection === setSelectedStudyTime && selectedStudyTime === option) ||
                (currentStep.setSelection === setSelectedSpeed && selectedSpeed === option) ||
                (currentStep.setSelection === setSelectedRevisionMethod && selectedRevisionMethod === option) ||
                (currentStep.setSelection === setSelectedPomodoro && selectedPomodoro === option)
                  ? "flow__user__selected"
                  : ""
              }`}
              onClick={() => currentStep.setSelection(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>

    {/* Navigation */}
    <div className="flow__user__navigation">
      <button
        className="flow__user__btn"
        disabled={!isStepSelected()} // Disable if the step is not selected
        onClick={handleNext}
      >
        {step === steps.length ? "Generate Plan" : "Next"}
      </button>
    </div>
  </div>
  );
};

export default UserFlow;
