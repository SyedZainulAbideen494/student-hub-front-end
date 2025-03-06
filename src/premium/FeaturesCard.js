import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaMagic, FaTasks, FaClipboardCheck, FaBrain, FaFileAlt, FaRegClock, 
  FaStickyNote, FaLightbulb, FaUsers, FaCalendarAlt, FaLock, FaChartBar, FaStopwatch, 
  FaFilePdf, FaImage, FaLayerGroup, 
  FaChartLine,
  FaPlayCircle,
  FaCommentDots,
  FaBookOpen,
  FaFileInvoice
} from 'react-icons/fa';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const BackButton = styled.button`
  background: transparent;
  color: black;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: #5633A7;
  }
`;

const FeaturesWrapper = styled.div`

`;

const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  color: #3D2C8D;
  margin-bottom: 1rem;
  text-align: center;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  color: #2E1A47;
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(200, 200, 200, 0.4);

  &:last-child {
    border-bottom: none;
  }
`;

const IconWrapper = styled.span`
  font-size: 1.2rem;
  color: #6F42C1;
  margin-right: 12px;
`;

const FeaturesPage = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>

<FeaturesWrapper>
   {/*  <Title>The Ultimate Study Ecosystem</Title> */}
  <FeatureList>

    {/* 🚀 PREMIUM BENEFITS - EXCLUSIVITY & FOMO 🔥 */}
    <FeatureItem><IconWrapper><FaMagic /></IconWrapper> <strong>Unlimited AI Usage – No Limits, No Restrictions! 🔥</strong></FeatureItem>
    <FeatureItem><IconWrapper><FaBrain /></IconWrapper> <strong>Unlimited AI Quizzes, Flashcards & Mind Maps</strong></FeatureItem>
    <FeatureItem><IconWrapper><FaFilePdf /></IconWrapper> <strong>AI-Powered PDF to Quiz, Flashcards, Mind Maps & Notes</strong></FeatureItem>
    <FeatureItem><IconWrapper><FaClipboardCheck /></IconWrapper> <strong>AI Notes Creation – Generate Any Study Material Instantly</strong></FeatureItem>
    <FeatureItem><IconWrapper><FaTasks /></IconWrapper> <strong>Unlimited Study Plans – Adapt to Your Learning Needs</strong></FeatureItem>
    <FeatureItem><IconWrapper><FaRegClock /></IconWrapper> <strong>Generate Tasks According to Your Study Plan</strong></FeatureItem>
    <FeatureItem><IconWrapper><FaLightbulb /></IconWrapper> <strong>AI-Powered Task Generation – Smart, Personalized & Efficient</strong></FeatureItem>
    <FeatureItem><IconWrapper><FaChartLine /></IconWrapper> <strong>AI Quiz Analysis – Know Your Strengths & Weaknesses</strong></FeatureItem>
    <FeatureItem><IconWrapper><FaStopwatch /></IconWrapper> <strong>AI Competitive Exam Quizzes – NEET, JEE & More</strong></FeatureItem>
    <FeatureItem><IconWrapper><FaBookOpen /></IconWrapper> <strong>Exclusive Study Resources – Currently featuring NEET Guide</strong></FeatureItem>
    <FeatureItem><IconWrapper><FaBrain /></IconWrapper> <strong>AI-Generated Responses for Tasks, Mind Maps, Quizzes & Flashcards</strong></FeatureItem>
    <FeatureItem><IconWrapper><FaFileInvoice /></IconWrapper> <strong>Unlimited AI Assignment Generation – Get Your Work Done Instantly</strong></FeatureItem>

    {/* 🚀 FOMO Trigger */}
    <FeatureItem style={{ textAlign: 'center', fontWeight: 'bold', color: '#6F42C1', fontSize: '1.1rem', paddingTop: '1rem' }}>
      ...and SO MUCH MORE! 🚀🔥<br/> Upgrade to Edusify Premium & Unlock Your Full Potential!  
    </FeatureItem>
  </FeatureList>
</FeaturesWrapper>

    </PageWrapper>
  );
};

export default FeaturesPage;
