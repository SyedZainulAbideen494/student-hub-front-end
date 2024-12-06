import React, { useRef, useState, useEffect } from 'react';
import './InstaStory.css'; // Import the CSS file
import downloadImg from './images/Your Edusify Journey.png'; // Import the image
import { faClock, faCheckCircle, faBook, faStopwatch, faCalendarDay, faTrophy } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import axios from 'axios'; // For making API requests
import { API_ROUTES } from '../app_modules/apiRoutes';

const InstaStory = () => {
  const canvasRef = useRef(null);
  const [data, setData] = useState({
    hoursStudied: 10,
    tasksCompleted: 5,
    flashcardsMastered: 20,
    pomodoroSessions: 15,
    percentage: 75,
    leaderboardPosition: 12,
    totalPomodoroDuration: 0, // Add this to store the total Pomodoro duration
  });
  
  const [imageUrl, setImageUrl] = useState(null); // State for storing image URL for preview
  const [showModal, setShowModal] = useState(false); // State to toggle modal visibility
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State to show success modal

  useEffect(() => {
    // Fetch stats when the component mounts
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token'); // Assume you store the token in localStorage
        const response = await axios.get(API_ROUTES.getShareStats, { params: { token } });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    
    fetchStats();
  }, []);

  // Generate the image preview
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    const backgroundImage = new Image();
    backgroundImage.src = downloadImg;
  
    backgroundImage.onload = () => {
      // Set canvas dimensions for story size (1080x1920)
      canvas.width = 1080;
      canvas.height = 1920;
  
      // Draw background image on the canvas
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  
      // Set font styles for stats
      ctx.fillStyle = '#FFFFFF'; // White text color
      ctx.font = 'bold 36px Arial'; // Font style
  
      // Stats array with titles, values, and Font Awesome icons (Unicode)
      const stats = [
        { title: 'Hours Studied', value: data.totalPomodoroDuration.toFixed(2) || 0, icon: '\uf017' }, // faClock
        { title: 'Tasks Completed', value: data.tasksCompleted || 0, icon: '\uf00c' }, // faCheckCircle
        { title: 'Flashcards Mastered', value: data.flashcardsMastered || 0, icon: '\uf02d' }, // faBook
        { title: 'Pomodoro Sessions', value: data.pomodoroSessions || 0, icon: '\uf0e0' }, // faStopwatch
        { title: 'Pomodoro Duration (hours)', value: data.totalPomodoroDuration.toFixed(2) || 0, icon: '\uf017' }, // Total Pomodoro Duration
      ];
  
      let yOffset = 1250; // Starting Y position for stats
  
      // Loop through stats and draw them on the canvas
      stats.forEach((stat) => {
        // Draw icon and title (using icon Unicode)
        ctx.font = 'bold 36px FontAwesome';
        ctx.fillText(`${stat.icon} ${stat.title}:`, 50, yOffset);
  
        // Draw value (right-aligned)
        ctx.font = 'bold 40px Arial';
        ctx.fillText(stat.value.toString(), canvas.width - 200, yOffset);
  
        // Update the Y offset for the next stat
        yOffset += 100;
      });
  
      // Adjust the Y position for the leaderboard message (move further down)
      yOffset = 1800; // Set to a lower position (near the bottom of the canvas)
  
      // Draw summary at the bottom
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
  
      // Update the message to reflect leaderboard position
      const message = `🔥 Ranked #${data.leaderboardPosition || 'N/A'} on Edusify!`;
  
      // Add some text effects for a cool look
      ctx.shadowColor = '#ff6f61'; // Red shadow for the text
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#f2f2f2'; // Light grey color for text
      ctx.fillText(message, canvas.width / 2, yOffset);
  
      // Convert canvas to image URL
      const imgData = canvas.toDataURL('image/png');
      setImageUrl(imgData); // Set the image URL in state
    };
  }, [data]); // This effect runs whenever `data` is updated

  const downloadPNG = () => {
    const link = document.createElement('a');
    const currentTime = new Date().toISOString().replace(/[:.]/g, '-'); // Get the current time in ISO format and replace colons and periods
    const fileName = `edusify_statistics_${currentTime}.png`; // Add current time to the file name

    link.href = imageUrl; // Use the generated image URL
    link.download = fileName; // Use the new file name with the current time
    link.click();
    setShowModal(false)

  };

  // Simulate Instagram opening and download on Story button click
  const handleStoryClick = () => {
    // Download the image
    downloadPNG();
    setShowSuccessModal(true); // Show the success modal after download
    setShowModal(false)
  };
  

  return (
    <div  className="stats__share__page-container_global">
<div id="stats__share__page" className="stats__share__page-container">
  <div className="stats__share__page-header">
    <button className="stats__share__page-back-btn" onClick={() => window.history.back()}>
      <i className="fas fa-arrow-left"></i>
    </button>
    <h1 className="stats__share__page-title"></h1>
  </div>

  {/* Image Preview */}
  {imageUrl && (
    <div className="stats__share__page-preview">
      <img src={imageUrl} alt="Stats Preview" className="stats__share__page-preview-image" />
    </div>
  )}



  {/* Share Button */}
  <div className="stats__share__page-share-btn">
        <button className="stats__share__page-share-button" onClick={() => setShowModal(true)}>
          Share
        </button>
      </div>
      {showModal && (
        <div className="stats__shareStatsModal">
           <button className="stats__shareStatsModal-close" onClick={() => setShowModal(false)}>x</button>
          <div className="stats__shareStatsModal-content">
            <div className="stats__shareStatsModal-option" onClick={handleStoryClick}>
              <i className="fab fa-instagram stats__shareStatsModal-icon"></i>
              <p className="stats__shareStatsModal-text">Story</p>
            </div>
            <div className="stats__shareStatsModal-option" onClick={downloadPNG}>
              <i className="fas fa-download stats__shareStatsModal-icon"></i>
              <p className="stats__shareStatsModal-text">Download</p>
            </div>
          </div>
         
        </div>
      )}

{showSuccessModal && (
  <div className="stats__share__Insta__modal">
  <div className="stats__share__Insta__modal-content">
    <button className="stats__share__Insta__modal-close" onClick={() => setShowSuccessModal(false)}>
      &times; {/* This is the close symbol */}
    </button>
    <p className="stats__share__Insta__modal-text">Your image has been downloaded!</p>
    <p className="stats__share__Insta__modal-text">Please open Instagram to upload your story.</p>
    <button className="stats__share__Insta__modal-button" onClick={() => window.open('https://www.instagram.com')}>
      Open Instagram
    </button>
  </div>
</div>

)}

  {/* Canvas for Image Generation (hidden) */}
  <canvas ref={canvasRef} style={{ display: 'none' }} />
</div>
</div>

  );
};

export default InstaStory;
