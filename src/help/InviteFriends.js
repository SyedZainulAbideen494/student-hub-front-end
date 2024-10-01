import React, { useState } from 'react';
import './InviteFriends.css'; // Import the CSS file

const InviteFriends = () => {
    const [message, setMessage] = useState('');

    const handleInvite = async () => {
        const siteURL = 'https://edusify-download.vercel.app'; // Your app's download link
        const inviteText = `Check out the EduIsfy app! Join us at ${siteURL}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Invite to EduIsfy',
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
