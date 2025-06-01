import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 4px #0a84ff;
  }
  50% {
    box-shadow: 0 0 10px #0a84ff;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 16px;
`;

const Banner = styled.div`
  background: #1c1c1e;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(10, 132, 255, 0.3);
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  width: 100%;
  max-width: 360px;
  transition: box-shadow 0.3s ease;

  @media (max-width: 480px) {
    padding: 14px 16px;
    max-width: 92%;
  }
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  background: #0a84ff;
  border-radius: 50%;
  animation: ${pulse} 2s infinite ease-in-out;
  flex-shrink: 0;
`;

const TextSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Line1 = styled.div`
  font-size: 14px;
  color: #e5e5ea;
  font-weight: 500;
`;

const CountdownText = styled.span`
  color: #0a84ff;
  font-weight: 600;
  font-feature-settings: "tnum";
`;

const Line2 = styled.div`
  font-size: 12.5px;
  color: #b0b0b0;
  margin-top: 2px;
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
    <Wrapper>
      <Banner>
        <Dot />
        <TextSection>
          <Line1>
            Price increases in{" "}
            <CountdownText>
              {daysLeft} day{daysLeft > 1 ? "s" : ""}
            </CountdownText>
          </Line1>
          <Line2>Buy before the hike and save big.</Line2>
        </TextSection>
      </Banner>
    </Wrapper>
  );
}
