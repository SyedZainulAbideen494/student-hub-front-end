import React, { useState } from "react";
import axios from "axios";
import "./CreateRoom.css"; // External CSS file
import FooterNav from "../app_modules/footernav";
import { API_ROUTES } from "../app_modules/apiRoutes";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [token] = useState(localStorage.getItem("token")); // Assume token is stored in localStorage.
  const [inviteLink, setInviteLink] = useState(""); // Store the invite link (optional)
  const [showModal, setShowModal] = useState(false);

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
  const openModal = () => setShowModal(true); // Function to open the modal
  const closeModal = () => setShowModal(false); // Function to close the modal


  return (
    <div className="__room__create_page__container">
      <div className="__room__create_page__step1">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
  <h2 className="__room__create_page__heading" style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>
    Create Your Study Room
  </h2>
  
  <button 
    className="__room__header__create__room__help"
    onClick={openModal}

  >
    ?
  </button>
</div>

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
        {showModal && (
  <div className="__room__Modal__instruc">
    <div className="__room__Modal__instruc__content">
      {/* Close Button (X) */}
      <button className="__room__Modal__instruc__close__x" onClick={closeModal}>
        &times;
      </button>
      <h3 className="__room__Modal__instruc__title">Room Instructions</h3>

      <p className="__room__Modal__instruc__description">
        Welcome to the Study Rooms in Edusify! Here's how they work:
        <br /><br />
        
        <strong>Instructions</strong>:
        - Rooms are private spaces where you and your friends can collaborate on study tasks.
        - One person creates a room and invites others to join. You can only join rooms created by friends.
        - You can add tasks, track progress, and share study resources. The group can see everyone’s activity and contributions.
        - <strong>Important:</strong> You can only be in one room at a time, and there are no public rooms yet—only invite-only rooms.
        <br /><br />

        <strong>Features:</strong>
        <ul>
          <li><strong>Group Tasks:</strong> Add tasks for the entire group to complete. Everyone can mark tasks as completed.</li>
          <li><strong>Progress Tracker:</strong> Track how much each person contributes, with visual progress graphs for each member.</li>
          <li><strong>Activity Feed:</strong> See what your friends are up to, like quiz scores, task completions, and Pomodoro session details.</li>
          <li><strong>Resources Page:</strong> Share notes, quizzes, and other study materials with your friends in the room.</li>
          <li><strong>Leaderboard:</strong> View who has the highest points in the room based on completed tasks and quiz results.</li>
          <li><strong>Posts Section:</strong> Post images, achievements, updates, and more to keep the group engaged.</li>
        </ul>
        <br />

        <strong>Rules</strong>:
        <ul>
          <li>No public rooms available—rooms are only for invited friends.</li>
          <li>Each user can only be in one room at a time, so choose your group wisely!</li>
          <li>If you don't have any friends to invite, well... we can't help with that just yet! It's a "friends-only" system for now.</li>
        </ul>
      </p>

      <button className="__room__Modal__instruc__close" onClick={closeModal}>
        Close
      </button>
    </div>
  </div>
)}

      </div>
      <FooterNav />
    </div>
  );
};

export default CreateRoom;
