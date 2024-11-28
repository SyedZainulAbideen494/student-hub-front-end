import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EmailSender = () => {
    const [emailContent, setEmailContent] = useState('');
    const [subject, setSubject] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://srv594954.hstgr.cloud/get-users/all/admin');
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const toggleUserSelection = (uniqueId) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(uniqueId)
                ? prevSelected.filter((id) => id !== uniqueId)
                : [...prevSelected, uniqueId]
        );
    };

    const handleSendEmails = async () => {
        try {
            const response = await fetch('https://srv594954.hstgr.cloud/send-emails/selected-users/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: emailContent,
                    subject,
                    selectedUsers,
                }),
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
            <h3>Select Users</h3>
            <ul>
                {users.map((user) => (
                    <li key={user.unique_id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.unique_id)}
                                onChange={() => toggleUserSelection(user.unique_id)}
                            />
                            {user.unique_id} ({user.email})
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={handleSendEmails}>Send Emails</button>
        </div>
    );
};

export default EmailSender;
