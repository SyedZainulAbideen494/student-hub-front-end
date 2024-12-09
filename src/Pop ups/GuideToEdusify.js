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
      <h2 className="subtitle__guide__to__Edusify">Maximize Your Study Efficiency with Edusify!</h2>
      <ol className="list__guide__to__Edusify">
        <li><strong>Kickstart Your Day:</strong> Open Edusify and check your tasks in the Planner to set a goal for your day.</li>
        <li><strong>Prioritize Tasks:</strong> Use the AI Assistant to help you break down larger tasks into manageable parts.</li>
        <li><strong>Focus with Pomodoro:</strong> Use the Pomodoro Timer to focus on your tasks for 25 minutes, followed by a 5-minute break.</li>
        <li><strong>Take Notes:</strong> Record key concepts and ideas in your Notes section, adding images or videos where necessary.</li>
        <li><strong>Generate Flashcards:</strong> Convert your notes into flashcards for active recall and memory strengthening.</li>
        <li><strong>Challenge Yourself with Quizzes:</strong> Take AI-generated quizzes based on your notes to test your knowledge.</li>
        <li><strong>Collaborate in Rooms:</strong> Join study rooms to engage with other users, share resources, and stay motivated.</li>
        <li><strong>Track Progress:</strong> Review your task completion, quiz scores, and study stats regularly to stay on track.</li>
        <li><strong>Reschedule Unfinished Tasks:</strong> Move any unfinished tasks to the next day using the Planner for better time management.</li>
      </ol>
    </section>
  
    {/* Tips Section */}
    <section className="section__guide__to__Edusify">
      <h2 className="subtitle__guide__to__Edusify">Tips for Optimizing Your Edusify Experience</h2>
      <ul className="list__guide__to__Edusify">
        <li><strong>Consistency is Key:</strong> Make using Edusify a daily habit for long-term success.</li>
        <li><strong>Leverage AI for Efficiency:</strong> Use the AI Assistant to generate tasks, notes, and quizzes quickly.</li>
        <li><strong>Set Realistic Goals:</strong> Break down your study sessions into manageable chunks to avoid burnout.</li>
        <li><strong>Collaborate for Motivation:</strong> Stay motivated and share resources with others in Rooms.</li>
        <li><strong>Review Your Progress:</strong> Track your daily and weekly performance to adjust your study strategy as needed.</li>
      </ul>
    </section>
  
    {/* Features Section */}
    <section className="section__guide__to__Edusify">
      <h2 className="subtitle__guide__to__Edusify">How to Use Each Feature Effectively</h2>
      <div className="features__guide__to__Edusify">
        <div className="feature__guide__to__Edusify">
          <FaTasks className="icon__guide__to__Edusify" />
          <h3>1. Planner (To-Do List)</h3>
          <p>Plan your day by adding tasks, or let the AI generate them for you based on your study needs.</p>
        </div>
        <div className="feature__guide__to__Edusify">
          <FaClock className="icon__guide__to__Edusify" />
          <h3>2. Pomodoro Timer</h3>
          <p>Use the Pomodoro technique for focused 25-minute study sessions, followed by short breaks.</p>
        </div>
        <div className="feature__guide__to__Edusify">
          <FaBook className="icon__guide__to__Edusify" />
          <h3>3. Flashcards</h3>
          <p>Create flashcards from your notes or PDFs for quick review and to strengthen your memory.</p>
        </div>
        <div className="feature__guide__to__Edusify">
          <FaQuestionCircle className="icon__guide__to__Edusify" />
          <h3>4. AI-Generated Quizzes</h3>
          <p>Test your knowledge with quizzes generated from your notes, and track your learning progress.</p>
        </div>
        <div className="feature__guide__to__Edusify">
          <FaUsers className="icon__guide__to__Edusify" />
          <h3>5. Rooms</h3>
          <p>Join study rooms to collaborate, share notes and resources, and stay motivated with friends.</p>
        </div>
        <div className="feature__guide__to__Edusify">
          <FaStickyNote className="icon__guide__to__Edusify" />
          <h3>6. Notes</h3>
          <p>Take detailed notes on each subject and organize them by topic. Add multimedia for a better learning experience.</p>
        </div>
        <div className="feature__guide__to__Edusify">
          <FaChartBar className="icon__guide__to__Edusify" />
          <h3>7. Weekly AI-Generated Feedback</h3>
          <p>Review weekly feedback generated by AI to understand your progress and improve your study habits.</p>
        </div>
      </div>
    </section>
  
    {/* Conclusion */}
    <section className="section__guide__to__Edusify">
      <h2 className="subtitle__guide__to__Edusify">Conclusion</h2>
      <p>Use Edusify consistently, track your progress, and make continuous improvements in your studies!</p>
    </section>
  </div>
  
  );
};

export default GuideToEdusify;
