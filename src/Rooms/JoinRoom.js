import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./JoinRoom.css"; // External CSS file for styling
import { API_ROUTES } from "../app_modules/apiRoutes";

const JoinRoom = () => {
  const { roomId } = useParams(); // Extract roomId from URL.
  const [status, setStatus] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const nav = useNavigate();
  const token = localStorage.getItem('token');
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      console.log('Token from local storage:', token); // Debugging

      // If no token, redirect to login
      if (!token) {
        console.log('No token found, redirecting to sign-up.');
        nav('/sign-up');
        return;
      }

      try {
        const response = await axios.post(API_ROUTES.userSessionAut, { token });
        console.log('Token validation response:', response.data); // Debugging
        if (!response.data.valid) {
          console.log('Invalid token, redirecting to sign-up.');
          nav('/sign-up');
        }
      } catch (error) {
        console.error('Error during token validation:', error);
        nav('/sign-up');
      }
    };

    // Delay the validation by 5 seconds
    const timeoutId = setTimeout(() => {
      validateToken();
    }, 500);

    // Cleanup timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, [nav]);

  // Check if the user is already in a room when the component loads
  useEffect(() => {
    const checkMembership = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(API_ROUTES.checkIfUserAlreadyInRoom, {
          token,
        });
        
        if (response.data.isInRoom) {
          setIsInRoom(true); // User is already in a room
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkMembership();
  }, []);

  const joinRoom = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(API_ROUTES.joinRoom, {
        token,
        roomId,
      });
      setStatus("Successfully joined the room!");
      setIsInRoom(true); // User is now a member
      // After joining, navigate to the room members page
      nav(`/room/members/${roomId}`);
    } catch (err) {
      console.error(err);
      setStatus("Failed to join the room.");
    }
  };

  return (
    <div className="__join__room_page__container">
      <div className="__join__room_page__content">
        <h1 className="__join__room_page__heading">Welcome to the Room</h1>
        <p className="__join__room_page__roomId">Room ID: {roomId}</p>
        {isInRoom ? (
          <p className="__join__room_page__status">You are already in a room.</p>
        ) : (
          <button className="__join__room_page__button" onClick={joinRoom}>
            Join Room
          </button>
        )}
        <p className="__join__room_page__status">{status}</p>
      </div>
    </div>
  );
};

export default JoinRoom;
