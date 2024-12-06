import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './RoomProgress.css'; // Importing CSS file for styles
import { API_ROUTES } from '../../app_modules/apiRoutes';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RoomProgress = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const { roomId } = useParams(); // Get roomId from the URL
  const nav = useNavigate()
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.post(API_ROUTES.roomProgress, { roomId });
        setProgress(response.data);
      } catch (error) {
        console.error('Error fetching room progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [roomId]);

  // Calculate a total progress score for each user by combining their tasks, flashcards, and Pomodoro hours
  const getTotalProgress = (user) => {
    const taskProgress = user.totalTasks > 0 ? user.completedTasks / user.totalTasks : 0; // Prevent division by zero
    const flashcardProgress = user.totalKnownFlashcards > 0 ? user.totalKnownFlashcards / 100 : 0; // Assuming 100 is the maximum number of flashcards
    const pomodoroProgress = user.totalPomodoroHours > 0 ? user.totalPomodoroHours / 100 : 0; // Assuming 100 hours as a progress benchmark
    return (taskProgress + flashcardProgress + pomodoroProgress) / 3; // Averaging the progress
  };

  // Calculate total progress for the room
  const totalProgress = progress.reduce((acc, user) => acc + getTotalProgress(user), 0);

  // Avoid division by zero for total progress
  const totalProgressAdjusted = totalProgress === 0 ? 1 : totalProgress; // Prevent division by zero

  // Calculate the percentage contribution of each user to the total progress
  const chartData = {
    labels: progress.map(user => user.name),
    datasets: [
      {
        label: 'User Contribution (%)',
        data: progress.map(user => {
          const userProgress = getTotalProgress(user);
          return ((userProgress / totalProgressAdjusted) * 100).toFixed(2); // Convert to percentage and prevent NaN
        }),
        borderColor: '#FF5733', // Vibrant orange for better contrast
        backgroundColor: 'rgba(255, 87, 51, 0.2)',
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Room Progress Overview',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  if (loading) {
    return <div className="room__progress__loading">Loading...</div>;
  }

  const handleBackClick = () => {
    nav(-1)
  };


  return (
    <div className="room__progress__room__page">
          <button className="room__progress__back__btn" onClick={handleBackClick}>←</button>

      <div className="room__progress__summary">
        <h3>Room Overview</h3>
        <p>Total Users: {progress.length}</p>
        <p>Total Completed Tasks: {progress.reduce((acc, user) => acc + user.completedTasks, 0)}</p>
        <p>Total Pomodoro Hours: {progress.reduce((acc, user) => acc + user.totalPomodoroHours, 0).toFixed(2)}</p>
      </div>

      <h2 className="room__progress__heading">Room Progress</h2>
      <div className="room__progress__chart__container">
        <Line data={chartData} options={chartOptions} height={400} />
      </div>

      <div className="room__progress__list">
        {progress.map((user) => (
          <div key={user.userId} className="room__progress__user">
            <strong className="room__progress__user__name">{user.name}</strong>
            <div className="room__progress__user__details">
              <p>Total Tasks: {user.totalTasks}</p>
              <p>Completed Tasks: {user.completedTasks}</p>
              <p>Known Flashcards: {user.totalKnownFlashcards}</p>
              <p>Pomodoro Hours: {user.totalPomodoroHours.toFixed(2)}</p>
              <p>Total Progress: {(getTotalProgress(user) * 100).toFixed(2)}%</p>
              <p>Contribution to Total: {((getTotalProgress(user) / totalProgressAdjusted) * 100).toFixed(2)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomProgress;
