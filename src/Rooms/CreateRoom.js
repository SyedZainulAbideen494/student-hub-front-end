import React, { useState } from "react";
import axios from "axios";
import "./CreateRoom.css"; // External CSS file
import FooterNav from "../app_modules/footernav";
import { API_ROUTES } from "../app_modules/apiRoutes";

const CreateRoom = () => {
  const [step, setStep] = useState(1);
  const [roomName, setRoomName] = useState("");
  const [invitePermission, setInvitePermission] = useState("admin");
  const [inviteLink, setInviteLink] = useState("");
  const [token] = useState(localStorage.getItem("token")); // Assume token is stored in localStorage.

  const createRoom = async () => {
    try {
      const response = await axios.post(API_ROUTES.createRoom, {
        token,
        roomName,
        invitePermission,
      });
      setInviteLink(response.data.inviteLink);
      setStep(3); // Go to invite modal step
    } catch (err) {
      console.error(err);
    }
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <div className="__room__create_page__step1">
          <h2 className="__room__create_page__heading">Create Room</h2>
          <input
            className="__room__create_page__input"
            type="text"
            placeholder="Enter Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button
            className="__room__create_page__button"
            onClick={() => setStep(2)}
          >
            Next
          </button>
        </div>
      );
    } else if (step === 2) {
      return (
        <div className="__room__create_page__step2">
          <h2 className="__room__create_page__heading">Invite Permissions</h2>
          <select
            className="__room__create_page__select"
            value={invitePermission}
            onChange={(e) => setInvitePermission(e.target.value)}
          >
            <option value="admin">Admin Only</option>
            <option value="moderator">Moderator and Admin</option>
            <option value="anyone">Anyone</option>
          </select>
          <button
            className="__room__create_page__button"
            onClick={createRoom}
          >
            Create Room
          </button>
        </div>
      );
    } else if (step === 3) {
      return (
        <div className="__room__create_page__step3">
          <h2 className="__room__create_page__heading">Room Created!</h2>
          <p className="__room__create_page__text">Invite people to your room:</p>
          <button
            className="__room__create_page__button"
            onClick={() => navigator.clipboard.writeText(inviteLink)}
          >
            Copy Invite Link
          </button>
          <div className="__room__create_page__link">
            <a
              href={inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="__room__create_page__invite-link"
            >
              Open Invite Link
            </a>
          </div>
          <button
  className="__room__create_page__later-btn"
  onClick={() => {
    setStep(1); // Reset the step to the first step
    window.location.reload(); // Refresh the page
  }}
>
  Later
</button>

        </div>
      );
    }
  };

  return<div>
    <div className="__room__create_page__container">{renderStep()}</div>
    <FooterNav/>
    </div> ;
};

export default CreateRoom;
