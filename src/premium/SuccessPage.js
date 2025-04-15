import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnimation from "./lockUnlock.json";
import styled from "styled-components";

const SuccessPage = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
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
        <Text>You’ve officially entered the elite learning experience. Welcome to Edusify Premium.</Text>
        <CTA onClick={handleStart}>Get Started</CTA>
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Poppins", sans-serif;
  position: relative;
`;

const Close = styled.div`
  position: absolute;
  top: 24px;
  right: 30px;
  font-size: 26px;
  color: #777;
  cursor: pointer;
  z-index: 10;
  transition: color 0.3s;

  &:hover {
    color: #fff;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 50px 40px;
  border-radius: 24px;
  text-align: center;
  width: 90%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  transform: translateY(40px);
  opacity: 0;
  transition: all 0.6s ease;

  &.visible {
    transform: translateY(0);
    opacity: 1;
  }
`;

const LottieBox = styled.div`
  width: 160px;
  height: 160px;
  margin: 0 auto 30px;
  filter: drop-shadow(0 0 24px #32d74b);
`;

const Heading = styled.h1`
  font-size: 2rem;
  color: #fff;
  font-weight: 600;
  margin-bottom: 10px;
`;

const Text = styled.p`
  color: #bbb;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const CTA = styled.button`
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 500;
  background: #32d74b;
  color: #000;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #28c840;
  }
`;


export default SuccessPage;
