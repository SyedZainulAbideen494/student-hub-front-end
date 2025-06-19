import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  background: linear-gradient(145deg, #0a0a0a, #141414); // darker, smoother
  color: #f2f2f2;
  border-radius: 24px;
  padding: 48px 32px;
  max-width: 720px;
  margin: 40px auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
`;

const Button = styled.button`
  background: linear-gradient(to right, #1c1c1c, #2a2a2a);
  border: 1px solid #333333;
  color: #ffffff;
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 16px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  margin: 0 auto;
  display: block;

  &:hover {
    background: linear-gradient(to right, #2e2e2e, #3a3a3a);
    transform: scale(1.03);
    box-shadow: 0 0 12px #ffffff11;
  }
`;

const Features = styled.div`
  margin-top: 32px;
  animation: ${fadeIn} 0.5s ease-out;
  line-height: 1.8;
  font-size: 1.05rem;
  color: #dddddd;
`;

const FeatureItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #2c2c2c;
`;

const Divider = styled.div`
  height: 1px;
  background: #2c2c2c;
  margin: 24px 0;
`;

const Highlight = styled.span`
  color: #ffffff;
  font-weight: 700;
`;


const PremiumCTA = () => {
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <Section>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '16px', textAlign: 'center' }}>
        Edusify Premium. For those who study to win.
      </h2>
      <p style={{ textAlign: 'center', fontSize: '1rem', color: '#c7c7c7', maxWidth: '520px', margin: '0 auto 32px' }}>
        You're already ahead. But Premium takes you beyond. Because studying like a topper is no longer a secret.
      </p>
      <Button onClick={() => setShowFeatures(!showFeatures)}>
        {showFeatures ? 'Hide Premium Benefits' : 'Unlock Premium – Study Like You’re Built Different'}
      </Button>

      {showFeatures && (
        <Features>
          <Divider />
          <FeatureItem>✨ <Highlight>AI notes</Highlight> that sound like a topper made them</FeatureItem>
          <FeatureItem>✨ <Highlight>Predicted questions</Highlight> before your teacher even finishes the chapter</FeatureItem>
          <FeatureItem>✨ <Highlight>Study plan</Highlight> so precise, it’s like having your own personal rank coach</FeatureItem>
          <FeatureItem>✨ <Highlight>Stats</Highlight> so clean, you’ll want to screenshot them</FeatureItem>
          <FeatureItem>✨ <Highlight>Edusify badge.</Highlight> Real ones know.</FeatureItem>
          <Divider />
          <p style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '0.95rem', color: '#bbbbbb' }}>
            Thousands use Edusify. <br />
            The top 1% don’t just use it. <br />
            <Highlight>They own it.</Highlight>
          </p>
        </Features>
      )}
    </Section>
  );
};

export default PremiumCTA;
