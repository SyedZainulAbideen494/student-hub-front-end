import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnimation from "./lockUnlock.json"; // Ensure this is in src folder
import styled from "styled-components";

const SuccessPage = () => {
  const [showContent, setShowContent] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    setTimeout(() => setShowContent(true), 500);
  }, []);

  const handleGoBack = () => {
    nav("/");
  };

  return (
    <SuccessWrapper>
      <CloseButton onClick={handleGoBack}>✕</CloseButton>
      <Content className={showContent ? "show" : ""}>
        <LottieContainer>
          <Lottie animationData={successAnimation} loop={true} />
        </LottieContainer>
        <Title>Success!</Title>
        <Subtitle>You’ve unlocked Edusify Premium. Get ready to level up your learning!</Subtitle>
      </Content>
    </SuccessWrapper>
  );
};

export default SuccessPage;

// Styled Components
const SuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #0a0a0a;
  font-family: "SF Pro Display", "Poppins", sans-serif;
  position: relative;
  overflow: hidden;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 26px;
  color: #888;
  cursor: pointer;
  transition: color 0.2s ease;
z-index: 1000000;
  &:hover {
    color: #fff;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 40px;
  max-width: 480px;
  margin: 0 20px;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.6s ease-in-out;

  &.show {
    opacity: 1;
    transform: scale(1);
  }
`;

const LottieContainer = styled.div`
  width: 180px;
  height: 180px;
  filter: drop-shadow(0 0 20px #30d158); /* Subtle success glow */
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #ffffff;
  margin-top: 20px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #aaa;
  margin-top: 10px;
  text-align: center;
  max-width: 90%;
  line-height: 1.5;
`;
