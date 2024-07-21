import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCopy, FaShareAlt } from 'react-icons/fa';
import './quiz.css'; // Import your CSS file for styling
import { API_ROUTES } from '../app_modules/apiRoutes';

const ShareQuizModal = ({ quizId, onClose }) => {
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [userGroups, setUserGroups] = useState([]);

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
            .then(() => alert('Link copied to clipboard!'))
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
            alert('Quiz shared successfully!');
            onClose();
        } catch (error) {
            console.error('Error sharing quiz:', error);
        }
    };

    return (
        <div className="group-modal-overlay">
            <div className="group-modal">
                <h2>Select a Group to Share</h2>
                <ul>
                    <li><strong>Joined Groups</strong></li>
                    {joinedGroups.map(group => (
                        <li key={group.id} onClick={() => handleShare(group.id)}>
                            {group.name}
                        </li>
                    ))}
                    <li><strong>Other Groups</strong></li>
                    {userGroups.map(group => (
                        <li key={group.id} onClick={() => handleShare(group.id)}>
                            {group.name}
                        </li>
                    ))}
                </ul>
                <div className="quick-share">
                    <button onClick={handleCopyLink} className="share-button">
                        <FaCopy /> Copy Link
                    </button>
                    <button onClick={handleShareWhatsApp} className="share-button">
                        <FaShareAlt /> Share on WhatsApp
                    </button>
                </div>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ShareQuizModal;