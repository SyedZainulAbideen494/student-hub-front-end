import React, { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Slide } from 'react-awesome-reveal';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f0f0f0;
    color: #333333;
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Navbar = styled.nav`
  background: #ffffff;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavLink = styled(Link)`
  color: #333333;
  text-decoration: none;
  margin: 0 1rem;
  transition: color 0.3s;
  &:hover {
    color: #007BFF;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Header = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #007BFF;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const CardContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 10px;
  padding: 2rem;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 250px;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    width: 90%;
    padding: 1rem;
  }
`;

const Button = styled.button`
  display: inline-block;
  padding: 1rem 2rem;
  margin-top: 1rem;
  background: #007BFF;
  color: #ffffff;
  border-radius: 5px;
  border: none;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #0056b3;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1.5rem;
    margin-top: 0.5rem;
  }
`;

const AppInfo = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: #666666;
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const FeaturesContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

const FeaturesHeader = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #007BFF;
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const FeaturesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const FeatureCard = styled.div`
  background: #ffffff;
  border-radius: 10px;
  padding: 1.5rem;
  width: 250px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

const FeatureTitle = styled.h3`
  color: #007BFF;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: #666666;
  font-size: 1rem;
`;

const Footer = styled.footer`
  background: #ffffff;
  padding: 1rem;
  text-align: center;
  color: #333333;
  position: relative;
  bottom: 0;
  width: 100%;
`;

const handleDownload = async () => {
  const response = await fetch(API_ROUTES.downloadAndroid, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });

  if (!response.ok) {
    console.error('Failed to download file');
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Edusify.apk'; // Replace with your file name
  document.body.appendChild(a);
  a.click();
  a.remove();
};



const checkTokenAndRedirect = async (token, navigate) => {
    try {
      const response = await axios.post(`${API_ROUTES.sessionCheck}`, { token });
  
      if (response.data.exists) {
        // Token is valid, redirect to /planner
        navigate('/planner');
      } else {
        console.error('No matching token found.');
      }
    } catch (error) {
      console.error('Error checking token:', error);
    }
  };


const DownloadPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token'); // Replace with actual token retrieval logic
      checkTokenAndRedirect(token, navigate);
    }, [navigate]);


  return (
    <>
      <GlobalStyle />
      <Navbar>
        <h1 style={{ color: '#007BFF' }}>Edusify</h1>
        <div>
          <NavLink to='/terms-and-conditions'>Terms and Conditions</NavLink>
        </div>
      </Navbar>
      <Container>
        <Slide triggerOnce>
          <Header id="home">Download Our App</Header>
        </Slide>
        <CardContainer>
          <Slide direction="left" triggerOnce>
            <Card>
              <h2 style={{ color: '#333333' }}>Download for Android</h2>
              <AppInfo>
                Our app is available for Android devices. Click the button below to download.
              </AppInfo>
              <Button onClick={handleDownload}>Download for Android</Button>
            </Card>
          </Slide>
          <Slide direction="right" triggerOnce>
            <Card>
              <h2 style={{ color: '#333333' }}>Download for iOS</h2>
              <AppInfo>
                Our app is not available on Apple Store. Click the button below to use web-app.
              </AppInfo>
              <NavLink to='/sign-up'>
                <Button>Download for iOS</Button>
              </NavLink>
            </Card>
          </Slide>
        </CardContainer>
        <FeaturesContainer id="features">
          <FeaturesHeader>App Features</FeaturesHeader>
          <FeaturesGrid>
            <Slide direction="left" triggerOnce>
              <FeatureCard>
                <FeatureTitle>Add Tasks</FeatureTitle>
                <FeatureDescription>
                  Easily add tasks and get reminders via WhatsApp and email.
                </FeatureDescription>
              </FeatureCard>
            </Slide>
            <Slide direction="left" triggerOnce>
              <FeatureCard>
                <FeatureTitle>Create Groups</FeatureTitle>
                <FeatureDescription>
                  Create private or public groups and collaborate with friends.
                </FeatureDescription>
              </FeatureCard>
            </Slide>
            <Slide direction="right" triggerOnce>
              <FeatureCard>
                <FeatureTitle>Add Notes</FeatureTitle>
                <FeatureDescription>
                  Add notes and flashcards, and share them with friends in groups.
                </FeatureDescription>
              </FeatureCard>
            </Slide>
            <Slide direction="right" triggerOnce>
              <FeatureCard>
                <FeatureTitle>Track Progress</FeatureTitle>
                <FeatureDescription>
                  Track your progress and improve your productivity.
                </FeatureDescription>
              </FeatureCard>
            </Slide>
          </FeaturesGrid>
        </FeaturesContainer>
      </Container>
      <Footer>
        <p>&copy; {new Date().getFullYear()} Edusify. All rights reserved.</p>
      </Footer>
    </>
  );
};

export default DownloadPage;