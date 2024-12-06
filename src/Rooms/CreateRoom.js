import React, { useState } from "react";
import axios from "axios";
import "./CreateRoom.css"; // External CSS file
import FooterNav from "../app_modules/footernav";
import { API_ROUTES } from "../app_modules/apiRoutes";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [token] = useState(localStorage.getItem("token")); // Assume token is stored in localStorage.
  const [inviteLink, setInviteLink] = useState(""); // Store the invite link (optional)

  const createRoom = async () => {
    if (!roomName.trim()) {
      alert("Room name cannot be empty!");
      return; // Prevent the API call if the room name is empty
    }
  
    try {
      // Set the invite permission to 'admin' by default
      const response = await axios.post(API_ROUTES.createRoom, {
        token,
        roomName,
        invitePermission: "admin", // Default to 'admin'
      });
      window.location.reload(); // Refresh the page after room is created
    } catch (err) {
      console.error(err);
      alert("Error creating room.");
    }
  };
  

  return (
    <div className="__room__create_page__container">
      <div className="__room__create_page__step1">
        <h2 className="__room__create_page__heading">Create Your Study Room</h2>
        <p className="__room__create_page__description">
        Get your study group together and start collaborating now!
        </p>
        <input
          className="__room__create_page__input"
          type="text"
          placeholder="Enter Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
        <button
          className="__room__create_page__button"
          onClick={createRoom}
        >
          Create Room
        </button>
        {inviteLink && (
          <div>
            {/* Display invite link here */}
          </div>
        )}
      </div>
      <FooterNav />
    </div>
  );
};

export default CreateRoom;
