import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaMagic, FaTasks, FaClipboardCheck, FaBrain, FaFileAlt, FaRegClock,
  FaStickyNote, FaLightbulb, FaUsers, FaCalendarAlt, FaLock, FaChartBar, FaStopwatch,
  FaFilePdf, FaImage, FaLayerGroup,
  FaChartLine, FaPlayCircle, FaCommentDots, FaBookOpen, FaFileInvoice
} from 'react-icons/fa';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 1.5rem;
  max-width: 720px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: #3D2C8D;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #5e4b8b;
  text-align: center;
  margin-bottom: 2rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  color: #2E1A47;
  padding: 0.8rem 0.6rem;
  background: #f9f7fd;
  border-radius: 10px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(100, 50, 200, 0.05);

  &:hover {
    background: #f1edfd;
  }
`;

const IconWrapper = styled.span`
  font-size: 1.3rem;
  margin-right: 14px;
  background: linear-gradient(135deg, #6F42C1, #A066FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const CallToAction = styled.div`
  margin-top: 2.5rem;
  text-align: center;
  color: #6F42C1;
  font-size: 1.2rem;
  font-weight: 600;
  padding-top: 1rem;
  border-top: 1px solid rgba(100, 50, 200, 0.15);
`;

const FeaturesPage = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Title>Everything You’ve Ever Wanted in a Study App</Title>
      <Subtitle>Edusify Premium gives you elite tools, unlimited AI, and the power to study 10x smarter.</Subtitle>

      <FeatureList>
        <FeatureItem><IconWrapper><FaMagic /></IconWrapper> Unlimited AI Usage – No Limits, No Restrictions 🔥</FeatureItem>
        <FeatureItem><IconWrapper><FaBrain /></IconWrapper> AI Quizzes, Flashcards & Mind Maps – Unlocked Fully</FeatureItem>
        <FeatureItem><IconWrapper><FaFilePdf /></IconWrapper> Convert Any PDF to Quizzes, Notes, Mind Maps Instantly</FeatureItem>
        <FeatureItem><IconWrapper><FaClipboardCheck /></IconWrapper> Instantly Generate Notes on Any Topic with AI</FeatureItem>
        <FeatureItem><IconWrapper><FaTasks /></IconWrapper> Study Plans Customized Just for You</FeatureItem>
        <FeatureItem><IconWrapper><FaRegClock /></IconWrapper> Auto-Generate Daily Study Tasks Based on Your Plan</FeatureItem>
        <FeatureItem><IconWrapper><FaLightbulb /></IconWrapper> AI-Smart Task Generation – Adaptive & Personalized</FeatureItem>
        <FeatureItem><IconWrapper><FaChartLine /></IconWrapper> Quiz Analysis – Identify Strengths & Weaknesses</FeatureItem>
        <FeatureItem><IconWrapper><FaStopwatch /></IconWrapper> NEET, JEE, Boards & Competitive Quiz Generators</FeatureItem>
        <FeatureItem><IconWrapper><FaBookOpen /></IconWrapper> Exclusive Resources: NEET Guide, More Coming Soon</FeatureItem>
        <FeatureItem><IconWrapper><FaFileInvoice /></IconWrapper> AI Assignment Generation – Do More, Stress Less</FeatureItem>
      </FeatureList>

      <CallToAction>
        …and that’s just the beginning.  
        <br />
        <strong>Upgrade to Edusify Premium</strong> & unlock the ultimate study experience.  
        <br />
        <span style={{ fontSize: '0.95rem', color: '#2E1A47' }}>No trials. No shortcuts. Just results.</span>
      </CallToAction>
    </PageWrapper>
  );
};

export default FeaturesPage;
