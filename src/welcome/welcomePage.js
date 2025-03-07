import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import confettiAnimation from './confettie.json'; // 🎉 Add animation file
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Welcome = () => {
    const [transition, setTransition] = useState('');
    const nav = useNavigate();

    useEffect(() => {
        setTransition('show');
    }, []);

    return (
        <Wrapper className={transition}>
            {/* 🎉 Soft Confetti Animation */}
            <LottieWrapper>
                <Lottie animationData={confettiAnimation} loop={true} />
            </LottieWrapper>

            <Title>Welcome to Edusify!</Title>
            <Subtitle>You've taken the first step towards better learning. Let's go! ✨</Subtitle>

            <Button onClick={() => nav('/')}>Start Learning →</Button>
        </Wrapper>
    );
};

export default Welcome;

// Styled Components
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: #FAF3E0; // 🌿 Soft warm beige
    color: #2D3748;
    text-align: center;
    padding: 20px;
`;

const LottieWrapper = styled.div`
    width: 140px;
    height: 140px;
    margin-bottom: 20px;
`;

const Title = styled.h1`
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #2D3748; // Muted navy
`;

const Subtitle = styled.p`
    font-size: 16px;
    color: #6B7280; // Soft gray-blue
    margin-bottom: 25px;
`;

const Button = styled.button`
    background: #A68DAD; // 💜 Muted Lavender - Premium & Soft
    color: white;
    border: none;
    padding: 14px 40px;
    font-size: 17px;
    font-weight: 500;
    border-radius: 30px;
    cursor: pointer;
    box-shadow: 0px 5px 15px rgba(166, 141, 173, 0.3);
    transition: all 0.3s ease-in-out;
    
    &:hover {
        background: linear-gradient(to right, #A68DAD, #90789B); // Soft gradient hover
        transform: scale(1.05);
    }
`;
