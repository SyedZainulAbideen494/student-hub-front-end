import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaFolder, FaPaperclip } from 'react-icons/fa';

const DocumentLockerPage = () => {
    const [folders, setFolders] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedTab, setSelectedTab] = useState('folders'); // Track active tab
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [newDocName, setNewDocName] = useState('');
    const [newDocDescription, setNewDocDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        // Fetch folders
        axios.get(`http://localhost:8080/api/folders?userId=1`).then(response => {
            setFolders(response.data);
        });
    }, []);

    // Fetch documents for the selected folder
    const fetchDocumentsForFolder = (folderId) => {
        axios.get(`http://localhost:8080/api/documents?userId=1&folderId=${folderId}`).then(response => {
            setDocuments(response.data);
        });
    };

    // Handle document search
    const handleSearch = () => {
        axios.get(`http://localhost:8080/api/search?userId=1&keyword=${search}`).then(response => {
            setDocuments(response.data);
        });
    };

    // Handle document upload
    const handleUploadDocument = () => {
        if (!selectedFile || !newDocName) {
            alert("Please select a file and provide a document name!");
            return;
        }

        const formData = new FormData();
        formData.append('document', selectedFile);
        formData.append('docName', newDocName);
        formData.append('description', newDocDescription);
        formData.append('userId', 1);
        formData.append('folderId', selectedFolderId || "Uncategorized"); // Default to 'Uncategorized'

        axios.post('http://localhost:8080/api/document', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(() => {
            setNewDocName('');
            setNewDocDescription('');
            setSelectedFile(null);
            setSelectedFolderId(null);
            // Fetch updated documents
            if (selectedFolderId) {
                fetchDocumentsForFolder(selectedFolderId);
            }
        })
        .catch((error) => {
            console.error("Error uploading document:", error);
        });
    };

    return (
        <div className="document-locker__main__page">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search documents..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <div className="tab-section">
                <button
                    className={`tab-button ${selectedTab === 'folders' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('folders')}
                >
                    <FaFolder />
                    Folders
                </button>
                <button
                    className={`tab-button ${selectedTab === 'documents' ? 'active' : ''}`}
                    onClick={() => {
                        setSelectedTab('documents');
                        setDocuments([]); // Clear documents when switching tabs
                    }}
                >
                    <FaPaperclip />
                    Documents
                </button>
            </div>

            {selectedTab === 'folders' && (
                <div className="folder-section doc__locker__page">
                    <h3>Folders</h3>
                    <div className="folder-cards">
                        {folders.map((folder) => (
                           <div 
                           key={folder.id} 
                           className="folder-card" 
                           onClick={() => {
                               navigate(`/folder/${folder.id}`); // Navigate to the folder's page
                           }}
                       >
                           <FaFolder className="folder-icon" />
                           <span>{folder.folder_name}</span>
                       </div>
                        ))}
                    </div>
                    <Link to="/create-folder" className="create-folder-button">
                        Create New Folder
                    </Link>
                </div>
            )}

            {selectedTab === 'documents' && (
                <div className="document-section doc__locker__page">
                    <h3>Documents</h3>
                    <ul>
                        {documents.map((doc) => (
                            <li key={doc.id}>
                                <span>{doc.doc_name}</span>
                                <a href={`http://localhost:8080/api/download/${doc.id}`}>Download</a>
                            </li>
                        ))}
                    </ul>

                    <h3>Upload New Document</h3>
                    <input
                        type="text"
                        placeholder="Document Name"
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                    />
                    <textarea
                        placeholder="Description"
                        value={newDocDescription}
                        onChange={(e) => setNewDocDescription(e.target.value)}
                    />
                    <input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                    <label>Select Folder (Optional):</label>
                    <select value={selectedFolderId || ''} onChange={(e) => setSelectedFolderId(e.target.value)}>
                        <option value="">Uncategorized</option>
                        {folders.map((folder) => (
                            <option key={folder.id} value={folder.id}>
                                {folder.folder_name}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleUploadDocument}>Upload Document</button>
                </div>
            )}
        </div>
    );
};

export default DocumentLockerPage;
