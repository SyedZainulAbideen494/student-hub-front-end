import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message, Input, Button, Card, Row, Col, Modal } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './DocumentView.css'; // Assuming you have a CSS file for additional styling
import { API_ROUTES } from '../app_modules/apiRoutes';

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for password submission

  useEffect(() => {
    // Fetch the document only once when the component mounts
    if (isAuthenticated) {
      fetchDocument();
    }
  }, [isAuthenticated]); // Only depend on isAuthenticated

  const fetchDocument = async () => {
    try {
      const token = localStorage.getItem('token');
      setLoading(true); // Start loading
      const response = await axios.post(API_ROUTES.viewDocument, {
        token,
        documentId: id,
        password,
      });

      if (response.data.error) {
        message.error(response.data.error); // Show error message on failure
      } else {
        setDoc(response.data.document);
        setFiles(response.data.files);
        setIsAuthenticated(true); // Set authenticated state on successful fetch
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      message.error('Error fetching document'); // Show generic error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    fetchDocument(); // Fetch document with the provided password on submit
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Password modal
  const passwordModal = () => (
    <Modal
      title="Enter Document Password"
      visible={!isAuthenticated}
      onCancel={() => setPassword('')}
      footer={null}
      centered
    >
      <form onSubmit={handlePasswordSubmit} className="password-form__view__doc__page">
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
          style={{ marginBottom: '10px', borderRadius: '10px' }} // Rounded input
        />
        <Button
          type="primary"
          htmlType="submit"
          loading={loading} // Show loading spinner
          style={{ borderRadius: '10px' }}
        >
          Submit
        </Button>
      </form>
    </Modal>
  );

  if (!isAuthenticated) {
    return passwordModal();
  }

  return (
    <div className="document-view__view__doc__page">
      <header className="document-header__view__doc__page">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{ padding: 0, fontSize: '24px', color: '#1890ff' }} // Highlight the back button
        />
        <div className="document-header-content__view__doc__page">
          <h2 style={{ fontSize: '20px', margin: 0, fontWeight: '200' }}>{doc.title}</h2>
          <p style={{ fontSize: '16px', color: '#999', margin: '5px 0 0 0' }}>{doc.description}</p>
        </div>
      </header>
      <div>
        <Row gutter={[16, 16]}>
          {files.length > 0 ? (
            files.map((file) => (
              <Col xs={24} sm={12} md={8} lg={6} key={file.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      src={`${API_ROUTES.displayImg}/${file.file_name}`}
                      alt={file.file_name}
                      className="responsive-image__view__doc__page"
                    />
                  }
                  className="file-card__view__doc__page"
                >
                </Card>
              </Col>
            ))
          ) : (
            <p>No associated images found for this document.</p>
          )}
        </Row>
      </div>
    </div>
  );
};

export default DocumentView;
