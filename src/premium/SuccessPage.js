import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnimation from "./lockUnlock.json";
import styled, { keyframes } from "styled-components";

const SuccessPage = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 200);
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
          You’ve officially entered the <Highlight>elite</Highlight> learning experience.
          <br />
          Welcome to <Brand>Edusify Premium</Brand>.
        </Text>
        <CTA onClick={handleStart}>Start Exploring</CTA>
      </Card>
    </Wrapper>
  );
};

// ANIMATIONS
const fadePop = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// COMPONENTS
const Wrapper = styled.div`
  background: linear-gradient(135deg, #0c0c0f, #111116);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Poppins", sans-serif;
`;

const Close = styled.div`
  position: absolute;
  top: 24px;
  right: 30px;
  font-size: 28px;
  color: #aaa;
  cursor: pointer;
  z-index: 999;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 460px;
  padding: 50px 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 28px;
  backdrop-filter: blur(28px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.7);
  text-align: center;
  opacity: 0;
  transform: translateY(40px) scale(0.96);
  transition: all 0.6s ease;
  will-change: transform, opacity;

  &.visible {
    animation: ${fadePop} 0.7s ease-out forwards;
  }
`;

const LottieBox = styled.div`
  width: 160px;
  height: 160px;
  margin: 0 auto 32px;
  filter: drop-shadow(0 0 32px rgba(52, 199, 89, 0.7));
`;

const Heading = styled.h1`
  font-size: 2.3rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #fff;
  margin-bottom: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const Text = styled.p`
  font-size: 1.125rem;
  color: #d1d1d1;
  line-height: 1.7;
  margin-bottom: 36px;
`;

const Highlight = styled.span`
  color: #fff;
  font-weight: 500;
`;

const Brand = styled.span`
  color: #34c759;
  font-weight: 600;
  letter-spacing: -0.2px;
`;

const CTA = styled.button`
  background: #34c759;
  color: #000;
  font-size: 1rem;
  font-weight: 600;
  padding: 16px 36px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(52, 199, 89, 0.4);

  &:hover {
    background: #28b347;
    box-shadow: 0 12px 36px rgba(52, 199, 89, 0.6);
  }

  &:active {
    transform: scale(0.97);
  }
`;

export default SuccessPage;
