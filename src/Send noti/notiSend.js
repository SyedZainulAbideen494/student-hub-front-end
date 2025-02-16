import React, { useState } from "react";
import { API_ROUTES } from "../app_modules/apiRoutes";

const SendNotificationPage = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");

  const sendNotification = async () => {
    try {
      const response = await fetch(API_ROUTES.sendNotification, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, image }),
      });

      const data = await response.json();
      console.log("✅ Notification Sent:", data);
    } catch (error) {
      console.error("❌ Error sending notification:", error);
    }
  };

  return (
    <div>
      <h1>Send Push Notification</h1>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
      <input type="text" placeholder="Image URL (optional)" value={image} onChange={(e) => setImage(e.target.value)} />
      <button onClick={sendNotification}>Send Notification</button>
    </div>
  );
};

export default SendNotificationPage;
