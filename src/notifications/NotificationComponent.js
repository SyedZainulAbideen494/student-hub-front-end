import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { subscribeUser } from '../api/api'; // Correctly import subscribeUser
import { urlBase64ToUint8Array } from '../utils/webPushUtils';

const NotificationComponent = () => {
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
      const registerServiceWorker = async () => {
        if ('serviceWorker' in navigator) {
          try {
            const swRegistration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('Service Worker Registered:', swRegistration);
  
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
              const subscription = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('BB0t-WTOpYNRM6b24mcvZKliaHnYK0umXovnqouKrFpSD8Zeq07V9N_z1jTwhenXBJ-Rlf_UxplpYculchlM3ug'),
              });
              console.log('Push Subscription:', subscription);
              setSubscription(subscription);
              await subscribeUser(subscription);
            } else {
              console.warn('Notification permission denied');
            }
          } catch (error) {
            console.error('Error registering service worker or subscribing:', error);
          }
        }
      };
  
      registerServiceWorker();
    }, []);
  
    return <div>Notification setup complete!</div>;
  };

export default NotificationComponent;