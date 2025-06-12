import { useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faTelegram, faChrome, faGoogle } from '@fortawesome/free-brands-svg-icons';
import './helpMain.css';
import InviteFriends from './InviteFriends';
import FeedbackForm from './FeedbackForm';
import MadeWithLove from '../app_modules/madeWithLove';

const HelpMain = () => {
  const navigate = useNavigate(); // Hook to navigate
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="help-main-container-help-page">
      {/* Back Button */}
      <button className="back-button-help-page" onClick={() => navigate(-1)}>
        ←
      </button>

      <h1 className="welcome-message-help-page">Welcome to Edusify: Your Ultimate Study Companion!</h1>

      <p className="app-description-help-page">
        Edusify is an all-in-one study app designed to enhance your learning experience with a suite of powerful tools. Stay organized, collaborate, and make studying more enjoyable!
      </p>

      {/* Help Section: Troubleshooting and Support */}
      <div className="help-section">
        <h2>How to Get the Most Out of Edusify</h2>
        <p>Here are some helpful tips to ensure you're getting the best experience with Edusify:</p>
        <ul>
          <li><strong>Set up your custom study plan:</strong> Use the AI-powered study plan generator to create a personalized schedule.</li>
          <li><strong>Maximize your productivity:</strong> Make use of the Pomodoro timer and to-do list features for better focus and organization.</li>
          <li><strong>Collaborate with peers:</strong> Share notes, quizzes, and stats with your friends using the friends feature.</li>
          <li><strong>Explore AI features:</strong> Try out Magic for generating quizzes, flashcards, and study notes automatically.</li>
          <li><strong>Sync your PDFs:</strong> Upload and create notes directly from your study materials in PDF format for a seamless study experience.</li>
        </ul>

        <h3>Frequently Asked Questions (FAQs)</h3>
        <div>
          <h4>1. How do I reset my password?</h4>
          <p>If you've forgotten your password, simply go to the login page and click on the "Forgot Password" link. Follow the instructions to reset it.</p>

          <h4>2. How do I upgrade to the Premium version?</h4>
          <p>To unlock premium features, go to the settings page and select "Upgrade to Premium." It's only ₹99 per month!</p>

          <h4>3. How do I contact support?</h4>
          <p>If you're facing any issues, feel free to reach out to us at <a href="mailto:edusyfy@gmail.com">edusyfy@gmail.com</a>. We'll get back to you as soon as possible!</p>
        </div>

        <h3>If you're facing any difficulty, don't hesitate to contact us!</h3>
        <p>Our support team is always here to help. Reach out via:</p>
        <ul>
          <li>Email: <a href="mailto:edusyfy@gmail.com">edusyfy@gmail.com</a></li>
          <li>Telegram: <a href="https://t.me/edusify" target="_blank" rel="noopener noreferrer">Join our Telegram channel</a></li>
        </ul>
      </div>

      {/* Premium Benefits Section */}
      <div className="premium-benefits-section">
        <h2>Why Go Premium?</h2>
        <p>Unlock the full potential of Edusify with our premium version. Here's why you should upgrade:</p>
        <ul>
          <li><strong>Unlimited AI Magic:</strong> Generate as many study notes, quizzes, and flashcards as you want without limitations.</li>
          <li><strong>Custom Study Plans:</strong> Get personalized study plans tailored to your learning needs, updated every month.</li>
          <li><strong>AI Task Generation:</strong> Access AI-generated tasks for more structured and effective study sessions.</li>
          <li><strong>No Ads:</strong> Enjoy an uninterrupted experience without any ads on the app.</li>
          <li><strong>Priority Support:</strong> Get quicker responses and premium customer service whenever you need help.</li>
        </ul>
      </div>

      {/* Feature Usage Section */}
      <div className="feature-usage-section">
        <h2>Feature Usage Guide</h2>
        <h3>AI Assistant</h3>
        <p>The AI assistant is your personal study guide. It can answer questions, explain topics, and help you understand complex subjects. Simply type in your question, and the AI will provide a detailed answer.</p>

        <h3>Magic</h3>
        <p>Magic is an AI-powered tool that helps you generate study notes, quizzes, and flashcards. Use it to create personalized study materials quickly. In the free version, you can generate up to 5 items per day. Premium users have unlimited access to Magic!</p>

        <h3>Custom Study Plan</h3>
        <p>Create a study schedule that works for you! The AI will suggest a plan based on your goals, subject preferences, and available time. You can update it monthly, and premium users can access more personalized options.</p>

        <h3>To-Do List</h3>
        <p>Stay organized by creating a to-do list of tasks. The AI assistant can even generate tasks based on your study goals, and you can get reminders in the premium version!</p>

        <h3>Notes from PDFs</h3>
        <p>Upload your PDFs, and the AI will extract relevant notes and summarize them for easy study. Premium users can upload unlimited PDFs, while free users have a daily limit of 5.</p>

        <h3>Pomodoro Timer</h3>
        <p>Use the Pomodoro timer to enhance focus during study sessions. Breaks are essential to maintain productivity and mental clarity, and the Pomodoro technique helps you manage them effectively.</p>
      </div>

      {/* Thank You Section */}
      <div className="thank-you-section">
        <h2>Thank You for Choosing Edusify!</h2>
        <p>We're thrilled to have you as part of the Edusify community. Your feedback and support help us improve the app every day. We hope Edusify continues to be a valuable tool in your learning journey!</p>
      </div>

      {/* Feedback Form */}
      <div style={{ marginTop: '10px' }}>
        <FeedbackForm />
      </div>

      <footer className="footer-help-page">
        <p>© 2025 Edusify. All rights reserved.</p>

        {/* Social Media Links */}
        <div className="footer-social-links-help-page">
          <a href="https://www.instagram.com/edusify.app/" target="_blank" rel="noopener noreferrer" className="footer-social-icon-help-page">
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
          <a href="https://x.com/SyedZain_saz?t=mUNjUKoihNUivIYikdtu3g&s=08" target="_blank" rel="noopener noreferrer" className="footer-social-icon-help-page">
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
          <a href="https://edusify-download.vercel.app/" target="_blank" rel="noopener noreferrer" className="footer-social-icon-help-page">
            <FontAwesomeIcon icon={faChrome} size="2x" />
          </a>
          <a href="https://g.page/r/CbK_EhVVrsJqEAI/review" target="_blank" rel="noopener noreferrer" className="footer-social-icon-help-page">
            <FontAwesomeIcon icon={faGoogle} size="2x" />
          </a>
        </div>

        <Link to="/terms-and-conditions" className="footer-link-help-page">
          <p style={{ marginTop: '10px' }}>Terms and Conditions</p>
        </Link>
        <MadeWithLove/>
      </footer>
    </div>
  );
};

export default HelpMain;
