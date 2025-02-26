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
  FaBookOpen
} from 'react-icons/fa';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85%;
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
  width: 90%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: left;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(230, 230, 230, 0.7);
  
  @media (max-width: 768px) {
    width: 90%;
    padding: 1.2rem;
  }
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
      <BackButton onClick={() => navigate(-1)}>←</BackButton>

      <FeaturesWrapper>
        <Title>✨ The Ultimate Study Ecosystem</Title>
        <FeatureList>
  <FeatureItem><IconWrapper><FaMagic /></IconWrapper> <strong>AI-Powered Study Plan</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaTasks /></IconWrapper> <strong>Smart Task Tracker</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaLayerGroup /></IconWrapper> <strong>Convert Notes into Mind Maps, Quizzes & Flashcards</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaClipboardCheck /></IconWrapper> <strong>AI Mind Maps, Flashcards, Notes & Quizzes</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaBrain /></IconWrapper> <strong>AI Study Assistant</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaFileAlt /></IconWrapper> <strong>Convert PDFs into Notes, Mind Maps, Quizzes & Flashcards</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaFilePdf /></IconWrapper> <strong>Generate Quizzes & Mind Maps from PDFs</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaStickyNote /></IconWrapper> <strong>Sticky Notes for Quick Thoughts</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaLightbulb /></IconWrapper> <strong>Find Best Study Resources</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaUsers /></IconWrapper> <strong>Join Study Rooms</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaStopwatch /></IconWrapper> <strong>Competitive Exam Mock Tests</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaChartBar /></IconWrapper> <strong>AI Weekly Performance Report</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaCalendarAlt /></IconWrapper> <strong>Smart Calendar & To-Do List</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaRegClock /></IconWrapper> <strong>AI-Powered Pomodoro Timer</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaLock /></IconWrapper> <strong>Secure Document Locker</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaImage /></IconWrapper> <strong>AI Assistant Processes PDFs & Images</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaChartLine /></IconWrapper> <strong>AI Quiz Performance Report</strong></FeatureItem>
  <FeatureItem><IconWrapper><FaBookOpen /></IconWrapper> <strong>AI Explanation on Each Flashcard</strong></FeatureItem>

  {/* 🚀 FOMO Trigger */}
  <FeatureItem style={{ textAlign: 'center', fontWeight: 'bold', color: '#6F42C1', fontSize: '1.1rem', paddingTop: '1rem' }}>
    ...and SO much more! 🚀🔥
  </FeatureItem>
</FeatureList>

      </FeaturesWrapper>
    </PageWrapper>
  );
};

export default FeaturesPage;
