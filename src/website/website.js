import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './website.css'; // Import the CSS file
import logo from '../images/Edusify-logo-dark.png';
import { FaDownload, FaSignInAlt, FaInfoCircle, FaBars, FaTimes, FaStar, FaCheckCircle } from 'react-icons/fa'; // Font Awesome icons
import Typewriter from 'typewriter-effect';

// Handle file download
const handleDownload = async () => {
  const response = await fetch(API_ROUTES.downloadAndroid, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });

  if (!response.ok) {
    console.error('Failed to download file');
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Edusify.apk'; // Replace with your file name
  document.body.appendChild(a);
  a.click();
  a.remove();
};

// Check token and redirect
const checkTokenAndRedirect = async (token, navigate) => {
  try {
    const response = await axios.post(API_ROUTES.sessionCheck, { token });

    if (response.data.exists) {
      navigate('/planner');
    } else {
      console.error('No matching token found.');
    }
  } catch (error) {
    console.error('Error checking token:', error);
  }
};

// DownloadPage Component
const DownloadPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Replace with actual token retrieval logic
    checkTokenAndRedirect(token, navigate);
  }, [navigate]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Fragment>
      <div className="App-website">
        <header className="header-website">
          <div className="logo-website">Edusify</div>
          <nav>
            <Link to='/sign-up'>
            <a >Sign up</a>
            </Link>
            <button className="cta-button-website" onClick={handleDownload}>Download Now</button>
          </nav>
        </header>

        <div className="hero-website">
      <h1>
        <Typewriter
          options={{
            strings: ['Transform Your Study Routine', 'Discover Edusify, your ultimate study companion.'],
            autoStart: true,
            loop: true,
            delay: 75,
          }}
        />
      </h1>
      <p>Discover Edusify, your ultimate study companion.</p>
      <button className="cta-button-website" onClick={handleDownload}>Download Now</button>
    </div>

        <div className="intro-website">
          <h2>Why Edusify?</h2>
          <p>Simplify your study life with tasks, reminders, group studies, and more.</p>
          <button className="cta-button-website" onClick={handleDownload}>Download For Android</button>
        </div>

        <div className="features-website">
          <h2>Features</h2>
          <div className="features-list">
            <div className="feature-item">
              <FaCheckCircle size={30} color="#7161ef" />
              <p>Task Management</p>
              <ul>
                <li>Add and prioritize tasks</li>
                <li>Set reminders for tasks</li>
                <li>Track task completion</li>
              </ul>
            </div>
            <div className="feature-item">
              <FaCheckCircle size={30} color="#7161ef" />
              <p>Group Collaboration</p>
              <ul>
                <li>Create groups with friends</li>
                <li>Ask questions and share details within groups</li>
                <li>Share notes, flashcards, and quizzes within groups</li>
              </ul>
            </div>
            <div className="feature-item">
              <FaCheckCircle size={30} color="#7161ef" />
              <p>Notes and Flashcards</p>
              <ul>
                <li>Create, edit, and store notes and flashcards</li>
                <li>Download notes and flashcards as PDF</li>
                <li>Share notes and flashcards with group members</li>
              </ul>
            </div>
            <div className="feature-item">
              <FaCheckCircle size={30} color="#7161ef" />
              <p>Quizzes</p>
              <ul>
                <li>Create and share quizzes</li>
                <li>Participate in quizzes created by others</li>
                <li>View quiz results as both admin and participant</li>
              </ul>
            </div>
            <div className="feature-item">
              <FaCheckCircle size={30} color="#7161ef" />
              <p>Calendar Integration</p>
              <ul>
                <li>Add important events such as exams and personal events</li>
                <li>Receive reminders for upcoming events</li>
              </ul>
            </div>
            <div className="feature-item">
              <FaCheckCircle size={30} color="#7161ef" />
              <p>Pomodoro Timer</p>
              <ul>
                <li>Integrated Pomodoro timer for focused study sessions</li>
              </ul>
            </div>
            <div className="feature-item">
              <FaCheckCircle size={30} color="#7161ef" />
              <p>In-built Music Player</p>
              <ul>
                <li>Access to an integrated music player for study sessions</li>
              </ul>
            </div>
            <div className="feature-item">
              <FaCheckCircle size={30} color="#7161ef" />
              <p>Social Feed</p>
              <ul>
                <li>Post thoughts, questions, and updates in the form of "Eduscribes" (similar to tweets)</li>
                <li>Interact with posts from other users</li>
              </ul>
            </div>
            <div className="feature-item">
              <FaCheckCircle size={30} color="#7161ef" />
              <p>Math and Science Helper</p>
              <ul>
                <li>Ask math and science questions</li>
                <li>Receive detailed explanations and solutions with images</li>
                <li>Voice command support for querying</li>
              </ul>
            </div>
            <div className="feature-item">
              <FaCheckCircle size={30} color="#7161ef" />
              <p>Search and Follow</p>
              <ul>
                <li>Search for friends and follow them</li>
                <li>View friends' quizzes, flashcards, and Eduscribes</li>
              </ul>
            </div>
            <div className="feature-item">
              <FaCheckCircle size={30} color="#7161ef" />
              <p>Voice Commands</p>
              <ul>
                <li>Use voice commands to interact with the math and science helper</li>
              </ul>
            </div>
            <div className="feature-item">
              <FaCheckCircle size={30} color="#7161ef" />
              <p>Task Priorities</p>
              <ul>
                <li>Set priorities for tasks to manage workload effectively</li>
              </ul>
            </div>
          </div>
        </div>

   
        <div class="faq-website">
  <h2>Frequently Asked Questions</h2>
  <div class="faq-list">
    <div class="faq-item">
      <h3>What is Edusify?</h3>
      <p>Edusify is a study companion app that helps you manage tasks, reminders, and group studies.</p>
    </div>
    <div class="faq-item">
      <h3>How can I download the app?</h3>
      <p>You can download the app by clicking the download button on this page.</p>
    </div>
    <div class="faq-item">
      <h3>How do I add and prioritize tasks?</h3>
      <p>In Edusify, you can add tasks in the task management section and prioritize them based on your needs.</p>
    </div>
    <div class="faq-item">
      <h3>Can I set reminders for tasks?</h3>
      <p>Yes, you can set reminders for all your tasks to help you stay on track.</p>
    </div>
    <div class="faq-item">
      <h3>How does group collaboration work?</h3>
      <p>You can create groups with friends, ask questions, share notes, flashcards, and quizzes within the group.</p>
    </div>
    <div class="faq-item">
      <h3>Can I download my notes and flashcards?</h3>
      <p>Yes, you can download your notes and flashcards as PDF files for offline use.</p>
    </div>
    <div class="faq-item">
      <h3>How can I create and share quizzes?</h3>
      <p>You can create quizzes in Edusify and share them with your groups. You can also participate in quizzes created by others.</p>
    </div>
    <div class="faq-item">
      <h3>What is the Pomodoro timer?</h3>
      <p>The Pomodoro timer is integrated into Edusify to help you manage focused study sessions with regular breaks.</p>
    </div>
    <div class="faq-item">
      <h3>Is there an integrated music player?</h3>
      <p>Yes, Edusify includes an integrated music player to help you listen to music while studying.</p>
    </div>
    <div class="faq-item">
      <h3>What is the social feed?</h3>
      <p>The social feed allows you to post thoughts, questions, and updates as "Eduscribes" and interact with posts from other users.</p>
    </div>
    <div class="faq-item">
      <h3>Can Edusify help with math and science questions?</h3>
      <p>Yes, Edusify has a Math and Science Helper where you can ask questions and receive detailed explanations with images.</p>
    </div>
    <div class="faq-item">
      <h3>How can I use voice commands?</h3>
      <p>You can use voice commands to interact with the math and science helper within Edusify.</p>
    </div>
    <div class="faq-item">
      <h3>Can I add important events to a calendar?</h3>
      <p>Yes, you can integrate your calendar to add important events such as exams and receive reminders for upcoming events.</p>
    </div>
    <div class="faq-item">
      <h3>How can I search and follow friends?</h3>
      <p>You can search for friends within Edusify, follow them, and view their quizzes, flashcards, and Eduscribes.</p>
    </div>
    <div class="faq-item">
      <h3>Can I set priorities for tasks?</h3>
      <p>Yes, Edusify allows you to set task priorities to manage your workload effectively.</p>
    </div>
    <div class="faq-item">
      <h3>Is Edusify available on Android and iOS?</h3>
      <p>Yes, Edusify is downloadable only for Android and iOS platforms must sign up to use the app.</p>
    </div>
    <div class="faq-item">
      <h3>Can I use Edusify on my PC or laptop?</h3>
      <p>No, Edusify is designed exclusively for mobile devices. Please use it on your Android or iOS smartphone.</p>
    </div>
  </div>
</div>

        <div className="call-to-action-website">
          <h2>Ready to Get Started?</h2>
          <button className="cta-button-website" onClick={handleDownload}>Download Now</button>
        </div>

        <footer className="footer-website">
          <nav>
            <Link to='/terms-and-conditions'>
            <a>Terms of Service</a>
            </Link>
          </nav>
        </footer>
      </div>
    </Fragment>
  );
};

export default DownloadPage;