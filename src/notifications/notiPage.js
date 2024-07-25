import React from 'react';
import NotificationComponent from './NotificationComponent';

const NotiPage = () => {
  const userId = 1; // Example user ID, ensure this is set correctly

  return (
    <div>
      <h1>Push Notification App</h1>
      <NotificationComponent userId={userId} />
    </div>
  );
};

export default NotiPage;
