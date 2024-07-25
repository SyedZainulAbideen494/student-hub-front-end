import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationComponent = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (!userId) {
      console.error('No userId provided');
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/notifications/${userId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };
    fetchNotifications();

    const websocket = new WebSocket(`ws://localhost:8081/${userId}`);
    websocket.onopen = () => {
      console.log('WebSocket connection established');
    };
    websocket.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prev) => [...prev, newNotification]);
    };
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [userId]);

  const sendNotification = async () => {
    try {
      await axios.post('http://localhost:8080/send-notification', { userId, message });
      setMessage('');
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  };

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{notif.message}</li>
        ))}
      </ul>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <button onClick={sendNotification}>Send Notification</button>
    </div>
  );
};

export default NotificationComponent;