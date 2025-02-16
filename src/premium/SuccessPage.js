import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
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
      <Confetti numberOfPieces={100} />
      <CloseButton onClick={handleGoBack}>✕</CloseButton>
      <Card>
        <BadgeContainer className={showBadge ? "show" : ""}>
          🏆
        </BadgeContainer>
        <Title>Congratulations!</Title>
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
  background: #0e0e10;
  position: relative;
  font-family: "Poppins", sans-serif;
`;

const Card = styled.div`
  background: #141417;
  width: 65%;
  max-width: 350px;
  border-radius: 20px;
  text-align: center;
  padding: 2rem;
  box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 20px;
  color: white;
  cursor: pointer;
`;

const BadgeContainer = styled.div`
  font-size: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px 15px;
  display: inline-block;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.5s ease-in-out;

  &.show {
    opacity: 1;
    transform: scale(1);
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: white;
  margin-top: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #bbb;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  background: #8a2be2;
  color: white;
  font-size: 1rem;
  padding: 0.8rem;
  width: 100%;
  margin-top: 1.5rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #7a1fd8;
  }
`;
