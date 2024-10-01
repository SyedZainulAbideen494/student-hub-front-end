import React, { useState } from 'react';
import './InviteFriends.css'; // Import the CSS file

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
    
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join me on Edusify!',
                    text: inviteText,
                    url: siteURL,
                });
                setMessage('Invitation shared successfully!');
            } catch (error) {
                console.error('Error sharing:', error);
                setMessage('Failed to share the invitation. Please try again.');
            }
        } else {
            const shareURL = `whatsapp://send?text=${encodeURIComponent(inviteText)}`;
            window.location.href = shareURL;
            setMessage('Invitation shared via WhatsApp!');
        }
    };
    

    return (
        <div className="invite-friends___inv__friends__mkrt">
            <div className="card___inv__friends__mkrt">
                <h2>Invite Your Friends!</h2>
                <p>Click the button below to share the app link.</p>
                <button className="button___inv__friends__mkrt" onClick={handleInvite}>
                     Invite friends
                </button>
                {message && <div className="invite-message___inv__friends__mkrt">{message}</div>}
            </div>
        </div>
    );
};

export default InviteFriends;
