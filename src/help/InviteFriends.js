import React, { useState } from 'react';
import axios from 'axios';
import './InviteFriends.css'; // Import the CSS file
import { API_ROUTES } from '../app_modules/apiRoutes';

const InviteFriends = () => {
    const [message, setMessage] = useState('');

    const handleInvite = async () => {
        const siteURL = 'https://edusify-download.vercel.app'; // Your app's download link
        const inviteText = `
        Hey there! 🌟
        
        I just discovered this amazing app called **Edusify**, and I think you'll love it! It's an innovative study companion that really enhances the learning experience. With Edusify, you can:
        
        - Get instant answers to your questions with the **AI Solver**.
        - Organize your tasks and stay on top of deadlines with the **Task Manager**.
        - Join study groups to collaborate and share resources.
        - Create customizable flashcards and quizzes for effective studying.
        - Keep track of important dates with the integrated calendar.
        - Use the **Pomodoro Timer** to boost your productivity.
        - And so much more!
        
        Join me in making studying more engaging and effective! Check it out here: ${siteURL}
        
        Can't wait to see you on Edusify! 🚀
        `;
    
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('User not authenticated');

            // Send the invite event to the backend to log it
            await axios.post(API_ROUTES.inviteFriendToEdusify, { token });

            if (navigator.share) {
                await navigator.share({
                    title: 'Join me on Edusify!',
                    text: inviteText,
                    url: siteURL,
                });
                setMessage('Invitation shared successfully!');
            } else {
                const shareURL = `whatsapp://send?text=${encodeURIComponent(inviteText)}`;
                window.location.href = shareURL;
                setMessage('Invitation shared via WhatsApp!');
            }
        } catch (error) {
            console.error('Error inviting:', error);
            setMessage('Failed to share the invitation. Please try again.');
        }
    };

    return (
<div className="invite-friends___inv__friends__mkrt">
    <div className="card___inv__friends__mkrt">
        <h2>Invite Friends</h2>
        <p>
            Make studying more fun and productive by inviting your friends to join you on Edusify! 
            Create study groups, share resources, and even test each other with custom quizzes. 
            Click the button below to spread the word and level up your study sessions!
        </p>
        <button className="button___inv__friends__mkrt" onClick={handleInvite}>
            Invite Friends Now
        </button>
        {message && <div className="invite-message___inv__friends__mkrt">{message}</div>}
    </div>
</div>

    );
};

export default InviteFriends;
