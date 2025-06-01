import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 6px #0a84ff;
  }
  50% {
    box-shadow: 0 0 12px #0a84ff;
  }
`;

const Banner = styled.div`
  background: #1c1c1e;
  color: #e5e5ea;
  border-radius: 12px;
  padding: 16px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  max-width: 360px;
  width: 90%;
  margin: 24px auto;
  box-shadow: 0 6px 18px rgba(10, 132, 255, 0.3);
  user-select: none;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &:hover {
    box-shadow: 0 10px 25px rgba(10, 132, 255, 0.6);
  }

  @media (max-width: 480px) {
    padding: 18px 28px;
    max-width: 100%;
  }
`;

const Dot = styled.span`
  width: 16px;
  height: 16px;
  background: #0a84ff;
  border-radius: 50%;
  animation: ${pulse} 2.5s infinite ease-in-out;
  margin-bottom: 8px;
`;

const TextMain = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #e5e5ea;
  margin-bottom: 4px;
  white-space: normal;
`;

const CountdownText = styled.span`
  font-weight: 700;
  color: #0a84ff;
  font-size: 20px;
  letter-spacing: 0.03em;
  font-feature-settings: "tnum";
`;

const TextSub = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #a1a1a1;
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
    <Banner onClick={() => (window.location.href = "/subscription")}>
      <Dot />
      <TextMain>
        Prices increase in <CountdownText>{daysLeft} day{daysLeft > 1 ? "s" : ""}</CountdownText>.
      </TextMain>
      <TextSub>Lock in your subscription now at the best rate before it’s too late!</TextSub>
    </Banner>
  );
}
