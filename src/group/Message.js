import React from 'react';
import { FaBook, FaQuestionCircle } from 'react-icons/fa';

const Message = ({ message, userNameMap, handleOpenFlashcard, handleOpenQuiz, setReplyToMessageId }) => (
    <div className="message-card">
        <div className="message-header">
            <strong>{userNameMap[message.sender] || 'Unknown'}</strong>
        </div>
        <div className="message-content">
            <p>{message.content}</p>
            {message.type === 'flashcard' && (
                <button className="flashcard-btn" onClick={() => handleOpenFlashcard(message.content)}>
                    <FaBook /> Open Flashcard
                </button>
            )}
            {message.type === 'quiz' && (
                <button className="quiz-btn" onClick={() => handleOpenQuiz(message.content)}>
                    <FaQuestionCircle /> Take Quiz
                </button>
            )}
        </div>
        <div className="replies-container">
            {message.replies && message.replies.map(reply => (
                <div key={reply.id} className="reply">
                    <strong>{userNameMap[reply.sender] || 'Unknown'}</strong>
                    <p>{reply.content}</p>
                </div>
            ))}
        </div>
        <button className="reply-btn" onClick={() => setReplyToMessageId(message.id)}>Reply</button>
    </div>
);

export default Message;