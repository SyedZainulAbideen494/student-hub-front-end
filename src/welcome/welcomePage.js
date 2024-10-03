import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './welcome.css';
import axios from 'axios';
import { subscribeUser } from '../api/api'; // Correctly import subscribeUser
import { urlBase64ToUint8Array } from '../utils/webPushUtils';

const Welcome = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [transition, setTransition] = useState('');
    const [subscription, setSubscription] = useState(null);
    const [permissionGranted, setPermissionGranted] = useState(false);

    // Request notification permission and subscription
    const requestNotificationPermission = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const swRegistration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker Registered:', swRegistration);

                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    setPermissionGranted(true);
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

    // Call requestNotificationPermission when the component mounts
    useEffect(() => {
        // You can choose to call this function based on user interaction as well
    }, []);

    const handleNext = () => {
        if (currentStep < 3) {
            setTransition('hidden');
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
                setTransition('show');
            }, 500);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setTransition('hidden');
            setTimeout(() => {
                setCurrentStep(currentStep - 1);
                setTransition('show');
            }, 500);
        }
    };

    return (
        <div className="welcome-page">
            <div className={`welcome-section ${transition}`}>
                    <div>
                        <header className="welcome-header-welcome-page">
                            <h1>Welcome to Edusify!</h1>
                            <p>Your all-in-one study and organization app.</p>
                        </header>
                        <main className="welcome-content-welcome-page">
                            <Link to='/'>
                            <button className="continue-button-welcome-page" onClick={handleNext}>Next</button>
                            </Link>
                        </main>
                    </div>
            </div>
        </div>
    );
};

export default Welcome;
