import React from 'react';
import { useNavigate } from 'react-router-dom';
import './helpMain.css'; // Ensure this file contains the necessary styling

const AboutAppPage = () => {
  const navigate = useNavigate();

  return (
    <div className="blog-container-help-page">
      <button className="back-button-help-page" onClick={() => navigate(-1)}>
        ← 
      </button>
      <article className="blog-article-help-page">
        <header className="blog-header-help-page">
          <h1 className="blog-title-help-page">About Edusify</h1>
        </header>
        <section className="blog-introduction-help-page">
          <p>Welcome to Edusify, your ultimate study companion designed to enhance your learning journey. Our app provides a comprehensive suite of tools to help you stay organized, collaborate with peers, and make studying more engaging and effective. Here’s a deep dive into how Edusify can transform your study experience:</p>
        </section>

        <section className="blog-why-use-us-help-page">
          <h2>Why Use Us?</h2>
          <p>Edusify is crafted for students and lifelong learners who seek a streamlined, engaging, and visually appealing study experience. By integrating essential study tools into a single platform, Edusify eliminates the need for multiple apps and helps you maintain focus and productivity. Our app supports you through every phase of learning, from managing tasks to collaborating with peers and personalizing your study environment.</p>
        </section>

        <section className="blog-how-we-can-help-help-page">
          <h2>How We Can Help</h2>
          <p>Edusify offers a suite of features designed to simplify and enhance your study routine:</p>
          <ul>
            <li><strong>Streamlined Task Management:</strong> Keep track of your assignments and deadlines with our intuitive task manager.</li>
            <li><strong>Effective Collaboration:</strong> Form study groups, share resources, and work together on projects.</li>
            <li><strong>Enhanced Study Tools:</strong> Use customizable notes, flashcards, and quizzes to reinforce your learning.</li>
            <li><strong>Productivity Boosters:</strong> Utilize our Pomodoro timer and reminders to manage your time efficiently.</li>
            <li><strong>Personalized Study Environment:</strong> Customize your app experience with themes and music to match your study style.</li>
          </ul>
        </section>

        <section className="blog-why-edusify-help-page">
          <h2>Why Choose Edusify?</h2>
          <p>Edusify stands out due to its holistic approach to studying. Our app integrates multiple functionalities into one platform, making it easier to stay organized and motivated. Whether you’re preparing for exams, managing long-term projects, or simply looking to enhance your study routine, Edusify provides the tools and support you need.</p>
        </section>

        <section className="blog-how-people-can-improve-help-page">
          <h2>How You Can Improve with Edusify</h2>
          <p>Edusify empowers you to:</p>
          <ul>
            <li><strong>Enhance Productivity:</strong> Use our task manager and Pomodoro timer to boost your efficiency and focus.</li>
            <li><strong>Facilitate Collaboration:</strong> Leverage study groups and the social feed to share knowledge and resources.</li>
            <li><strong>Personalize Your Learning:</strong> Customize notes, themes, and notifications to fit your study preferences.</li>
            <li><strong>Stay Organized:</strong> Keep track of assignments, deadlines, and study sessions with our integrated calendar and reminders.</li>
          </ul>
        </section>

        <section className="blog-what-will-happen-if-not-use-help-page">
          <h2>What Happens if You Don't Use Modern Apps Like Edusify?</h2>
          <p>Without modern study tools like Edusify, you might face challenges such as:</p>
          <ul>
            <li><strong>Disorganization:</strong> Managing tasks and deadlines across multiple platforms can lead to confusion and missed deadlines.</li>
            <li><strong>Lack of Collaboration:</strong> Limited tools for group work can hinder effective communication and teamwork.</li>
            <li><strong>Reduced Productivity:</strong> Without productivity tools like Pomodoro timers, you may struggle with maintaining focus and efficiency.</li>
            <li><strong>Less Motivation:</strong> A lack of customization and visual appeal can make studying less engaging and motivating.</li>
          </ul>
        </section>

        <section className="blog-tips-help-page">
          <h2>Tips for Maximizing Edusify</h2>
          <ul>
            <li><strong>Set Clear Goals:</strong> Define your study goals and use Edusify’s task management and reminders to stay on track.</li>
            <li><strong>Utilize Study Groups:</strong> Engage with peers through study groups and the social feed to enhance your learning experience.</li>
            <li><strong>Customize Your Study Space:</strong> Personalize the app with themes and music to create a study environment that motivates you.</li>
            <li><strong>Regularly Review and Adjust:</strong> Continuously assess your study routine and adjust your use of Edusify’s tools to better meet your needs.</li>
          </ul>
        </section>

        <section className="blog-advantages-help-page">
          <h2>Advantages of Edusify</h2>
          <ul>
            <li><strong>All-in-One Solution:</strong> Combine multiple study tools into one platform, reducing the need for separate apps.</li>
            <li><strong>Enhanced Visual Appeal:</strong> Enjoy a beautifully designed interface that makes studying more engaging.</li>
            <li><strong>Effective Collaboration:</strong> Use study groups and the social feed to collaborate and share knowledge.</li>
            <li><strong>Improved Productivity:</strong> Stay focused and organized with productivity tools like the Pomodoro timer and task manager.</li>
            <li><strong>Customizable Experience:</strong> Personalize your study environment with themes, music, and customizable notes.</li>
          </ul>
        </section>

        <section className="blog-features-help-page">
          <h2>Key Features</h2>
          <div className="feature-card-help-page">
            <h3>Task Management</h3>
            <p>Organize your assignments, set priorities, and track your progress with a visually appealing task management system.</p>
          </div>
          <div className="feature-card-help-page">
            <h3>Collaborative Study Groups</h3>
            <p>Form and join study groups, share resources, and collaborate on projects effectively.</p>
          </div>
          <div className="feature-card-help-page">
            <h3>Aesthetic Notes & Flashcards</h3>
            <p>Create and customize notes and flashcards to make studying more engaging and effective.</p>
          </div>
          <div className="feature-card-help-page">
            <h3>Pomodoro Timer</h3>
            <p>Boost your productivity by breaking study sessions into intervals with regular breaks.</p>
          </div>
          <div className="feature-card-help-page">
            <h3>Music Player</h3>
            <p>Enjoy curated playlists designed to enhance concentration and relaxation during study sessions.</p>
          </div>
          <div className="feature-card-help-page">
            <h3>Calendar & Reminders</h3>
            <p>Track all your study sessions, deadlines, and events with an integrated calendar and reminders.</p>
          </div>
          <div className="feature-card-help-page">
            <h3>Social Feed</h3>
            <p>Share achievements and engage with the Edusify community through our social feed.</p>
          </div>
          <div className="feature-card-help-page">
            <h3>Subject Helpers</h3>
            <p>Get AI-powered assistance with math, science, and more to simplify complex concepts.</p>
          </div>
        </section>

        <section className="blog-conclusion-help-page">
          <h2>Conclusion</h2>
          <p>Edusify is more than just a study app; it’s your personal study companion designed to help you stay organized, productive, and motivated. With a focus on aesthetic design, collaboration, and powerful study tools, Edusify transforms your study routine into a visually pleasing and efficient process. Whether you’re a student or lifelong learner, Edusify is here to support your academic journey, making learning an enjoyable and rewarding experience.</p>
        </section>
      </article>
    </div>
  );
};

export default AboutAppPage;
