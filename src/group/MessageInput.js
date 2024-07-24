import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const MessageInput = ({
    replyToMessageId,
    replyMessage,
    setReplyMessage,
    newMessage,
    setNewMessage,
    handleSendReply,
    handleSendMessage
}) => (
    <div className="message-input-container">
        <input
            type="text"
            value={replyToMessageId ? replyMessage : newMessage}
            onChange={e => replyToMessageId ? setReplyMessage(e.target.value) : setNewMessage(e.target.value)}
            placeholder={replyToMessageId ? "Type your reply here..." : "Type your message here..."}
        />
        <button className="send-btn" onClick={replyToMessageId ? handleSendReply : handleSendMessage}>
            <FaArrowRight />
        </button>
    </div>
);

export default MessageInput;
