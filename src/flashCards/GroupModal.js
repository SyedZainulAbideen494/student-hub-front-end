import React, { useState } from 'react';
import { FaCopy, FaShareAlt, FaSearch, FaTimes, FaCheck, FaArrowRight } from 'react-icons/fa';
import './GroupModal.css'; // Import your CSS file for styling

const GroupModal = ({ groups, onClose, onShare, flashcardId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    // Function to handle copying link to clipboard
    const handleCopyLink = () => {
        if (!flashcardId) {
            console.error('Flashcard ID is undefined.');
            return;
        }
    
        const link = `${window.location.origin}/note/view/${flashcardId}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000); // Reset the tick mark after 2 seconds
            })
            .catch(err => console.error('Error copying link: ', err));
    };
    
    const handleShareWhatsApp = () => {
        if (!flashcardId) {
            console.error('Flashcard ID is undefined.');
            return;
        }
    
        const link = `${window.location.origin}/note/view/${flashcardId}`;
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

    const filteredGroups = groups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="group-modal-overlay-share-flashcard">
            <div className="group-modal-share-flashcard">
                <div className="modal-header-share-flashcard">
                    <button className="close-button-share-flashcard" onClick={onClose} style={{backgroundColor: 'white', color: 'black'}}>
                        <FaTimes />
                    </button>
                </div>
                <div className="search-bar-share-flashcard">
                    <input
                        type="text"
                        placeholder="Search groups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="search-icon-share-flashcard" />
                </div>
                <ul>
                    {filteredGroups.map(group => (
                        <li key={group.id}>
                            {group.name}
                            <button onClick={() => onShare(group.id)}><FaArrowRight/></button>
                        </li>
                    ))}
                </ul>
                <div className="quick-share-share-flashcard">
                    <button 
                        onClick={handleCopyLink} 
                        className={`share-button-share-flashcard ${copySuccess ? 'copied-share-flashcard' : ''}`}
                    >
                        {copySuccess ? <FaCheck /> : <FaCopy />}
                    </button>
                    <button onClick={handleShare} className="share-button-share-flashcard">
                        <FaShareAlt />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupModal;