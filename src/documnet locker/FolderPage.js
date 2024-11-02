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
    }
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setDocTitle('');
    setDocDescription('');
    setDocPassword('');
    setFileList([]);
  };

  const filteredDocuments = documents.filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)} 
          style={{ fontSize: '16px', marginRight: '10px' }} 
        />
        <Title level={4} style={{ margin: 0, fontSize: '20px' }}>{folderName}</Title>
      </header>
      
      {/* Centered Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Input 
          placeholder="Search documents..." 
          prefix={<SearchOutlined />} 
          value={searchTerm} 
          onChange={handleSearchChange} 
          style={{ width: 300 }} 
        />
      </div>
      <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px', paddingBottom: '80px', width: '60%', margin: '0 auto' }}>
      <Title level={5} style={{ marginBottom: 10 }}>Documents in this Folder</Title>
      <List
        bordered
        dataSource={filteredDocuments}
        renderItem={item => (
          <List.Item>
            <div style={{ flex: 1 }}>
              <Text strong>{item.title}</Text> - <Text type="secondary">{item.description}</Text>
            </div>
            <Button type="link" onClick={() => navigate(`/document/view/${item.id}`)}>
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
      >
        <Input placeholder="Document Title" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} style={{ marginBottom: 10 }} />
        <Input.TextArea placeholder="Description (optional)" value={docDescription} onChange={(e) => setDocDescription(e.target.value)} style={{ marginBottom: 10 }} />
        <Input.Password placeholder="Password (optional)" value={docPassword} onChange={(e) => setDocPassword(e.target.value)} style={{ marginBottom: 10 }} />
        <Upload multiple onChange={handleFileChange} fileList={fileList}>
          <Button icon={<PlusOutlined />}>Upload Files</Button>
        </Upload>
      </Modal>

      {/* Fixed and Rounded Add Document Button */}
      <div style={{ position: 'fixed', bottom: 50, right: 20 }}>
        <Button 
          type="primary" 
          shape="circle" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalVisible(true)} 
          style={{ position: 'fixed', bottom: 20, right: 20, width: '50px', height: '50px' }} 
        />
      </div>
    </div>
  );
};

export default FolderPage;
