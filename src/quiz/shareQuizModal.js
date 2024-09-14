import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCopy, FaShareAlt, FaSearch, FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';
import './shareQuizModal.css'; // Import your CSS file for styling
import { API_ROUTES } from '../app_modules/apiRoutes';


const ShareQuizModal = ({ quiz, onClose }) => {
    const quizId = quiz?.id; // Safeguard against undefined or null
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            const token = localStorage.getItem('token');

            try {
                // Fetch joined groups
                const joinedResponse = await axios.get(API_ROUTES.fetchJoinedGroups, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setJoinedGroups(joinedResponse.data);

                // Fetch user groups
                const userResponse = await axios.get(API_ROUTES.fetchUserGroups, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserGroups(userResponse.data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchGroups();
    }, []);

    const handleCopyLink = () => {
        const link = `${window.location.origin}/quizzes/${quizId}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000); // Reset the tick mark after 2 seconds
            })
            .catch(err => console.error('Error copying link: ', err));
    };

    const handleShareWhatsApp = () => {
        const link = `${window.location.origin}/quizzes/${quizId}`;
        const message = `Check out this quiz: ${link}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleShare = async (groupId) => {
        try {
            await axios.post(API_ROUTES.shareQuiz, { quizId, groupId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            onClose();
        } catch (error) {
            console.error('Error sharing quiz:', error);
        }
    };

    const filteredJoinedGroups = joinedGroups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredUserGroups = userGroups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="group-modal-overlay-share-quiz">
            <div className="group-modal-share-quiz">
                <div className="modal-header-share-quiz">
                    <button className="close-button-share-quiz" onClick={onClose} style={{backgroundColor: 'white', color: 'black'}}>
                        <FaTimes />
                    </button>
                </div>
                <div className="search-bar-share-quiz">
                    <input
                        type="text"
                        placeholder="Search groups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="search-icon-share-quiz" />
                </div>
                <ul>
                    <li><strong>Joined Groups</strong></li>
                    {filteredJoinedGroups.map(group => (
                        <li key={group.id} className="group-item-share-quiz" onClick={() => handleShare(group.id)}>
                            <span>{group.name}</span>
                            <FaArrowRight className="arrow-icon-share-quiz" />
                        </li>
                    ))}
                   
                </ul>
                <div className="quick-share-share-quiz">
                    <button 
                        onClick={handleCopyLink} 
                        className={`share-button-share-quiz ${copySuccess ? 'copied-share-quiz' : ''}`}
                    >
                        {copySuccess ? <FaCheck /> : <FaCopy />}
                    </button>
                    <button onClick={handleShareWhatsApp} className="share-button-share-quiz">
                        <FaShareAlt />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareQuizModal;