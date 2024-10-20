import React, { useEffect, useState } from 'react';
import './DownloadPage.css';
import logo from '../images/Edusify-removebg-preview.png'; // Ensure the logo path is correct

const DownloadPageAndroid = () => {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const checkInAppBrowser = () => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      if (ua.includes("Instagram")) {
        setIsInAppBrowser(true);
      }
    };

    checkInAppBrowser();

    const beforeInstallPromptHandler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
  
      // Log download request to the server
      const response = await fetch('https://dropment.online/api/log-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outcome: choiceResult.outcome,
          appTitle: app.title, // You can include more data as needed
          timestamp: new Date().toISOString(),
        }),
      });
  
      if (response.ok) {
        console.log('Download request logged successfully');
      } else {
        console.error('Failed to log download request');
      }
  
      // Log user's choice
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    }
  };
  const handleOpenInBrowser = () => {
    const newWindow = window.open('https://edusify-download.vercel.app', '_blank');
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  const app = {
    title: "Edusify",
    description:
      "Edusify is your all-in-one learning companion, offering curated educational content and tools for optimal learning experiences. Download the app to elevate your studies today.",
    image: "https://via.placeholder.com/150",
    rating: 4.8,
    size: "100MB",
    version: "2.0.1",
    lastUpdated: "Oct 18, 2024",
    features: [
      "Personalized learning paths",
      "Offline access to materials",
      "Interactive quizzes and flashcards",
      "Community support and discussion forums",
      "View Today's Tasks and Events: A centralized place to see all tasks and events scheduled for the day.",
      "AI Question Answering: Get answers to study-related questions.",
      "Note Creation: Prompts for creating notes based on AI-generated responses.",
      "Task Management: Add tasks with titles, descriptions, priorities, and due dates.",
      "AI-Generated Task Breakdown: Users can prompt the AI to generate tasks based on a main task and the number of days available, complete with due dates and priorities.",
      "Email Reminders: Receive email reminders three days prior to the due date.",
      "Friend Search: Search for friends on the platform.",
      "Access to Friends’ Quizzes and Public Notes: View quizzes and notes shared by friends.",
      "Points System: Track user engagement through points earned by adding tasks and events.",
      "Competitive Ranking: See who uses Edusify the most.",
      "AI-Generated Flashcards: Create flashcards using AI or manually.",
      "Swipe Functionality: Swipe left if you don't know the answer or right if you do, while viewing stats on your performance.",
      "Quiz Creation: Create and share quizzes with friends.",
      "Results Tracking: View results of quizzes taken by friends.",
      "Customizable Notes: Create notes with options for different fonts, colors, backgrounds, images, and links.",
      "AI-Assisted Notes: Use AI to generate notes based on user prompts.",
      "Shareability: Share notes on Edusify groups and download them as PDFs.",
      "Community Support: Engage in discussions and receive support from peers in dedicated forums.",
      "Chat Functionality: Chat with friends in groups without notifications.",
      "Event Management: Add events and get reminders three days prior to the event date.",
      "Pomodoro Timer: Use a Pomodoro timer for effective study sessions.",
      "Stats Sharing: Save stats as images and share them.",
      "Stories: Share updates or experiences in a story format.",
      "Polls: Create and participate in polls.",
      "Posts: Share updates and engage with other users.",
      "Tagging: Tag friends in posts and comments.",
      "Reactions and Comments: Interact with posts through reactions and comments.",
      "Subject Tags: Use subject tags to categorize content.",
      "Filtered Feed: Filter content based on subjects or tags.",
      "Quiz and Notes Sharing: Share quizzes and notes with friends.",
      "Group Link Sharing: Share new group links for collaboration.",
      "Notifications: Receive notifications about interactions on posts.",
      "Secure Document Upload: Upload documents with password protection.",
      "Search and Download: Easily search for and download documents.",
      "Organizational Features: Create folders and categorize documents for better management."
    ],
    
    testimonials: [
      { name: "Arnav", feedback: "Hi... umm the app is very good and elegant with its ad free experience along with the smooth UI. Hope to see positive results. Thanks!" },
      { name: "Kaleem", feedback: "Edusify has completely changed the way I study. The AI tools are incredibly helpful, and I love how easy it is to stay organized with the task manager and calendar with daily reminders through email. It’s the perfect app for staying on top of everything!" },
      { name: "Jaythi", feedback: "Honestly speaking, it's a great app...it has all in one features to help me in my studies..before Edusify I used to make notes and my friends used to ask me to send it to them..but with Edusify I just create flashcards and share on Edusify's group so it's just one click and everyone gets the notes. And there is so much more in this app; a must-have for students." },
      { name: "lol2", feedback: "A all in one app for students, very easy to use, and free. If you don't use Edusify, it's a big loss for you!" }
    ]
  };

  

  return (
<div className="download-page__android__download">
  <div className="app-details-page__android__download">
    <div className="app-header-details__android__download">
      <img src={logo} alt={app.title} className="app-icon__android__download" />
      <div className="app-info__android__download">
        <h1>{app.title}</h1>
        <div className="app-rating-container__android__download">
          <span className="app-rating__android__download">
            ⭐⭐⭐⭐⭐ 
          </span>
          <span className="app-rating-value__android__download">{app.rating}</span><br/><br/>
          <span className="app-version__android__download">• Version {app.version}</span>
        </div>
        <p className="app-downloads__android__download">97,000+ downloads</p>
        <p className="app-updated__android__download">Last updated: {app.lastUpdated}</p>
        <button className="download-btn__android__download" onClick={handleInstallClick}>Download</button>
      </div>
    </div>

    <div className="app-description__android__download">
      <h2>About this app</h2>
      <p>{app.description}</p>
    </div>

    <div className="app-features__android__download">
      <h2>Key Features</h2>
      <ul>
        {app.features.map((feature, index) => (
          <li key={index}>• {feature}</li>
        ))}
      </ul>
    </div>

    <div className="app-testimonials__android__download">
      <h2>User Testimonials</h2>
      <div className="testimonials-container__android__download">
        {app.testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card__android__download">
            <p className="testimonial-feedback__android__download">"{testimonial.feedback}"</p>
            <p className="testimonial-author__android__download"><strong>- {testimonial.name}</strong></p>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>


  );
};

export default DownloadPageAndroid;

