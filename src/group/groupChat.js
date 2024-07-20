import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './GroupChat.css'; // Import CSS file for styling
import { API_ROUTES } from '../app_modules/apiRoutes';

const GroupChat = () => {
    const { id } = useParams();
    const nav = useNavigate();
    const [groupDetails, setGroupDetails] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [flashcardDetailsMap, setFlashcardDetailsMap] = useState({});
    const [userNameMap, setUserNameMap] = useState({});

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await axios.get(`${API_ROUTES.getGroupDetailsById}/${id}`);
                setGroupDetails(response.data);
                setMessages(response.data.messages);

                const flashcardIds = response.data.messages
                    .filter(message => message.type === 'flashcard')
                    .map(message => message.content);

                const flashcardDetails = await Promise.all(
                    flashcardIds.map(flashcardId =>
                        axios.get(`${API_ROUTES.getNote}/${flashcardId}`).then(res => ({
                            id: flashcardId,
                            details: res.data
                        }))
                    )
                );

                const flashcardDetailsMap = flashcardDetails.reduce((acc, { id, details }) => {
                    acc[id] = details;
                    return acc;
                }, {});

                setFlashcardDetailsMap(flashcardDetailsMap);

                const userIds = response.data.messages
                    .map(message => message.sender);

                const uniqueUserIds = [...new Set(userIds)];

                const userNames = await Promise.all(
                    uniqueUserIds.map(userId => {
                        const token = localStorage.getItem('token');
                        return axios.get(`${API_ROUTES.getUserByToken}/${userId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                            params: { userId }
                        }).then(res => ({
                            userId,
                            userName: res.data.user_name
                        }));
                    })
                );

                const userNameMap = userNames.reduce((acc, { userId, userName }) => {
                    acc[userId] = userName;
                    return acc;
                }, {});

                setUserNameMap(userNameMap);

            } catch (error) {
                console.error('Error fetching group details:', error);
            }
        };

        fetchGroupDetails();
    }, [id]);

    const handleSendMessage = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_ROUTES.sendGroupMessages}/${id}`,
                { content: newMessage, type: 'message' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages([...messages, { content: newMessage, sender: 'Me', type: 'message' }]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleBackBtn = () => {
        nav('/groups');
    };

    const handleOpenFlashcard = (flashcardId) => {
        nav(`/note/view/${flashcardId}`);
    };

    return (
        <div className="group-chat-container">
            <header className="chat-header">
                <button className="back-button" onClick={handleBackBtn}>←</button>
                <div className="group-info">
                    <h1 className="group-name">{groupDetails?.name}</h1>
                    <span className="member-count">Members</span>
                </div>
            </header>
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <span className="message-sender">{userNameMap[message.sender] || 'Unknown'}:</span>
                        {message.type === 'flashcard' ? (
                            <div className="flashcard-message-card">
                                <div className="flashcard-header">
                                    <h3>{flashcardDetailsMap[message.content]?.title || 'Flashcard'}</h3>
                                </div>
                                <div className="flashcard-content">
                                    <button className="open-flashcard-button" onClick={() => handleOpenFlashcard(message.content)}>
                                        Open Flashcard
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <span className="message-content">{message.content}</span>
                        )}
                    </div>
                ))}
            </div>
            <div className="message-input-container">
                <input
                    type="text"
                    className="message-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button className="send-button" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default GroupChat;