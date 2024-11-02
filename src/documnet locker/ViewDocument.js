import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message, Input, Button, Card, Row, Col, Modal, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './DocumentView.css'; // Assuming you have a CSS file for additional styling

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for password submission
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image

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

  const handleImageClick = (file) => {
    setSelectedImage(file); // Set the selected image
    setImagePreviewVisible(true); // Show the image preview modal
  };

  const handleModalClose = () => {
    setImagePreviewVisible(false); // Hide the image preview modal
    setSelectedImage(null); // Clear the selected image
  };

  // Password modal
  const passwordModal = () => (
    <Modal
      title="Enter Document Password"
      visible={!isAuthenticated}
      onCancel={handleBack}
      footer={null}
      centered
      style={{ borderRadius: '10px' }} // Rounded modal
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
          style={{ borderRadius: '10px', width: '100%' }}
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
    <div className="document-view__view__doc__page" style={{ padding: '20px' }}>
      <header className="document-header__view__doc__page" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{ padding: 0, fontSize: '24px', color: '#1890ff' }} // Highlight the back button
        />
        <div style={{ marginLeft: '16px' }}>
          <h2 style={{ fontSize: '24px', margin: 0, fontWeight: '600' }}>{doc.title}</h2>
          <p style={{ fontSize: '16px', color: '#999', margin: '5px 0 0 0' }}>{doc.description}</p>
        </div>
      </header>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
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
                      style={{ borderRadius: '10px 10px 0 0', objectFit: 'cover', height: '150px' }} // Rounded corners and cover fit
                    />
                  }
                  className="file-card__view__doc__page"
                  style={{ borderRadius: '10px' }} // Rounded card
                >
                  <Button 
                    type="primary" 
                    style={{ width: '100%', borderRadius: '10px' }} 
                    onClick={() => handleImageClick(file)}
                  >
                    View
                  </Button>
                </Card>
              </Col>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%' }}>No associated files found for this document.</p>
          )}
        </Row>
      )}

      {/* Modal for image preview */}
      <Modal
        visible={imagePreviewVisible}
        onCancel={handleModalClose}
        footer={null}
        centered
        style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '10px' }} // Ensure modal is centered and fits well
      >
        {selectedImage && (
          <img
            src={`${API_ROUTES.displayImg}/${selectedImage.file_name}`}
            alt={selectedImage.file_name}
            style={{ width: '100%', height: 'auto', borderRadius: '10px' }} // Responsive image style
          />
        )}
      </Modal>
    </div>
  );
};

export default DocumentView;
