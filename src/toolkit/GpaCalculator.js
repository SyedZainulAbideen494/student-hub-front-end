import React, { useState } from 'react';
import './GpaCalculator.css'; // Import the CSS file

const GpaCalculator = () => {
    const [courses, setCourses] = useState([]);
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [credits, setCredits] = useState('');
    const [gpa, setGpa] = useState(null);

    const goBack = () => {
        window.history.back();
    };

    const addCourse = (e) => {
        e.preventDefault();
        const newCourse = { subject, grade, credits: parseFloat(credits) };
        setCourses([...courses, newCourse]);
        setSubject('');
        setGrade('');
        setCredits('');
    };

    const calculateGPA = () => {
        let totalPoints = 0;
        let totalCredits = 0;

        courses.forEach((course) => {
            const gradePoints = getGradePoints(course.grade);
            if (gradePoints !== null) {
                totalPoints += gradePoints * course.credits;
                totalCredits += course.credits;
            }
        });

        const calculatedGPA = (totalPoints / totalCredits).toFixed(2);
        setGpa(calculatedGPA);
    };

    const getGradePoints = (grade) => {
        switch (grade.toUpperCase()) {
            case 'A': return 4.0;
            case 'A-': return 3.7;
            case 'B+': return 3.3;
            case 'B': return 3.0;
            case 'B-': return 2.7;
            case 'C+': return 2.3;
            case 'C': return 2.0;
            case 'C-': return 1.7;
            case 'D+': return 1.3;
            case 'D': return 1.0;
            case 'F': return 0.0;
            default: return null; // Invalid grade
        }
    };

    return (
        <div className="gpt__calculator__toolKit">
            <header className="gpt__calculator__toolKit__header">
                <button className="gpt__calculator__toolKit__back-btn" onClick={goBack}>←</button>
                <h1 className="gpt__calculator__toolKit__title">GPA Calculator</h1>
            </header>
            <div className="gpt__calculator__toolKit__container">
                <form onSubmit={addCourse} className="gpt__calculator__toolKit__form">
                    <div className="gpt__calculator__toolKit__input-group">
                        <label htmlFor="subject">Subject:</label>
                        <input
                            type="text"
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            className="gpt__calculator__toolKit__input"
                        />
                    </div>
                    <div className="gpt__calculator__toolKit__input-group">
                        <label htmlFor="grade">Grade (A-F):</label>
                        <input
                            type="text"
                            id="grade"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            maxLength="2"
                            required
                            className="gpt__calculator__toolKit__input"
                        />
                    </div>
                    <div className="gpt__calculator__toolKit__input-group">
                        <label htmlFor="credits">Credits:</label>
                        <input
                            type="number"
                            id="credits"
                            value={credits}
                            onChange={(e) => setCredits(e.target.value)}
                            required
                            className="gpt__calculator__toolKit__input"
                        />
                    </div>
                    <button type="submit" className="gpt__calculator__toolKit__submit-btn">Add Course</button>
                </form>
                <div className="gpt__calculator__toolKit__courses-list">
                    {courses.length > 0 && (
                        <ul>
                            {courses.map((course, index) => (
                                <li key={index} className="gpt__calculator__toolKit__course-item">
                                    {course.subject} - {course.grade} - {course.credits} Credits
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button className="gpt__calculator__toolKit__submit-btn" onClick={calculateGPA}>Calculate GPA</button>
                {gpa !== null && (
                    <div className="gpt__calculator__toolKit__result">Your GPA: <span className="gpt__calculator__toolKit__gpa-value">{gpa}</span></div>
                )}
            </div>
        </div>
    );
};

export default GpaCalculator;
