// AdminPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';

const AdminPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title && content) {
            try {
                await axios.post(API_ROUTES.addWhatsNew, { title, content });
                setTitle('');
                setContent('');
                alert('Update posted successfully!');
            } catch (error) {
                console.error('Error posting update:', error);
                alert('Failed to post update. Please try again.');
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center' }}>Admin - Post Update</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Post Update
                </button>
            </form>
        </div>
    );
};

export default AdminPage;
