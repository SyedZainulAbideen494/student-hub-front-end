import React from 'react';
import { FaCopy, FaShareAlt } from 'react-icons/fa';
import './GroupModal.css'; // Import your CSS file for styling

const GroupModal = ({ groups, onClose, onShare, flashcardId }) => {
    // Function to handle copying link to clipboard
    const handleCopyLink = () => {
        const link = `${window.location.origin}/flashcards/${flashcardId}`;
        navigator.clipboard.writeText(link)
            .then(() => alert('Link copied to clipboard!'))
            .catch(err => console.error('Error copying link: ', err));
    };

    // Function to handle sharing via WhatsApp
    const handleShareWhatsApp = () => {
        const link = `${window.location.origin}/flashcards/${flashcardId}`;
        const message = `Check out this flashcard: ${link}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleShare = async () => {
        const siteURL = `https://student-hub-front-end.vercel.app/${flashcardId}`; // URL of your flashcard

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My FlashCard',
                    text: 'My FlashCard from studenthub',
                    url: siteURL
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            const shareText = 'My FlashCard from studenthub';
            const shareURL = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
            window.location.href = shareURL;
        }
    };

    return (
        <div className="group-modal-overlay">
            <div className="group-modal">
                <h2>Select a Group to Share</h2>
                <ul>
                    {groups.map(group => (
                        <li key={group.id} onClick={() => onShare(group.id)}>
                            {group.name}
                        </li>
                    ))}
                </ul>
                <div className="quick-share">
                    <button onClick={handleCopyLink}>
                        <FaCopy />  
                    </button>
                    <button onClick={handleShare}>
                        <FaShareAlt /> 
                    </button>
                </div>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default GroupModal;