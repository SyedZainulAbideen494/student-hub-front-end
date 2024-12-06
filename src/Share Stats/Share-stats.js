import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import './InstaStory.css'; // Importing the CSS file

// Import Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheckCircle, faBrain, faChartLine, faMedal } from '@fortawesome/free-solid-svg-icons';

const InstaStory = () => {
  const [data, setData] = useState({
    hoursStudied: 10,
    tasksCompleted: 5,
    flashcardsMastered: 20,
    pomodoroSessions: 15,
    topDay: "Monday",
    percentage: 75,
  });

  const [containerHeight, setContainerHeight] = useState('auto');
  const [imageDownloaded, setImageDownloaded] = useState(false); // To prevent multiple downloads

  // Function to download the image
  const downloadImage = () => {
    if (imageDownloaded) return; // Prevent multiple downloads

    const storyElement = document.getElementById("instaStory");

    html2canvas(storyElement).then((canvas) => {
      const imageUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "insta_story.png";
      link.click();

      // Set flag to true after image download
      setImageDownloaded(true);
    });
  };

  // Adjust height based on screen size
  useEffect(() => {
    const updateContainerHeight = () => {
      const screenHeight = window.innerHeight;
      if (screenHeight < 600) {
        setContainerHeight('50vh');
      } else {
        setContainerHeight('60vh');
      }
    };

    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);

    return () => {
      window.removeEventListener('resize', updateContainerHeight);
    };
  }, []);

  return (
    <div>
      <div
        id="instaStory"
        className="insta-story-container"
        style={{ height: containerHeight }}
      >

        <div className="insta-story-stats">
          <p><FontAwesomeIcon icon={faClock} /> {data.hoursStudied} Hours Studied</p>
          <p><FontAwesomeIcon icon={faCheckCircle} /> {data.tasksCompleted} Tasks Completed</p>
          <p><FontAwesomeIcon icon={faBrain} /> {data.flashcardsMastered} Flashcards Mastered</p>
          <p><FontAwesomeIcon icon={faChartLine} /> {data.pomodoroSessions} Pomodoro Sessions</p>
          <p><FontAwesomeIcon icon={faMedal} /> Top Day: {data.topDay}</p>
          <p style={{ fontSize: '18px', marginTop: '20px' }}>
            You're ahead of {data.percentage}% of Edusify users!
          </p>
        </div>
      </div>
      
      {/* Uncomment button to enable image download */}
      {/* <button onClick={downloadImage} className="insta-story-button">
        Download Image
      </button> */}
    </div>
  );
};

export default InstaStory;
