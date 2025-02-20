import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const GuideBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  if (!isVisible) return null;

  return (
    <BannerWrapper>
      <CloseButton onClick={() => setIsVisible(false)}>✕</CloseButton>

      <TextContent>
        <h3>NEET Most Repeated Questions Guide</h3>
        <p>
          Find the most asked NEET questions from 2015-2024,  
          discover high-yield topics, and boost your score  
          with AI-powered strategies.
        </p>
        <p className="cta-text">Find me in the <span>Find Resources</span> section!</p>
      </TextContent>

      <ViewGuideButton onClick={() => navigate("/guide/neet")}>
        View Guide
      </ViewGuideButton>
    </BannerWrapper>
  );
};

export default GuideBanner;

const BannerWrapper = styled.div`
  width: 80%;
  max-width: 500px;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(12px);
  color: white;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  margin: 10px auto;  /* Centers it inside the parent */
`;

const TextContent = styled.div`
  text-align: center;
  margin-bottom: 16px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #ffffff;
  }

  p {
    font-size: 14px;
    color: #ccc;
    margin-bottom: 6px;
    line-height: 1.4;
  }

  .cta-text {
    font-size: 15px;
    font-weight: 500;
    color: #fff;
    margin-top: 8px;
  }

  .cta-text span {
    color: #00dbde;
    font-weight: 600;
  }
`;

const ViewGuideButton = styled.button`
  background: linear-gradient(135deg, #00dbde, #fc00ff);
  border: none;
  color: white;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.85;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    color: white;
  }
`;
