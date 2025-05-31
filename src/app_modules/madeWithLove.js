import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Footer = styled.footer`
  width: 100%;
  padding: 12px 0;
  margin-bottom: 90px;
  text-align: center;
  font-size: 0.85rem;
  color: #8e8e93; // softer Apple-style gray
  font-weight: 500;
  background-color: transparent;
  letter-spacing: 0.3px;
  animation: ${fadeIn} 0.6s ease-out;
  transition: color 0.3s ease;

  a {
    color: #007aff;
    text-decoration: none;
    margin-left: 4px;
    font-weight: 600;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.7;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.78rem;
  }
`;

const MadeWithLove: React.FC = () => {
  return (
    <Footer>
      Made with ❤️ by&nbsp;
      <a
        href="https://instagram.com/_syed_zain_ul"
        target="_blank"
        rel="noopener noreferrer"
      ><br/>
        Syed Zain-ul Abideen
      </a>
    </Footer>
  );
};

export default MadeWithLove;
