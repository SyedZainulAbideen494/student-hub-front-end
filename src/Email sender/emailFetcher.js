import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';

const EmailFetcher = () => {
    const [users, setUsers] = useState([]); // Changed to store users instead of just emails
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sqlCommand, setSqlCommand] = useState('');

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found');
                    setLoading(false);
                    return;
                }
    
                console.log('Fetching emails with token:', token);
    
                const url = 'https://dropment.online/api/emails/admin'; // Verify this URL
                console.log('API URL:', url);
    
                const { data } = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                const usersArray = data.users; // Expecting users array now
                setUsers(usersArray);
    
                const sqlInsertCommand = `INSERT INTO users (unique_id, email) VALUES ${usersArray.map(user => `('${user.unique_id}', '${user.email}')`).join(', ')};`;
                setSqlCommand(sqlInsertCommand);
    
            } catch (err) {
                setError('Error fetching emails');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchEmails();
    }, []);
    
    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && (
                <div>
                    <h2>Users</h2>
                    <ul>
                        {users.map((user, index) => (
                            <li key={index}>{user.email} (ID: {user.unique_id})</li>
                        ))}
                    </ul>
                    <h3>SQL Command</h3>
                    <textarea readOnly value={sqlCommand} rows="5" cols="50" />
                </div>
            )}
        </div>
    );
};

export default EmailFetcher;
