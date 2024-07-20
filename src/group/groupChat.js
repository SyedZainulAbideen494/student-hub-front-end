import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './GroupChat.css'; // Import CSS file for styling

const GroupChat = () => {
    const { id } = useParams();
    const nav = useNavigate();
    const [groupDetails, setGroupDetails] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/groups/${id}`);
                setGroupDetails(response.data);
                setMessages(response.data.messages); // assuming messages are included
            } catch (error) {
                console.error('Error fetching group details:', error);
            }
        };

        fetchGroupDetails();
    }, [id]);

    const handleSendMessage = async () => {
        try {
            await axios.post(`http://localhost:8080/api/groups/${id}/messages`, { content: newMessage });
            setMessages([...messages, { content: newMessage, sender: 'Me' }]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleBackBtn = () => {
        nav('/groups')
    }

    return (
        <div className="group-chat-container">
            <header className="chat-header">
                <button className="back-button" onClick={handleBackBtn}>←</button>
                <div className="group-info">
                    <h1 className="group-name">{groupDetails?.name}</h1>
                    <span className="member-count">Members</span>
                </div>
            </header>
            <div className="messages-container" style={{marginBottom: '30px'}}>
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <span className="message-sender">{message.sender}:</span>
                        <span className="message-content">{message.content}</span>
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