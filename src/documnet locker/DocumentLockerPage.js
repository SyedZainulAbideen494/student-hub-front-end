import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Upload, message, Select, List, Typography } from 'antd';
import { PlusOutlined, FolderOutlined, FileOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FooterNav from '../app_modules/footernav';
import { API_ROUTES } from '../app_modules/apiRoutes';

const { Option } = Select;
const { Title } = Typography;

const DocumentLockerPage = () => {
  const [isFolderView, setIsFolderView] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [docPassword, setDocPassword] = useState('');
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    fetchFolders();
    fetchDocuments();
  }, [selectedFolder]); // Fetch documents when selectedFolder changes

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ROUTES.getFolders, { token });
      setFolders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ROUTES.getDocuments, { token, folderId: selectedFolder });
      setDocuments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleView = (view) => {
    setIsFolderView(view === 'folder');
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setFolderName('');
    setDocTitle('');
    setDocDescription('');
    setDocPassword('');
    setFileList([]);
  };

  const handleFolderSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(API_ROUTES.addFolder, { folderName, token });
      message.success('Folder created successfully');
      fetchFolders();
      handleCancel();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDocSubmit = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('token', token);
    formData.append('title', docTitle);
    formData.append('description', docDescription);
    formData.append('password', docPassword);
    formData.append('folderId', selectedFolder);
    fileList.forEach(file => formData.append('files', file.originFileObj));

    try {
      await axios.post(API_ROUTES.addDocument, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Document uploaded successfully');
      fetchDocuments();
      handleCancel();
    } catch (error) {
      console.error('Error during document upload:', error.response ? error.response.data : error);
    }
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList);

  const renderModalContent = () => {
    if (isFolderView) {
      return <Input placeholder="Folder Name" value={folderName} onChange={(e) => setFolderName(e.target.value)} />;
    } else {
      return (
        <div>
          <Input placeholder="Document Title" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} style={{ marginBottom: 10 }} />
          <Input.TextArea placeholder="Description (optional)" value={docDescription} onChange={(e) => setDocDescription(e.target.value)} style={{ marginBottom: 10 }} />
          <Input.Password placeholder="Password (optional)" value={docPassword} onChange={(e) => setDocPassword(e.target.value)} style={{ marginBottom: 10 }} />
          <Upload multiple onChange={handleFileChange} fileList={fileList}>
            <Button icon={<PlusOutlined />}>Upload Images</Button>
          </Upload>
          <Select
            placeholder="Select Folder (optional)"
            onChange={(value) => setSelectedFolder(value)}
            style={{ width: '100%', marginTop: 10 }}
          >
            <Option value={null}>None</Option>
            {folders.map(folder => (
              <Option key={folder.id} value={folder.id}>{folder.name}</Option>
            ))}
          </Select>
        </div>
      );
    }
  };

  const handleViewDocument = (documentId, passwordRequired) => {
      // Directly navigate to the document view page
      navigate(`/document/view/${documentId}`);
  };

  const handleViewFolder = (folderId) => {
    navigate(`/folder/${folderId}`);
  };

  const filteredDocuments = documents.filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
<div style={{ padding: 20 }}>
  <header style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
    <Input 
      placeholder="Search..."
      prefix={<SearchOutlined />}
      value={searchTerm}
      onChange={handleSearchChange}
      style={{ width: 200 }}
    />
  </header>

  <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20 }}>
    <Button 
      type={isFolderView ? 'primary' : 'default'}
      icon={<FolderOutlined />}
      onClick={() => toggleView('folder')}
    >
      Folder
    </Button>
    <Button 
      type={!isFolderView ? 'primary' : 'default'}
      icon={<FileOutlined />}
      onClick={() => toggleView('document')}
    >
      Document
    </Button>
  </div>

  {/* Fixed Add Button */}
  <Button 
    type="primary" 
    shape="round" // Change to round for a wider effect
    icon={<PlusOutlined />} 
    onClick={showModal} 
    style={{ position: 'fixed', bottom: 100, right: 20, width: '40px', height: '40px' }} // Set fixed width and height
/>


  <Modal
    title={isFolderView ? "Create Folder" : "Add Document"}
    visible={isModalVisible}
    onCancel={handleCancel}
    onOk={isFolderView ? handleFolderSubmit : handleDocSubmit}
    okText="Submit"
  >
    {renderModalContent()}
  </Modal>

  {/* Display Folders */}
  <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
  {isFolderView && (
  <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px', paddingBottom: '80px', width: '75%', margin: '0 auto' }}>
    <Title level={4} style={{ textAlign: 'center' }}>Folders</Title>
    <List
      bordered
      dataSource={folders}
      renderItem={item => (
        <List.Item onClick={() => handleViewFolder(item.id)} style={{ cursor: 'pointer', textAlign: 'center' }}>
          {item.name}
        </List.Item>
      )}
    />
  </div>
)}

{/* Display Documents */}
{!isFolderView && (
  <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px', paddingBottom: '80px', width: '75%', margin: '0 auto' }}>
    <Title level={4} style={{ textAlign: 'center' }}>Documents</Title>
    <List
      bordered
      dataSource={filteredDocuments}
      renderItem={item => (
        <List.Item style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div><strong>{item.title}</strong></div>
          <div style={{ color: '#888' }}>{item.description}</div>
          <Button 
            type="link" 
            style={{ marginTop: '5px' }} 
            onClick={() => handleViewDocument(item.id, !!item.password)}
          >
            View
          </Button>
        </List.Item>
      )}
    />
  </div>
)}

  </div>

  <FooterNav />
</div>

  );
};

export default DocumentLockerPage;
