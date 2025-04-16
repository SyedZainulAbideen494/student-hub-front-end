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
  max-width: 520px;
  padding: 26px;
  margin: 20px auto;
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(20, 20, 20, 0.85), rgba(10, 10, 10, 0.75));
  border: 1px solid rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  box-shadow:
    inset 0 0 0.5px rgba(255, 255, 255, 0.03),
    0 20px 40px rgba(0, 0, 0, 0.6),
    0 0 1px rgba(255, 255, 255, 0.02);
  color: #f4f4f4;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease-in-out;
`;

const TextContent = styled.div`
  margin-bottom: 18px;

  h3 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
    color: #ffffff;
    text-shadow: 0 0 2px rgba(255, 255, 255, 0.05);
  }

  p {
    font-size: 15px;
    color: #cfcfcf;
    line-height: 1.6;
    margin-bottom: 6px;
  }

  .cta-text {
    margin-top: 12px;
    font-weight: 600;
    font-size: 15.5px;
    color: #eaeaea;

    span {
      color: #7fc8ff;
      font-weight: 700;
      text-shadow: 0 0 4px rgba(127, 200, 255, 0.2);
    }
  }
`;

const ViewGuideButton = styled.button`
  padding: 12px 26px;
  font-size: 14.5px;
  font-weight: 600;
  background: linear-gradient(135deg, #3333ff, #9966ff);
  color: #fff;
  border: none;
  border-radius: 16px;
  box-shadow:
    0 10px 30px rgba(153, 102, 255, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px) scale(1.01);
    opacity: 0.95;
    box-shadow:
      0 12px 34px rgba(153, 102, 255, 0.35),
      0 3px 10px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: scale(0.97);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5) inset;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  color: #aaa;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;
