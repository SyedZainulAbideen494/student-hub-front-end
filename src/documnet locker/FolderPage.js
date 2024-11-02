import React, { useState, useEffect } from 'react';
import { Button, Input, List, Typography, Modal, Upload, message } from 'antd';
import { SearchOutlined, ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';

const { Title, Text } = Typography;

const FolderPage = () => {
  const { id } = useParams();
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [folderName, setFolderName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [docPassword, setDocPassword] = useState('');
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
    fetchFolderName();
  }, [id]);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ROUTES.getFolderDocuments, { token, folderId: id });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchFolderName = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ROUTES.getFolderDetails, { token, folderId: id });
      setFolderName(response.data.name);
    } catch (error) {
      console.error('Error fetching folder name:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList);

  const handleUploadDocument = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('token', token);
    formData.append('title', docTitle);
    formData.append('description', docDescription);
    formData.append('password', docPassword);
    formData.append('folderId', id);
    fileList.forEach(file => formData.append('files', file.originFileObj));

    try {
      await axios.post(API_ROUTES.addDocument, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Document uploaded successfully');
      fetchDocuments();
      handleCancelModal();
    } catch (error) {
      console.error('Error during document upload:', error.response ? error.response.data : error);
      message.error('Failed to upload document. Please try again.');
    }
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setDocTitle('');
    setDocDescription('');
    setDocPassword('');
    setFileList([]);
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)} 
          style={{ fontSize: '20px', marginRight: '10px' }} 
        />
        <Title level={4} style={{ margin: 0, fontSize: '24px' }}>{folderName}</Title>
      </header>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Input 
          placeholder="Search documents..." 
          prefix={<SearchOutlined />} 
          value={searchTerm} 
          onChange={handleSearchChange} 
          style={{ width: 300, borderRadius: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
        />
      </div>

      <Title level={5} style={{ marginBottom: 10 }}>Documents in this Folder</Title>
      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', border: '1px solid #d9d9d9', borderRadius: '10px', padding: '10px', backgroundColor: '#f9f9f9' }}>
        <List
          bordered
          dataSource={filteredDocuments}
          renderItem={item => (
            <List.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <Text strong>{item.title}</Text> - <Text type="secondary">{item.description}</Text>
              </div>
              <Button 
                type="link" 
                onClick={() => navigate(`/document/view/${item.id}`)}
                style={{ color: '#1890ff' }}
              >
                View
              </Button>
            </List.Item>
          )}
        />
      </div>

      <Modal
        title="Add Document"
        visible={isModalVisible}
        onCancel={handleCancelModal}
        onOk={handleUploadDocument}
        okText="Upload"
        cancelText="Cancel"
        style={{ borderRadius: '10px' }}
      >
        <Input placeholder="Document Title" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} style={{ marginBottom: 10 }} />
        <Input.TextArea placeholder="Description (optional)" value={docDescription} onChange={(e) => setDocDescription(e.target.value)} style={{ marginBottom: 10 }} />
        <Input.Password placeholder="Password (optional)" value={docPassword} onChange={(e) => setDocPassword(e.target.value)} style={{ marginBottom: 10 }} />
        <Upload multiple onChange={handleFileChange} fileList={fileList}>
          <Button icon={<PlusOutlined />}>Upload Files</Button>
        </Upload>
      </Modal>

      <Button 
        type="primary" 
        shape="circle" 
        icon={<PlusOutlined />} 
        onClick={() => setIsModalVisible(true)} 
        style={{ position: 'fixed', bottom: '20px', right: '20px', width: '56px', height: '56px', borderRadius: '28px' }} 
      />
    </div>
  );
};

export default FolderPage;
