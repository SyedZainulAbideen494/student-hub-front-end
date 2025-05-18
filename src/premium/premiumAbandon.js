// PremiumReminder.js
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PageWrapper = styled.div`
  background: #0f0f0f;
  color: #f5f5f5;
  padding: 50px 24px 140px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
`;

const Badge = styled.div`
  background: #8a56d9;
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
  margin-bottom: 20px;
  color: white;
  user-select: none;
`;

const Header = styled.h1`
  font-size: 30px;
  margin-bottom: 14px;
  font-weight: 800;
`;

const SubText = styled.p`
  font-size: 16px;
  color: #b5b5b5;
  margin-bottom: 38px;
  max-width: 380px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.4;
`;

const Benefits = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 460px;
  margin: 0 auto 50px;
`;

const Benefit = styled.div`
  background: #1c1c1c;
  border-radius: 14px;
  padding: 18px 22px;
  text-align: left;
  font-size: 15px;
  color: #ddd;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border: 1.5px solid #2f2f2f;
  box-shadow: 0 0 12px rgba(138, 86, 217, 0.15);

  &::before {
    content: '🔥';
    font-size: 20px;
    margin-bottom: 6px;
  }

  strong {
    font-weight: 700;
    color: #f0e6ff;
  }

  small {
    font-size: 13.5px;
    color: #aaa;
    font-style: italic;
  }
`;

const TestimonialBox = styled(motion.div)`
  background: #191919;
  padding: 22px;
  margin: 12px auto 48px;
  max-width: 420px;
  border-radius: 14px;
  font-size: 14px;
  color: #bbb;
  font-style: italic;
  line-height: 1.65;
  box-shadow: 0 0 24px rgba(138, 86, 217, 0.12);
  user-select: none;
`;

const StatsBox = styled.div`
  font-size: 15px;
  color: #999;
  margin-bottom: 50px;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  position: fixed;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 440px;
  padding: 0 20px;
  display: flex;
  gap: 16px;
  box-sizing: border-box;
`;

const ButtonPrimary = styled.button`
  flex: 1;
  background: linear-gradient(90deg, #a88beb 0%, #7f56d9 100%);
  border: none;
  padding: 12px 0;
  border-radius: 28px;
  color: white;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(127, 86, 217, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.06);
    box-shadow: 0 14px 35px rgba(127, 86, 217, 0.5);
  }
`;

const ButtonSecondary = styled.button`
  flex: 1;
  background: transparent;
  border: 2.5px solid #7f56d9;
  padding: 12px 0;
  border-radius: 28px;
  color: #7f56d9;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;

  &:hover {
    background-color: #7f56d9;
    color: white;

    border-color: #7f56d9;
  }
`;


const testimonials = [
  `"Premium isn’t just an upgrade — it’s the mindset of a winner. Feel unstoppable every time you open Edusify." — Aarav M., 12th CBSE`,
  `"Being Premium means I own my success. It’s confidence, focus, and that edge others only dream of." — Shruti R., NEET 2024`,
  `"This is more than studying. It’s pride in how I prepare, a lifestyle I’m proud to show off." — Rahul K., JEE Aspirant`,
];

const PremiumReminder = () => {
  const navigate = useNavigate();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Badge>TOPPER'S CHOICE</Badge>
        <Header>Wait! Are You Ready To Own Your Success?</Header>
        <SubText>
          The Premium experience transforms not just your study, but your confidence, your focus, and your future.
          Join the league of those who don't just dream — they achieve.
        </SubText>
      </motion.div>

      <Benefits>
        <Benefit>
          <strong>Feel unstoppable every day.</strong>
          <small>Instant clarity and laser focus so you own every exam.</small>
        </Benefit>
        <Benefit>
          <strong>Study smart, not just hard.</strong>
          <small>Get the edge with proven strategies and tools designed for winners.</small>
        </Benefit>
        <Benefit>
          <strong>Join an exclusive community.</strong>
          <small>Surround yourself with ambitious achievers and get inspired daily.</small>
        </Benefit>
        <Benefit>
          <strong>Celebrate your progress.</strong>
          <small>Watch your confidence grow as you crush your goals one by one.</small>
        </Benefit>
      </Benefits>

      <TestimonialBox
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {testimonials[index]}
      </TestimonialBox>

      <StatsBox>💡 Nearly 8 out of 10 top scorers choose Premium for their success journey.</StatsBox>

<ButtonGroup>
  <ButtonPrimary onClick={() => navigate('/subscription')}>
    Get Premium Now
  </ButtonPrimary>
  <ButtonSecondary onClick={() => navigate('/')}>
    I’ll keep struggling
  </ButtonSecondary>
</ButtonGroup>

    </PageWrapper>
  );
};

export default PremiumReminder;
