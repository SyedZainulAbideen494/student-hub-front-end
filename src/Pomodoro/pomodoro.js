import React, { useState, useEffect, useRef } from 'react';
import './pomodoro.css';
import FooterNav from '../app_modules/footernav';
import { API_ROUTES } from '../app_modules/apiRoutes';
import html2canvas from 'html2canvas';
import edusifyLogo from '../images/Edusify-logo.png'
import { FaClock, FaCoffee, FaClipboardList, FaPause } from 'react-icons/fa'; // Example icons
import templateImageSrc from '../images/Brown Beige Minimalist Vintage Background Instagram Story.png'; // Import your custom template
import pauseIcon from '../images/icons8-pause-50.png'
import coffeeicon from '../images/icons8-coffee-30.png'
import clockIcon from '../images/icons8-clock-30.png'
import clipBoardIocn from '../images/icons8-clipboard-50.png'
import PomodoroPageTutorial from './PomodoroPageTutorial';
// Helper function to format time
const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const Pomodoro = () => {
    const [isWork, setIsWork] = useState(true);
    const [workTime, setWorkTime] = useState(parseInt(localStorage.getItem('workTime')) || 25);
    const [breakTime, setBreakTime] = useState(parseInt(localStorage.getItem('breakTime')) || 5);
    const [time, setTime] = useState(parseInt(localStorage.getItem('time')) || workTime * 60);
    const [isRunning, setIsRunning] = useState(JSON.parse(localStorage.getItem('isRunning')) || false);
    const [showModal, setShowModal] = useState(false);

    // Load statistics from localStorage
    const [totalStudyTime, setTotalStudyTime] = useState(parseInt(localStorage.getItem('totalStudyTime')) || 0);
    const [totalBreakTime, setTotalBreakTime] = useState(parseInt(localStorage.getItem('totalBreakTime')) || 0);
    const [sessionCount, setSessionCount] = useState(parseInt(localStorage.getItem('sessionCount')) || 0);
    const [breakCount, setBreakCount] = useState(parseInt(localStorage.getItem('breakCount')) || 0);
    const [streakDays, setStreakDays] = useState(parseInt(localStorage.getItem('streakDays')) || 0);
    const [longestStreak, setLongestStreak] = useState(parseInt(localStorage.getItem('longestStreak')) || 0);
    const [lastSessionDate, setLastSessionDate] = useState(localStorage.getItem('lastSessionDate'));
    const canvasRef = useRef(null);
    const [showTutorial, setShowTutorial] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const toggleTheme = () => {
      setDarkMode(!darkMode);
    };
    const handleTutorialComplete = () => {
        setShowTutorial(false);
        localStorage.setItem('pomodoroPageTutorialCompleted', 'true'); // Store in local storage
    };

    useEffect(() => {
        const isTutorialCompleted = localStorage.getItem('pomodoroPageTutorialCompleted');
        if (isTutorialCompleted) {
            setShowTutorial(false);
        }
    }, []);

        // Sound effects
        const studyFinishSound = new Audio('https://audio-previews.elements.envatousercontent.com/files/148785970/preview.mp3?response-content-disposition=attachment%3B+filename%3D%22RZFWLXE-bell-hop-bell.mp3%22');
        const breakFinishSound = new Audio('https://audio-previews.elements.envatousercontent.com/files/148785970/preview.mp3?response-content-disposition=attachment%3B+filename%3D%22RZFWLXE-bell-hop-bell.mp3%22');
    

    // Check and update streaks
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        if (lastSessionDate === today) {
            // No update needed if today is the same as lastSessionDate
            return;
        }
        
        if (lastSessionDate) {
            const prevDate = new Date(lastSessionDate);
            const currDate = new Date(today);
            const diffDays = Math.ceil((currDate - prevDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                // Increment streak if user used Pomodoro on consecutive days
                setStreakDays((prevStreak) => prevStreak + 1);
            } else {
                // Reset streak if skipped day
                setStreakDays(0);
            }
            
            // Update longest streak if current streak is the longest
            setLongestStreak((prevLongest) => Math.max(prevLongest, streakDays));
        } else {
            // Initialize streak if no lastSessionDate
            setStreakDays(1);
        }
        
        setLastSessionDate(today);
        localStorage.setItem('lastSessionDate', today);
        localStorage.setItem('streakDays', streakDays);
        localStorage.setItem('longestStreak', longestStreak);
    }, [lastSessionDate, streakDays]);

    useEffect(() => {
        // Save state and statistics to localStorage
        localStorage.setItem('workTime', workTime);
        localStorage.setItem('breakTime', breakTime);
        localStorage.setItem('time', time);
        localStorage.setItem('isRunning', JSON.stringify(isRunning));
        localStorage.setItem('totalStudyTime', totalStudyTime);
        localStorage.setItem('totalBreakTime', totalBreakTime);
        localStorage.setItem('sessionCount', sessionCount);
        localStorage.setItem('breakCount', breakCount);
        localStorage.setItem('streakDays', streakDays);
        localStorage.setItem('longestStreak', longestStreak);
        localStorage.setItem('lastSessionDate', lastSessionDate);
    }, [workTime, breakTime, time, isRunning, totalStudyTime, totalBreakTime, sessionCount, breakCount, streakDays, longestStreak, lastSessionDate]);

    useEffect(() => {
        let timer;
        if (isRunning && time > 0) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
                if (isWork) {
                    setTotalStudyTime((prevTime) => prevTime + 1);
                } else {
                    setTotalBreakTime((prevTime) => prevTime + 1);
                }
            }, 1000);
        } else if (time === 0) {
            setIsRunning(false);
            setShowModal(true);
            
            if (isWork) {
                setSessionCount((prevCount) => prevCount + 1);
                studyFinishSound.play();
            } else {
                breakFinishSound.play();
            }
            
            setBreakCount((prevCount) => prevCount + 1);

            // Switch between work and break
            if (isWork) {
                setIsWork(false);
                setTime(breakTime * 60);
            } else {
                setIsWork(true);
                setTime(workTime * 60);
            }
        }
        return () => clearInterval(timer);
    }, [isRunning, time, isWork, workTime, breakTime]);

    useEffect(() => {
        // Check if the timer was running on mount and adjust time
        const savedTime = parseInt(localStorage.getItem('time'));
        const savedIsRunning = JSON.parse(localStorage.getItem('isRunning'));

        if (savedIsRunning && savedTime > 0) {
            const now = Date.now();
            const timeElapsed = Math.floor((now - parseInt(localStorage.getItem('startTime'))) / 1000);
            setTime(savedTime - timeElapsed);
        }
        setIsRunning(savedIsRunning);
    }, []);

    const handleStartPause = () => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    
        if (!isRunning) {
            // Store start time
            localStorage.setItem('startTime', Date.now());
    
            // Log the start of the Pomodoro session
            fetch(API_ROUTES.apiStartPomodoro, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include token in the headers
                }
            })
            .then(response => {
                if (response.ok) {
                    console.log('Start logged successfully.');
                } else {
                    console.error('Failed to log start.');
                }
            })
            .catch(error => console.error('Error:', error));
        } else {
            // Log the stop of the Pomodoro session
            fetch(API_ROUTES.apiStopPomodoro, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include token in the headers
                }
            })
            .then(response => {
                if (response.ok) {
                    console.log('Stop logged successfully.');
                } else {
                    console.error('Failed to log stop.');
                }
            })
            .catch(error => console.error('Error:', error));
        }
    
        setIsRunning(!isRunning);
    };
    
    const handleReset = () => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    
        // Log the stop of the Pomodoro session when resetting
        fetch(API_ROUTES.apiStopPomodoro, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include token in the headers
            }
        })
        .then(response => {
            if (response.ok) {
                console.log('Stop logged successfully on reset.');
            } else {
                console.error('Failed to log stop on reset.');
            }
        })
        .catch(error => console.error('Error:', error));
    
        // Reset the timer
        setIsRunning(false);
        setTime(isWork ? workTime * 60 : breakTime * 60);
        localStorage.removeItem('startTime'); // Clear start time
    };
    
    

    const handleWorkTimeChange = (e) => {
        const value = Math.max(1, e.target.value);
        setWorkTime(value);
        if (isWork) {
            setTime(value * 60);
        }
    };

    const handleBreakTimeChange = (e) => {
        const value = Math.max(1, e.target.value);
        setBreakTime(value);
        if (!isWork) {
            setTime(value * 60);
        }
    };

    // Motivational quotes based on achievements
    const getMotivationalQuote = () => {
        if (streakDays >= 7) {
            return "Amazing! You've reached a 1-week streak! Keep up the great work!";
        } else if (streakDays >= 3) {
            return `Great job! You've reached a ${streakDays}-day streak!`;
        } else if (streakDays > 0) {
            return `Nice! You've maintained a ${streakDays}-day streak.`;
        } else {
            return "Start a new streak today and stay consistent!";
        }
    };


    const saveAsImage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const templateImage = new Image();
        templateImage.src = templateImageSrc; // Your template image source
    
        templateImage.onload = () => {
            // Set canvas dimensions for story size (1080x1920)
            canvas.width = 1080;
            canvas.height = 1920;
            
            ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#333';
            ctx.font = 'bold 48px Arial'; // Increase font size for better visibility
    
            // Define a left margin for alignment
            const leftMargin = 200; // Adjust this value as needed
    
            // Create an array of icons and their respective labels and data
            const statsData = [
                {
                    iconSrc: clockIcon, // Replace with your actual clock icon path
                    label: 'Total Study Time:',
                    value: formatTime(totalStudyTime),
                    yPosition: 700
                },
                {
                    iconSrc: coffeeicon, // Replace with your actual coffee icon path
                    label: 'Total Break Time:',
                    value: formatTime(totalBreakTime),
                    yPosition: 850 // Adjusted vertical position
                },
                {
                    iconSrc: clipBoardIocn, // Replace with your actual clipboard icon path
                    label: 'Session Count:',
                    value: sessionCount,
                    yPosition: 1000 // Adjusted vertical position
                },
                {
                    iconSrc: pauseIcon, // Replace with your actual pause icon path
                    label: 'Break Count:',
                    value: breakCount,
                    yPosition: 1150 // Adjusted vertical position
                },
            ];
    
            // Load all icons and draw statistics
            const iconPromises = statsData.map((stat) => {
                return new Promise((resolve) => {
                    const iconImage = new Image();
                    iconImage.src = stat.iconSrc;
    
                    iconImage.onload = () => {
                        // Draw the icon and text once it's loaded
                        ctx.drawImage(iconImage, leftMargin, stat.yPosition - 30, 80, 80); // Draw the icon with left margin
                        ctx.fillText(stat.label, leftMargin + 100, stat.yPosition); // Label offset from icon
                        ctx.fillText(stat.value, leftMargin + 500, stat.yPosition); // Value offset from label
                        resolve(); // Resolve the promise once done
                    };
                });
            });
    
            // Once all icons are loaded and drawn, save the canvas as an image
            Promise.all(iconPromises).then(() => {
                const imgData = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = imgData;
                link.download = 'edusify_statistics_story.png'; // Save as story-sized image
                link.click();
            });
        };
    };
    
    

    const handleResetPomodro = () => {
        // Reset work time and break time in state
        setWorkTime(25); // Reset work time to 25 minutes
        setBreakTime(5);  // Reset break time to 5 minutes
      
        // Update the time based on the current mode (work or break)
        if (isWork) {
          setTime(25 * 60); // Set work time to 25 minutes in seconds
        } else {
          setTime(5 * 60); // Set break time to 5 minutes in seconds
        }
      
        // Update the values in localStorage
        localStorage.setItem('workTime', 25);
        localStorage.setItem('breakTime', 5);
        localStorage.setItem('time', isWork ? 25 * 60 : 5 * 60);
      
        // Refresh the page to apply changes
        window.location.reload();
      };
      
      

    return (
        <div className={`pomodoro-container ${darkMode ? 'dark-mode' : ''}`}>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {darkMode ? 'Light Theme' : 'Dark Theme'}
        </button>
  
              {showTutorial && <PomodoroPageTutorial onComplete={handleTutorialComplete} />}
            <h2>{isWork ? 'Study Time' : 'Break Time'}</h2>
            
            <div className="timer">
                {formatTime(time)}
            </div>
            
            <div className="controls-pomodoro">
                <button onClick={handleStartPause} className='theme-toggle-btn'>
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                {isRunning && (
                    <button onClick={handleReset}>
                        Stop
                    </button>
                )}
            </div>
            {!isRunning && (
                <div className="settings-pomodoro">
                    <label>
    Study Time (minutes):
    <div class="input-group">

        <input
            type="number"
            value={workTime}
            onChange={handleWorkTimeChange}
        />

    </div>
</label>
<label>
    Break Time (minutes):
    <div class="input-group">

        <input
            type="number"
            value={breakTime}
            onChange={handleBreakTimeChange}
        />

    </div>
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
  <button 
    onClick={handleResetPomodro}  className='theme-toggle-btn-rest-btn'
  >
    Reset timer
  </button>
</div>

</label>
<div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
  <button 
   className='theme-toggle-btn-rest-btn'
onClick={() => {
    // Clear specific localStorage items
    localStorage.removeItem('workTime');
    localStorage.removeItem('breakTime');
    localStorage.removeItem('time');
    localStorage.removeItem('isRunning');
    localStorage.removeItem('totalStudyTime');
    localStorage.removeItem('totalBreakTime');
    localStorage.removeItem('sessionCount');
    localStorage.removeItem('breakCount');
    localStorage.removeItem('streakDays');
    localStorage.removeItem('longestStreak');
    localStorage.removeItem('lastSessionDate');
    
    
    // Refresh the page
    window.location.reload();
  }}
  

  >
    Reset All Stats
  </button>
</div>

<div className="statistics">
            <h3>Statistics</h3>
            <div className="stat-item">
                <FaClock />
                <span>Total Study Time:</span>
                <span>{formatTime(totalStudyTime)}</span>
            </div>
            <div className="stat-item">
                <FaCoffee />
                <span>Total Break Time:</span>
                <span>{formatTime(totalBreakTime)}</span>
            </div>
            <div className="stat-item">
                <FaClipboardList />
                <span>Session Count:</span>
                <span>{sessionCount}</span>
            </div>
            <div className="stat-item">
                <FaPause />
                <span>Break Count:</span>
                <span>{breakCount}</span>
            </div>
            <div className='container__btn__stats__pomodoro__btn__save'>
    <button className="button__stats__pomodoro__btn__save" onClick={saveAsImage}>
        <svg fill="none" height="24" viewBox="0 0 24 24" width="24" className="svg-icon__stats__pomodoro__btn__save">
            <path
                d="M7 16l5 5 5-5H7zm0-2h10V4H7v10z"
                stroke="#056dfa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
        <span className="label__stats__pomodoro__btn__save">Save & Share</span>
    </button>
</div>


            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
                </div>
            )}
            {showModal && (
                <div className="modal-pomodoro">
                    <div className='modal-content-pomodoro'>
                    <h3>{isWork ? 'Break Over!' : 'Good Job!'}</h3>
                    
                    <button onClick={() => setShowModal(false)}>OK</button>
                    </div>
                </div>
            )}
            <FooterNav />
        </div>
    );
};

export default Pomodoro;