import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./JoinRoom.css";
import { API_ROUTES } from "../app_modules/apiRoutes";

const JoinRoom = () => {
  const { roomId } = useParams();
  const [status, setStatus] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        nav("/sign-up");
        return;
      }
      try {
        const response = await axios.post(API_ROUTES.userSessionAut, { token });
        if (!response.data.valid) {
          nav("/sign-up");
        }
      } catch (error) {
        console.error("Error during token validation:", error);
        nav("/sign-up");
      }
    };

    const timeoutId = setTimeout(validateToken, 500);
    return () => clearTimeout(timeoutId);
  }, [nav, token]);

  useEffect(() => {
    const checkMembership = async () => {
      try {
        const response = await axios.post(API_ROUTES.checkIfUserAlreadyInRoom, {
          token,
        });
        if (response.data.isInRoom) {
          setIsInRoom(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkMembership();
  }, [token]);

  useEffect(() => {
    const detectPWA = () => {
      // Check if the app is installed as a PWA
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isAppInstalled = navigator.standalone || isStandalone;
      if (!isAppInstalled) {
        setShowDownloadButton(true);
      }
    };

    detectPWA();
  }, []);

  const joinRoom = async () => {
    try {
      await axios.post(API_ROUTES.joinRoom, {
        token,
        roomId,
      });
      setStatus("Successfully joined the room!");
      setIsInRoom(true);
      nav(`/room/members/${roomId}`);
    } catch (err) {
      console.error(err);
      setStatus("Failed to join the room.");
    }
  };

  const handleDownloadClick = () => {
    // Navigate to the app store or provide installation instructions
    window.location.href = "https://edusify-download.vercel.app/get-app"; // Replace with actual link
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
        {showDownloadButton && (
          <button
            className="__join__room_page__button __join__room_page__download_button"
            onClick={handleDownloadClick}
          >
            Download Edusify
          </button>
        )}
      </div>
    </div>
  );
};

export default JoinRoom;
