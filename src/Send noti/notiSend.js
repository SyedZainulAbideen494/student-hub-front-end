import React, { useState } from "react";
import { API_ROUTES } from "../app_modules/apiRoutes";

function SendNotiApp() {
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationIcon, setNotificationIcon] = useState("https://edusify.vercel.app/static/media/Edusify-removebg-preview.88731903640917039997.png");

  const sendNotification = async () => {
    const notificationData = {
      title: notificationTitle,
      message: notificationMessage,
      icon: notificationIcon,
    };

    try {
      const response = await fetch(API_ROUTES.sendNoti, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        console.log("Notifications sent successfully");
      } else {
        console.log("Failed to send notifications");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <div>
      <h1>Send Push Notification</h1>
      <div>
        <label>
          Title:
          <input
            type="text"
            value={notificationTitle}
            onChange={(e) => setNotificationTitle(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Message:
          <textarea
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Icon URL:
          <input
            type="text"
            value={notificationIcon}
            onChange={(e) => setNotificationIcon(e.target.value)}
          />
        </label>
      </div>
      <button onClick={sendNotification}>Send Notification</button>
    </div>
  );
}

export default SendNotiApp;
