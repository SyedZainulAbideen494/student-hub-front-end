import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const EmailSender = () => {
    const [emailContent, setEmailContent] = useState('');
    const [subject, setSubject] = useState('');

    const handleSendEmails = async () => {
        try {
            const response = await fetch(API_ROUTES.sendEmailAsAdmin, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: emailContent, subject }),
            });
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error sending emails:', error);
        }
    };

    return (
        <div>
            <h2>Send Custom Email</h2>
            <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
            />
            <p>
                Use <code>{'{{name}}'}</code> in the email content to dynamically insert the recipient's name.
            </p>
            <ReactQuill
                value={emailContent}
                onChange={setEmailContent}
                placeholder="Write your email content here..."
            />
            <button onClick={handleSendEmails}>Send Emails</button>
        </div>
    );
};

export default EmailSender;
