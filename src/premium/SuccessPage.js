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
  background: #f9f9f9;
  font-family: "Poppins", sans-serif;
  position: relative;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 22px;
  color: #555;
  cursor: pointer;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.5s ease-in-out;

  &.show {
    opacity: 1;
    transform: scale(1);
  }
`;

const LottieContainer = styled.div`
  width: 180px;
  height: 180px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-top: 20px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-top: 10px;
  text-align: center;
  max-width: 80%;
`;
