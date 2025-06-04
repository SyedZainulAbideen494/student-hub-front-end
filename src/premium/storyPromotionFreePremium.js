import React from "react";
import styled, { keyframes } from "styled-components";
import PromoImg from '../images/story-edusify-free-premium.png';

// Smaller, sleek SVG icons with thinner strokes

const CameraIcon = () => (
  <svg width="20" height="20" fill="none" stroke="#0a84ff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ListIcon = () => (
  <svg width="18" height="18" fill="none" stroke="#0a84ff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <circle cx="3" cy="6" r="1"/>
    <circle cx="3" cy="12" r="1"/>
    <circle cx="3" cy="18" r="1"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" fill="none" stroke="#0a84ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{display: "block"}}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Animations
const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleUp = keyframes`
  0% {
    transform: scale(0.98);
    box-shadow: 0 4px 10px rgba(0, 122, 255, 0.2);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 8px 20px rgba(0, 122, 255, 0.4);
  }
`;

// Styled components (smaller, more minimal, more spacing)
const Container = styled.main`
  background-color: #0d0d0d;
  color: #e1e1e5;
  min-height: 100vh;
  padding: 60px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-rendering: optimizeLegibility;
  letter-spacing: 0.015em;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 14px;
  letter-spacing: -0.015em;
  text-align: center;
  color: #0a84ff;
  display: flex;
  align-items: center;
  gap: 12px;
  user-select: none;
  animation: ${fadeInUp} 0.6s ease forwards;
`;

const Divider = styled.div`
  width: 70px;
  height: 3px;
  background: linear-gradient(90deg, #5ac8fa, #007aff);
  border-radius: 12px;
  margin-bottom: 48px;
  box-shadow: 0 3px 14px rgba(0, 122, 255, 0.3);
  animation: ${fadeInUp} 0.8s ease forwards;
`;

const StoryImage = styled.img`
  width: 100%;
  max-width: 380px;
  border-radius: 20px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.8);
  margin-bottom: 40px;
  object-fit: contain;
  user-select: none;
  animation: ${fadeInUp} 1s ease forwards;
`;

const DownloadButton = styled.a`
  background: transparent;
  border: 2.5px solid #0a84ff;
  color: #0a84ff;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 14px 42px;
  border-radius: 14px;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 5px 14px rgba(10, 132, 255, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  user-select: none;
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.3s ease,
    border-color 0.3s ease;
  animation: ${fadeInUp} 1.2s ease forwards;

  &:hover {
    color: #60aaff;
    border-color: #60aaff;
    box-shadow: 0 10px 28px rgba(96, 170, 255, 0.5);
    transform: scale(1.06);
  }

  &:active {
    transform: scale(0.96);
  }
`;

const RulesSection = styled.section`
  max-width: 600px;
  background-color: #121212;
  padding: 32px 40px;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.85);
  line-height: 1.5;
  color: #babac1;
  width: 80%;
  font-weight: 400;
  font-size: 1rem;
  user-select: none;
  animation: ${fadeInUp} 1.4s ease forwards;
`;

const RulesTitle = styled.h2`
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 26px;
  color: #0a84ff;
  border-bottom: 1.8px solid #222222;
  padding-bottom: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 10px;
  user-select: none;
`;

const RuleList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
`;

const Rule = styled.li`
  position: relative;
  padding-left: 34px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 400;
  color: #babac1;

  & > strong {
    color: #e1e1e5;
    font-weight: 600;
  }
`;

const InstaFollow = styled.div`
  margin-top: 38px;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
  color: #0a84ff;
  user-select: none;
  letter-spacing: 0.025em;
  animation: ${fadeInUp} 1.6s ease forwards;

  a {
    color: #0a84ff;
    text-decoration: none;
    font-weight: 800;
    transition: color 0.3s ease;

    &:hover,
    &:focus {
      color: #60aaff;
      text-decoration: underline;
    }
  }
`;

const Tagline = styled.p`
  font-size: 1.15rem;
  font-weight: 500;
  color: #60aaff;
  margin: 8px 0 36px 0;
  letter-spacing: 0.035em;
  opacity: 0.9;
  user-select: none;
  animation: ${fadeInUp} 0.8s ease forwards;
  text-align: center;
`;


export default function StoryPromoPage() {
    return (
      <Container>
        <Title>
          Edusify
        </Title>
  
        <Tagline>
          Unlock your <strong>14-day free Premium trial</strong> — because your focus deserves nothing less than excellence.
        </Tagline>
  
        <Divider />
  
        <StoryImage src={PromoImg} alt="Edusify Story Template" />
  
        <DownloadButton
          style={{ marginBottom: '44px' }}
          href={PromoImg}
          download="edusify-story-template.png"
          aria-label="Download Edusify Story Template"
        >
          <DownloadIcon />
          Download Template
        </DownloadButton>
  
        <RulesSection>
          <RulesTitle>
     
            Promo Guidelines — 14 Days Premium Access
          </RulesTitle>
          <RuleList>
            <Rule><CheckIcon /> Download and share the official story template as-is.</Rule>
            <Rule><CheckIcon /> Showcase Edusify’s sleek, minimal black design featuring our official logo.</Rule>
            <Rule><CheckIcon /> Post on your Instagram Story and keep it visible for at least 24 hours.</Rule>
            <Rule><CheckIcon /> Tag <strong>@edusify.app</strong> so we can confirm your participation.</Rule>
            <Rule><CheckIcon /> Public Instagram accounts only. For private profiles, please DM a screenshot of your story.</Rule>
            <Rule><CheckIcon /> Minimum <strong>40 genuine followers</strong> required — no fake or spam accounts.</Rule>
            <Rule><CheckIcon /> One redemption per Instagram account.</Rule>
            <Rule><CheckIcon /> Accounts clearly used for fake promotions or farming will be excluded.</Rule>
            <Rule><CheckIcon /> Rewards are processed and delivered within 24 to 48 hours post-verification.</Rule>
          </RuleList>
        </RulesSection>
  
        <InstaFollow>
          Stay connected with us on Instagram:{" "}
          <a
            href="https://www.instagram.com/edusify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @edusify.app
          </a>
        </InstaFollow>
      </Container>
    );
  }