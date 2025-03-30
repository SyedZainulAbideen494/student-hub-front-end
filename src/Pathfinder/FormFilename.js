import React, { useState } from "react";
import "./FormFilename.css";
import { useNavigate } from "react-router-dom";

const FormFilename = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    currentGrades: "",
    pastGrades: "",
    bestSubject: "",
    worstSubject: "",
    preferredSubjects: "",
    fieldOfInterest: "",
    workStyle: "",
    studyHabits: "",
    skills: "",
    extracurriculars: "",
    targetExams: "",
    examPrepLevel: "",
    studyLocation: "",
    budget: "",
  });
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/pathfinder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is sent
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      console.log("Server Response:", result);
  
      if (result.id) {
        navigate(`/career/${result.id}`); // Redirect to career page
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Check if required fields in the current step are filled
  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.currentGrades && formData.bestSubject && formData.worstSubject;
      case 2:
        return formData.preferredSubjects && formData.fieldOfInterest && formData.workStyle;
      case 3:
        return formData.studyHabits && formData.skills && formData.extracurriculars;
      case 4:
        return formData.targetExams && formData.examPrepLevel && formData.studyLocation;
      case 5:
        return formData.budget;
      default:
        return false;
    }
  };

  return (
    <div className="container__path__finder__form">
      <h1 className="title__path__finder__form">Pathfinder Survey</h1>
      <form onSubmit={handleSubmit} className="form__path__finder__form">
        
        {step === 1 && (
          <>
            <label className="label__path__finder__form">Current Grades</label>
            <input className="input__path__finder__form" type="text" name="currentGrades" onChange={handleChange} placeholder="e.g., 85%" />
            
            <label className="label__path__finder__form">Best Subject</label>
            <input className="input__path__finder__form" type="text" name="bestSubject" onChange={handleChange} placeholder="e.g., Math" />
            
            <label className="label__path__finder__form">Worst Subject</label>
            <input className="input__path__finder__form" type="text" name="worstSubject" onChange={handleChange} placeholder="e.g., Chemistry" />
          </>
        )}

        {step === 2 && (
          <>
            <label className="label__path__finder__form">Preferred Subjects</label>
            <input className="input__path__finder__form" type="text" name="preferredSubjects" onChange={handleChange} placeholder="e.g., Physics, Biology" />
            
            <label className="label__path__finder__form">Field of Interest</label>
            <input className="input__path__finder__form" type="text" name="fieldOfInterest" onChange={handleChange} placeholder="e.g., Medicine, AI, Business" />
            
            <label className="label__path__finder__form">Preferred Work Style</label>
            <select className="select__path__finder__form" name="workStyle" onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Research">Research</option>
              <option value="Hands-on">Hands-on</option>
              <option value="Management">Management</option>
            </select>
          </>
        )}

        {step === 3 && (
          <>
            <label className="label__path__finder__form">Study Habits</label>
            <select className="select__path__finder__form" name="studyHabits" onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Self-study">Self-study</option>
              <option value="Coaching">Coaching</option>
              <option value="Group Study">Group Study</option>
              <option value="Solo Study">Solo Study</option>
            </select>
            
            <label className="label__path__finder__form">Skills & Strengths</label>
            <input className="input__path__finder__form" type="text" name="skills" onChange={handleChange} placeholder="e.g., Analytical, Creative" />
            
            <label className="label__path__finder__form">Extracurriculars</label>
            <input className="input__path__finder__form" type="text" name="extracurriculars" onChange={handleChange} placeholder="e.g., Coding, Public Speaking" />
          </>
        )}

        {step === 4 && (
          <>
            <label className="label__path__finder__form">Target Exams</label>
            <input className="input__path__finder__form" type="text" name="targetExams" onChange={handleChange} placeholder="e.g., NEET, JEE" />
            
            <label className="label__path__finder__form">Exam Preparation Level</label>
            <select className="select__path__finder__form" name="examPrepLevel" onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            
            <label className="label__path__finder__form">Study Location</label>
            <select className="select__path__finder__form" name="studyLocation" onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Local">Local</option>
              <option value="Abroad">Abroad</option>
            </select>
          </>
        )}

        {step === 5 && (
          <>
            <label className="label__path__finder__form">Budget for Higher Education</label>
            <input className="input__path__finder__form" type="text" name="budget" onChange={handleChange} placeholder="e.g., $10,000 - $50,000" />
          </>
        )}

        <div className="buttons__path__finder__form">
          {step > 1 && (
            <button type="button" className="btn__path__finder__form" onClick={prevStep}>
              Previous
            </button>
          )}
          {step < 5 ? (
            <button type="button" className="btn__path__finder__form" onClick={nextStep} disabled={!isStepValid()}>
              Next
            </button>
          ) : (
            <button type="submit" className="btn__path__finder__form" disabled={!isStepValid()}>
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormFilename;
