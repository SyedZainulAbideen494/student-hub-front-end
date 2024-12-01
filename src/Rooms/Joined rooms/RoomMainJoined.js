import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_ROUTES } from "../../app_modules/apiRoutes";
import "./RoomMainPageJoined.css";
import FooterNav from "../../app_modules/footernav";

const RoomMainPageJoined = () => {
  const [roomDetails, setRoomDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const token = localStorage.getItem("token");
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.post(API_ROUTES.fetchRoomMembers, {
          token,
          room_id: roomId,
        });

        if (response.data.room) {
          setRoomDetails(response.data.room);
          setMembers(response.data.room.members || []);
        } else {
          alert("Room details not found.");
        }
      } catch (err) {
        console.error("Error fetching room details:", err);
      }
    };

    fetchRoomDetails();
  }, [token, roomId]);

  const handleTabChange = (tab) => {
    if (tab === "activity") {
      navigate(`/room/activity/${roomId}`);
    } else if (tab === "Resources") {
      navigate(`/room/resources/${roomId}`);
    } else if (tab === "Updates") {
      navigate(`/room/updates/${roomId}`);
    }
  };

  const handleInviteClick = () => {
    const inviteUrl = `https://edusify.vercel.app/room/invite/${roomId}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Join this Room",
          text: "Check out this room on Edusify!",
          url: inviteUrl,
        })
        .then(() => console.log("Room link shared"))
        .catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard
        .writeText(inviteUrl)
        .then(() => alert("Invite link copied to clipboard!"))
        .catch((err) => console.error("Error copying text:", err));
    }
  };

  const handleLeaveClick = async () => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post(API_ROUTES.leaveRoom, {
        token,
        room_id: roomId,
      });
  
      if (response.data.success) {
        navigate("/");
      } else {
        alert("Failed to leave the room.");
      }
    } catch (error) {
      console.error("Error leaving the room:", error);
      alert("An error occurred while trying to leave the room. Please try again later.");
    }
  };

  if (!roomDetails) {
    return <p>Loading room details...</p>;
  }

  return (
    <div className="room__members__page__container">
      <div className="room__members__page__tabs">
        <button onClick={() => handleTabChange("activity")}>Activity</button>
        <button onClick={() => handleTabChange("Resources")}>Resources</button>
      </div>

      <div className="room__members__page__members" style={{ marginTop: '30px' }}>
        <h3 style={{ textAlign: 'center' }}>Members</h3>

        <div className="room__members__page__actions">
          <button onClick={handleInviteClick} className="room__members__page__action__btn">
            Invite Member
          </button>
          <button onClick={handleLeaveClick} className="room__members__page__action__btn leave-btn">
            Leave Room
          </button>
        </div>

        <div className="room__members__page__cards-container">
          {members.length > 0 ? (
            <div className="room__members__page__cards">
              {members.map((member, index) => (
                <div key={index} className="room__members__page__member__card">
                  <img
                    src={`${API_ROUTES.displayImg}/${member.avatar}`}
                    alt={member.unique_id}
                    className="room__members__page__member__avatar"
                  />
                  <p className="room__members__page__member__name">{member.unique_id}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No members in this room.</p>
          )}
        </div>
      </div>
      <FooterNav />
    </div>
  );
};

export default RoomMainPageJoined;
