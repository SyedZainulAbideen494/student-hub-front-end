// ImportNotionPage.js
import React, { useState } from 'react';
import axios from 'axios';

const ImportNotionPage = () => {
  const [notionPageId, setNotionPageId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [userId, setUserId] = useState(''); // Assume this is set after login
  const [message, setMessage] = useState('');

  const handleImport = async () => {
    try {
      const response = await axios.post('http://localhost:5000/import-notion', {
        userId,
        notionPageId,
        accessToken
      });

      setMessage('Notion page imported successfully!');
      console.log(response.data);
    } catch (error) {
      setMessage('Error importing Notion page');
      console.error('Error importing Notion:', error);
    }
  };

  return (
    <div>
      <h2>Import Notion Page</h2>
      <input 
        type="text" 
        placeholder="Notion Page ID" 
        value={notionPageId}
        onChange={(e) => setNotionPageId(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Access Token" 
        value={accessToken}
        onChange={(e) => setAccessToken(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="User ID" 
        value={userId}
        onChange={(e) => setUserId(e.target.value)} 
      />
      <button onClick={handleImport}>Import</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ImportNotionPage;
