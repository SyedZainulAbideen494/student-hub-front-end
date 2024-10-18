import React, { useState } from 'react';
import axios from 'axios';
import './docLocker.css'

const CreateFolderPage = () => {
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = () => {
    if (!newFolderName) {
      alert("Folder name cannot be empty!");
      return;
    }
    axios
      .post('http://localhost:8080/api/folder/create', { userId: 1, folderName: newFolderName })
      .then(() => {
        alert("Folder created successfully!");
        setNewFolderName('');
      })
      .catch((error) => {
        console.error("Error creating folder:", error);
      });
  };

  return (
    <div className="create-folder__page doc__locker__page">
      <h2>Create New Folder</h2>
      <input
        type="text"
        placeholder="New Folder Name"
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
      />
      <button onClick={handleCreateFolder}>Create Folder</button>
    </div>
  );
};

export default CreateFolderPage;
