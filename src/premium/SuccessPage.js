import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnimation from "./lockUnlock.json";
import styled, { keyframes } from "styled-components";

const SuccessPage = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 200); // faster response
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    navigate("/");
  };

  return (
    <Wrapper>
      <Close onClick={handleStart}>✕</Close>
      <Card className={show ? "visible" : ""}>
        <LottieBox>
          <Lottie animationData={successAnimation} loop={false} />
        </LottieBox>
        <Heading>Premium Unlocked</Heading>
        <Text>
          You’ve officially entered the elite learning experience.
          <br />
          Welcome to <Brand>Edusify Premium</Brand>.
        </Text>
        <CTA onClick={handleStart}>Get Started</CTA>
      </Card>
    </Wrapper>
  );
};

// Animations
const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// Components
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0b0b0f;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Poppins", sans-serif;
  position: relative;
  padding: 20px;
`;

const Close = styled.div`
  position: absolute;
  top: 24px;
  right: 28px;
  font-size: 28px;
  color: #888;
  cursor: pointer;
  z-index: 10;
  transition: color 0.3s ease;

  &:hover {
    color: #fff;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(24px);
  padding: 48px 40px;
  border-radius: 28px;
  text-align: center;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.65);
  opacity: 0;
  transform: translateY(40px) scale(0.96);
  transition: all 0.6s ease;

  &.visible {
    animation: ${fadeUp} 0.6s ease forwards;
  }
`;

const LottieBox = styled.div`
  width: 160px;
  height: 160px;
  margin: 0 auto 32px;
  filter: drop-shadow(0 0 30px #34c759aa);
`;

const Heading = styled.h1`
  font-size: 2.2rem;
  color: #fff;
  font-weight: 600;
  margin-bottom: 14px;
  letter-spacing: -0.3px;
`;

const Text = styled.p`
  color: #ccc;
  font-size: 1.1rem;
  line-height: 1.65;
  margin-bottom: 32px;
`;

const Brand = styled.span`
  color: #34c759;
  font-weight: 600;
`;

const CTA = styled.button`
  padding: 16px 36px;
  font-size: 1rem;
  font-weight: 500;
  background: #34c759;
  color: #000;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 16px rgba(52, 199, 89, 0.4);

  &:hover {
    background: #28b347;
    box-shadow: 0 8px 20px rgba(40, 179, 71, 0.5);
  }

  &:active {
    transform: scale(0.97);
  }
`;

export default SuccessPage;
