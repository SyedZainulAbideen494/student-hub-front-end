import React, { useEffect } from "react";
import "./GuideToEdusify.css";
import { FaTasks, FaClock, FaBook, FaQuestionCircle, FaUsers, FaStickyNote, FaChartBar, FaArrowLeft, FaArrowAltCircleLeft } from "react-icons/fa";

const GuideToEdusify = () => {
  const handleBackClick = () => {
    window.history.back();
  };


  useEffect(() => {
    // Check if the guide has been viewed before
    const viewedGuide = localStorage.getItem("viewedGuide");

    if (!viewedGuide) {
      // Start a timer to track how long the user stays on the page
      const timer = setTimeout(() => {
        // Set the flag in localStorage after 7 seconds
        localStorage.setItem("viewedGuide", "true");
        console.log("User has viewed the guide for more than 7 seconds.");
      }, 4000); // 7 seconds

      // Clean up the timer when the component unmounts or when it's no longer needed
      return () => clearTimeout(timer);
    }
  }, []); // Empty dependency array means this effect runs only once when the component mounts


  return (
    <div className="container__guide__to__Edusify">
      {/* Back Button */}
      <button className="back__button__guide__to__Edusify" onClick={handleBackClick}>
        <FaArrowLeft className="back__icon__guide__to__Edusify" />

      </button>

      <h1 className="title__guide__to__Edusify">How to Use Edusify Daily</h1>

      {/* Daily Routine Section */}
      <section className="section__guide__to__Edusify">
        <h2 className="subtitle__guide__to__Edusify">Unlock Edusify's Full Potential!</h2>
        <ol className="list__guide__to__Edusify">
          <li><strong>Start Your Day with a Plan:</strong> Review your study plan using the AI-powered Planner.</li>
          <li><strong>Get Focused with the Pomodoro Timer:</strong> Use the Pomodoro Timer for 25-minute focused study sessions.</li>
          <li><strong>Review and Take Notes:</strong> Organize your notes by subject and add multimedia.</li>
          <li><strong>Generate Flashcards:</strong> Create flashcards from your notes for active recall.</li>
          <li><strong>Take Quizzes:</strong> Test your knowledge with AI-generated quizzes.</li>
          <li><strong>Use Rooms for Collaboration:</strong> Join study rooms to stay motivated and share resources.</li>
          <li><strong>Ask for Help or Talk to AI:</strong> Ask the AI Assistant for help with tough concepts.</li>
          <li><strong>Review Your Progress:</strong> Check your completed tasks and progress.</li>
          <li><strong>Reschedule Unfinished Tasks:</strong> Move any unfinished tasks to tomorrow.</li>
        </ol>
      </section>

      {/* Tips Section */}
      <section className="section__guide__to__Edusify">
        <h2 className="subtitle__guide__to__Edusify">Tips for Using Edusify Effectively</h2>
        <ul className="list__guide__to__Edusify">
          <li><strong>Consistency Is Key:</strong> Make Edusify a daily habit.</li>
          <li><strong>Use AI Wisely:</strong> Leverage AI for time-saving and focused learning.</li>
          <li><strong>Focus on Progress:</strong> Set and achieve weekly goals.</li>
          <li><strong>Break Down Large Tasks:</strong> Use Pomodoro for smaller study sessions.</li>
          <li><strong>Stay Social with Rooms:</strong> Use rooms for motivation and collaboration.</li>
        </ul>
      </section>

      {/* Features Section */}
      <section className="section__guide__to__Edusify">
        <h2 className="subtitle__guide__to__Edusify">How to Use Each Feature Effectively</h2>
        <div className="features__guide__to__Edusify">
          <div className="feature__guide__to__Edusify">
            <FaTasks className="icon__guide__to__Edusify" />
            <h3>1. Planner (To-Do List)</h3>
            <p>Use the AI planner to generate and prioritize your tasks.</p>
          </div>
          <div className="feature__guide__to__Edusify">
            <FaClock className="icon__guide__to__Edusify" />
            <h3>2. Pomodoro Timer</h3>
            <p>Stay focused with the Pomodoro technique and track your study sessions.</p>
          </div>
          <div className="feature__guide__to__Edusify">
            <FaBook className="icon__guide__to__Edusify" />
            <h3>3. Flashcards</h3>
            <p>Create flashcards from notes and PDFs for quick review and active recall.</p>
          </div>
          <div className="feature__guide__to__Edusify">
            <FaQuestionCircle className="icon__guide__to__Edusify" />
            <h3>4. AI-Generated Quizzes</h3>
            <p>Test your knowledge with custom quizzes and track your learning progress.</p>
          </div>
          <div className="feature__guide__to__Edusify">
            <FaUsers className="icon__guide__to__Edusify" />
            <h3>5. Rooms</h3>
            <p>Collaborate in rooms to share notes, quizzes, and track each other’s progress.</p>
          </div>
          <div className="feature__guide__to__Edusify">
            <FaStickyNote className="icon__guide__to__Edusify" />
            <h3>6. Notes</h3>
            <p>Organize notes by subject and add multimedia for better understanding.</p>
          </div>
          <div className="feature__guide__to__Edusify">
            <FaChartBar className="icon__guide__to__Edusify" />
            <h3>7. Weekly AI-Generated Feedback</h3>
            <p>Get insights on your weekly performance and adjust your study plan accordingly.</p>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="section__guide__to__Edusify">
        <h2 className="subtitle__guide__to__Edusify">Conclusion</h2>
        <p>Make Edusify a daily habit, track your progress, and improve consistently!</p>
      </section>
    </div>
  );
};

export default GuideToEdusify;
