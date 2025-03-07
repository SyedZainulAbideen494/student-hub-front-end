import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import Lottie from "lottie-react";
import successAnimation from "./tick-success.json"; // Place JSON in src folder
import styled from "styled-components";

const SuccessPage = () => {
  const [showBadge, setShowBadge] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    setTimeout(() => setShowBadge(true), 500);
  }, []);

  const handleGoBack = () => {
    nav("/");
  };

  return (
    <SuccessWrapper>
    
      <CloseButton onClick={handleGoBack}>✕</CloseButton>
      <Card>
        <BadgeContainer className={showBadge ? "show" : ""}>
          <Lottie animationData={successAnimation} loop={true} />
        </BadgeContainer>
        <Title>Success!</Title>
        <Subtitle>You’ve unlocked Edusify Premium. Get ready to level up your learning!</Subtitle>
      </Card>
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
  position: relative;
  font-family: "Poppins", sans-serif;
`;

const Card = styled.div`
  background: white;
  width: 65%;
  max-width: 380px;
  border-radius: 20px;
  text-align: center;
  padding: 2rem;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 20px;
  color: #333;
  cursor: pointer;
`;

const BadgeContainer = styled.div`
  width: 120px;
  height: 120px;
  margin: auto;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.5s ease-in-out;

  &.show {
    opacity: 1;
    transform: scale(1);
  }
`;

const Title = styled.h1`
  font-size: 1.6rem;
  color: #333;
  margin-top: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #555;
  margin-top: 0.5rem;
`;
