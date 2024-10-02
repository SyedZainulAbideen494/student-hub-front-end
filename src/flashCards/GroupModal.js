import React, { useState } from 'react';
import { FaCopy, FaShareAlt, FaSearch, FaTimes } from 'react-icons/fa';
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
        const siteURL = `https://edusify.vercel.app/note/view/${flashcardId}`; // URL of your flashcard

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
                    <button className="close-button-share-flashcard" onClick={onClose} style={{ backgroundColor: 'white', color: 'black' }}>
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
                    {filteredGroups.length > 0 ? (
                        filteredGroups.map(group => (
                            <li key={group.id}>
                                {group.name}
                                <button className="button__share__btn__flashcard" onClick={() => onShare(group.id)}>
                                    <svg className="svgIcon__share__btn__flashcard" viewBox="0 0 384 512">
                                        <path
                                            d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
                                        ></path>
                                    </svg>
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="no-groups-message">
                            {searchTerm ? "No groups joined matching your search." : "You haven't joined any groups."}
                        </li>
                    )}
                </ul>
                <div className="quick-share-share-flashcard">
                    <button className="Btn" onClick={handleCopyLink}>
                        <span className="text">Copy</span>
                        <span className="svgIcon">
                            <svg fill="white" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path>
                            </svg>
                        </span>
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
