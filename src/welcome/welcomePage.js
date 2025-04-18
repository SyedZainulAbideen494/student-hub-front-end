import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Elegant fade-in + lift
const fadeUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(28px) scale(0.985);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background: #0b0b0f;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  box-sizing: border-box;
`;

const Content = styled.div`
  text-align: center;
  max-width: 620px;
  width: 100%;
  animation: ${fadeUp} 1s ease-out forwards;
  opacity: 0;
`;

const Title = styled.h1`
  font-size: clamp(2.6rem, 6vw, 3.8rem);
  font-weight: 600;
  letter-spacing: -0.4px;
  line-height: 1.2;
  color: #ffffff;
  background: linear-gradient(120deg, #ffffff, #cfcfcf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 24px;
`;

const Subtitle = styled.p`
  font-size: clamp(1.15rem, 2.1vw, 1.3rem);
  color: #9b9ba1;
  line-height: 1.7;
  margin: 0 auto 48px auto;
  max-width: 92%;
  font-weight: 400;
`;

const Button = styled.button`
  padding: 16px 38px;
  font-size: 1.08rem;
  background: rgba(255, 255, 255, 0.035);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  letter-spacing: 0.2px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.065);
    transform: translateY(-2px);
    box-shadow: 0 14px 38px rgba(0, 0, 0, 0.45);
  }

  &:active {
    transform: scale(0.985);
    background: rgba(255, 255, 255, 0.025);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
`;

const Welcome = () => {
  const nav = useNavigate();

  return (
    <Wrapper>
      <Content>
       <Title>Welcome to your smarter study era</Title>

<Subtitle>
You’ve just unlocked the next level of learning. <br/>
Let’s build an AI-powered plan that works exactly the way you do. <br/>
Because focus should feel effortless.
</Subtitle>

<Button onClick={() => nav('/flow-user-data')}>
  Build My Smart Study Plan
</Button>

      </Content>
    </Wrapper>
  );
};

export default Welcome;
