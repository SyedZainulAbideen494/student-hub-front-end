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
  padding: 3rem 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #0b0b0b, #141414);
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem;
  font-weight: 600;
  color: #f3f3f3;
  text-align: center;
  margin-bottom: 0.7rem;
`;

const Subtitle = styled.p`
  font-size: 1.15rem;
  color: #a291ff;
  text-align: center;
  margin-bottom: 2.2rem;
  font-weight: 500;
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
  font-size: 1.05rem;
  font-weight: 500;
  color: #e0dffe;
  padding: 0.95rem 1rem;
  background: #181818;
  border-radius: 14px;
  transition: all 0.25s ease;
  border-left: 4px solid #7b5eff;
  box-shadow: 0 4px 14px rgba(120, 90, 240, 0.05);

  &:hover {
    background: #1f1f1f;
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.span`
  font-size: 1.4rem;
  margin-right: 14px;
  background: linear-gradient(135deg, #a58fff, #d3bfff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.3s ease;

  ${FeatureItem}:hover & {
    transform: scale(1.1);
    filter: brightness(1.3);
  }
`;

const CallToAction = styled.div`
  margin-top: 2.5rem;
  text-align: center;
  color: #c6b4ff;
  font-size: 1.15rem;
  font-weight: 600;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(200, 180, 255, 0.1);
  line-height: 1.7;
`;

const Badge = styled.div`
  font-size: 0.85rem;
  background: #251d3c;
  padding: 4px 10px;
  color: #c6b8ff;
  border-radius: 20px;
  font-weight: 600;
  margin-bottom: 1rem;
`;
const NextButton = styled.button`
  margin-top: 3rem;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #7B5EFF, #A78BFA);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(123, 94, 255, 0.25);

  &:hover {
    background: linear-gradient(135deg, #9478ff, #bba1ff);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(123, 94, 255, 0.35);
  }
`;

const FeaturesPage = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Title>Everything You’ve Ever Wanted in a Study App</Title>
      <Badge>Only available on Edusify Premium</Badge>
      <Subtitle>
        Edusify Premium gives you elite tools, unlimited AI, and the power to study 10x smarter.
      </Subtitle>

      <FeatureList>
  {/* 1. Hook features: instant value & top AI features */}
  <FeatureItem><IconWrapper><FaMagic /></IconWrapper> <strong>Unlimited AI Usage</strong> – No Limits. No Caps. Just Pure Power 🔥</FeatureItem>
  <FeatureItem><IconWrapper><FaClipboardCheck /></IconWrapper> <strong>Generate Smart Notes Instantly</strong> – Any Topic, Any Time</FeatureItem>
  <FeatureItem><IconWrapper><FaFilePdf /></IconWrapper> <strong>Convert Any PDF</strong> to Quizzes, Notes & Mind Maps in Seconds</FeatureItem>
  <FeatureItem><IconWrapper><FaBrain /></IconWrapper> <strong>AI Quizzes, Flashcards & Mind Maps</strong> – Fully Unlocked</FeatureItem>

  {/* 2. Study planning features */}
  <FeatureItem><IconWrapper><FaTasks /></IconWrapper> <strong>Personalized Study Plans</strong> – Tailored to Your Goals</FeatureItem>
  <FeatureItem><IconWrapper><FaRegClock /></IconWrapper> <strong>Auto Daily Study Tasks</strong> – Your Day, Sorted</FeatureItem>
  <FeatureItem><IconWrapper><FaLightbulb /></IconWrapper> <strong>AI Task Generation</strong> – Adaptive, Just Like You</FeatureItem>

  {/* 3. Competitive prep & performance features */}
  <FeatureItem><IconWrapper><FaStopwatch /></IconWrapper> <strong>Competitive Exam Tools</strong> – NEET, JEE, Boards & More</FeatureItem>
  <FeatureItem><IconWrapper><FaChartLine /></IconWrapper> <strong>Quiz Insights</strong> – Spot Your Strengths & Fix Weaknesses</FeatureItem>
  <FeatureItem><IconWrapper><FaFileInvoice /></IconWrapper> <strong>AI Assignment Maker</strong> – Work Done, Stress Gone</FeatureItem>
  <FeatureItem><IconWrapper><FaUsers /></IconWrapper> <strong>Study Rooms</strong> – Learn Together. Win Together</FeatureItem>

  {/* 4. Creativity & aesthetics */}
  <FeatureItem><IconWrapper><FaImage /></IconWrapper> <strong>AI Image Generator</strong> – Turn Concepts into Visual Gold</FeatureItem>
  <FeatureItem><IconWrapper><FaStickyNote /></IconWrapper> <strong>Aesthetic Notes Generator</strong> – You’ll Want to Re-read Them 😍</FeatureItem>
  <FeatureItem><IconWrapper><FaLayerGroup /></IconWrapper> <strong>Mind Maps Powered by AI</strong> – Visualize Topics Like a Genius</FeatureItem>

  {/* 5. Resource & guidance */}
  <FeatureItem><IconWrapper><FaBookOpen /></IconWrapper> <strong>Exclusive NEET Guide</strong> & Other Premium Resources</FeatureItem>
  <FeatureItem><IconWrapper><FaFileAlt /></IconWrapper> <strong>Resource Finder</strong> – Edusify Hunts the Best for You</FeatureItem>

  {/* 6. Monitoring & reporting */}
  <FeatureItem><IconWrapper><FaChartBar /></IconWrapper> <strong>Smart Dashboard</strong> – Your Study Progress at a Glance</FeatureItem>
  <FeatureItem><IconWrapper><FaFileInvoice /></IconWrapper> <strong>AI Reports</strong> – Break Down Topics into Simple Wins</FeatureItem>

  {/* 7. Security & exclusivity */}
  <FeatureItem><IconWrapper><FaLock /></IconWrapper> <strong>Document Locker</strong> – Private. Secure. Always Within Reach</FeatureItem>
</FeatureList>

      <CallToAction>
        This isn’t just studying.
        <br />
        <strong>This is what the top 1% use to stay ahead.</strong>
        <br />
        <span style={{ fontSize: '0.9rem', color: '#9b8add' }}>
          You can keep guessing — or join the students who don’t need to.
        </span>
      </CallToAction>
      <NextButton onClick={() => navigate('/subscription')}>
  Next →
</NextButton>

    </PageWrapper>
  );
};

export default FeaturesPage;
