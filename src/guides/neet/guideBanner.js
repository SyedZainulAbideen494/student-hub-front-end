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
        <p className="cta-text">Find me in the <span>Resources Finder</span> section!</p>
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
  background: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(14px);
  color: #f2f2f2;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  margin: 10px auto;
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const TextContent = styled.div`
  text-align: center;
  margin-bottom: 16px;

  h3 {
    font-size: 18.5px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #fff;
  }

  p {
    font-size: 14.5px;
    color: #ccc;
    margin-bottom: 6px;
    line-height: 1.6;
  }

  .cta-text {
    font-size: 15px;
    font-weight: 500;
    color: #eee;
    margin-top: 10px;
  }

  .cta-text span {
    color: #76c7ff;
    font-weight: 600;
  }
`;

const ViewGuideButton = styled.button`
  background: linear-gradient(135deg, #3333ff, #9966ff);
  border: none;
  color: white;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 18px rgba(153, 102, 255, 0.3);

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  color: #999;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    color: #333;
  }
`;

