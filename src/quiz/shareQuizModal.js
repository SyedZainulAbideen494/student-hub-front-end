import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCopy, FaShareAlt, FaSearch, FaTimes, FaArrowRight, FaCheck } from 'react-icons/fa';
import './shareQuizModal.css'; // Import your CSS file for styling
import { API_ROUTES } from '../app_modules/apiRoutes';

const ShareQuizModal = ({ quiz, onClose }) => {
    const quizId = quiz?.id; // Safeguard against undefined or null
    const [rooms, setRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            const token = localStorage.getItem('token');
            console.log('Token in frontend:', token);  // Log token for debugging
            try {
                const response = await axios.get(API_ROUTES.fetchUserShareRooms, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Response data:', response.data);  // Log rooms data from the backend
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };
        fetchRooms();
    }, []);
    

    const handleCopyLink = () => {
        const link = `${window.location.origin}/quiz/${quizId}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            })
            .catch(err => console.error('Error copying link: ', err));
    };

    const handleShare = async (roomId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(API_ROUTES.shareQuizToRooms, { quizId, roomId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onClose();
        } catch (error) {
            console.error('Error sharing quiz:', error);
        }
    };

    const filteredRooms = rooms.filter(room => room.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleShareWhatsApp = () => {
        const link = `${window.location.origin}/quiz/${quizId}`;
        const message = `Check out this quiz: ${link}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="group-modal-overlay-share-quiz">
            <div className="group-modal-share-quiz">
                <div className="modal-header-share-quiz">
                    <button className="close-button-share-quiz" onClick={onClose} style={{ backgroundColor: 'white', color: 'black' }}>
                        <FaTimes />
                    </button>
                </div>
                <div className="search-bar-share-quiz">
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="search-icon-share-quiz" />
                </div>
                <ul>
                    {filteredRooms.length > 0 ? (
                        filteredRooms.map(room => (
                            <li key={room.room_id} className="group-item-share-quiz" onClick={() => handleShare(room.room_id)}>
                                <span>{room.name}</span>
                                <FaArrowRight className="arrow-icon-share-quiz" />
                            </li>
                        ))
                    ) : (
                        <li>No rooms found</li>
                    )}
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
