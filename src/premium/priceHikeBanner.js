import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 4px #0a84ff;
  }
  50% {
    box-shadow: 0 0 8px #0a84ff;
  }
`;

const BannerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 16px;
  margin-bottom: 20px;
`;

const Banner = styled.div`
  background: #1c1c1e;
  color: #e5e5ea;
  border-radius: 10px;
  padding: 12px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 4px 12px rgba(10, 132, 255, 0.25);
  user-select: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &:hover {
    box-shadow: 0 8px 20px rgba(10, 132, 255, 0.45);
  }

  @media (max-width: 480px) {
    padding: 14px 20px;
    max-width: 92%;
  }
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  background: #0a84ff;
  border-radius: 50%;
  animation: ${pulse} 2.5s infinite ease-in-out;
  margin-bottom: 8px;
`;

const TextMain = styled.div`
  font-weight: 500;
  font-size: 15px;
  color: #e5e5ea;
`;

const CountdownText = styled.span`
  font-weight: 600;
  color: #0a84ff;
  font-size: 16px;
  font-feature-settings: "tnum";
  letter-spacing: 0.02em;
`;

const TextSub = styled.div`
  font-weight: 400;
  font-size: 13px;
  color: #b0b0b0;
  margin-top: 4px;
`;

export default function PriceHikeBanner() {
  const calculateDaysLeft = () => {
    const now = new Date();
    const target = new Date("2025-06-10T23:59:59");
    const diff = target - now;
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  };

  const [daysLeft, setDaysLeft] = useState(calculateDaysLeft());

  useEffect(() => {
    if (daysLeft === 0) return;
    const timer = setInterval(() => {
      setDaysLeft(calculateDaysLeft());
    }, 1000 * 60 * 60 * 24);
    return () => clearInterval(timer);
  }, [daysLeft]);

  if (daysLeft === 0) return null;

  return (
    <BannerWrapper>
      <Banner onClick={() => (window.location.href = "/subscription")}>
        <Dot />
        <TextMain>
          Prices increase in <CountdownText>{daysLeft} day{daysLeft > 1 ? "s" : ""}</CountdownText>
        </TextMain>
        <TextSub>Get it now before the price goes up.</TextSub>
      </Banner>
    </BannerWrapper>
  );
}
