import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateRoom from "./CreateRoom";
import { API_ROUTES } from "../app_modules/apiRoutes";

const MainPageRooms = () => {
  const [token] = useState(localStorage.getItem("token")); // Assume token is stored in localStorage.
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    if (!token) {
      console.error("Token not found in localStorage");
      return; // No token, do not proceed with the check
    }

    const checkUserRoom = async () => {
      try {
        const response = await axios.post(API_ROUTES.checkUserRoom, {
          token,
        });

        if (response.data.roomId) {
          const roomId = response.data.roomId;
          navigate(`/room/members/${roomId}`); // Redirect to /room/members/:roomId
        }
      } catch (err) {
        console.error("Error checking room:", err);
      }
    };

    checkUserRoom();
  }, [token, navigate]);

  return <CreateRoom />;
};

export default MainPageRooms;
