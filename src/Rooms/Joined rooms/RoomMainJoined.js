import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { API_ROUTES } from "../../app_modules/apiRoutes";
import "./RoomMainPageJoined.css";
import FooterNav from "../../app_modules/footernav";

const RoomMainPageJoined = () => {
  const [roomDetails, setRoomDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const token = localStorage.getItem("token");
  const { roomId } = useParams(); // Use `useParams` to get `roomId` from URL
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.post(API_ROUTES.fetchRoomMembers, {
          token,
          room_id: roomId, // Pass `roomId` to the API
        });

        if (response.data.room) {
          setRoomDetails(response.data.room);
          setMembers(response.data.room.members || []); // Fetch members from room object
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
      navigate(`/room/activity/${roomId}`); // Navigate to leaderboard
    } else if (tab === "Resources") {
      navigate(`/room/resources/${roomId}`); // Navigate to resources
    } else if (tab === "Updates") {
      navigate(`/room/updates/${roomId}`); // Navigate to updates
    }
  };

  const handleInviteClick = () => {
    const inviteUrl = `https://edusify.vercel.app/room/invite/${roomId}`;

    // Check if Web Share API is supported (for mobile sharing)
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
      // Fallback to copying the link to the clipboard if Web Share API is not available
      navigator.clipboard
        .writeText(inviteUrl)
        .then(() => alert("Invite link copied to clipboard!"))
        .catch((err) => console.error("Error copying text:", err));
    }
  };

  if (!roomDetails) {
    return <p>Loading room details...</p>;
  }

  return (
    <div className="room__members__page__container">
      {/* Tabs for Navigation */}
      <div className="room__members__page__tabs">
        <button onClick={() => handleTabChange("activity")}>Activity</button>
        <button onClick={() => handleTabChange("Resources")}>Resources</button>
      </div>

      {/* Members Section */}
      <div className="room__members__page__members" style={{ marginTop: '30px' }}>
        <h3 style={{ textAlign: 'center' }}>Members</h3>

        {/* Invite Button */}
        <div className="room__members__page__invite">
          <button onClick={handleInviteClick}>Invite Member</button>
        </div>

        {/* Members List */}
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
      <FooterNav/>
    </div>
  );
};

export default RoomMainPageJoined;
