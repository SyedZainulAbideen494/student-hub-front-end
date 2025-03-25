import React from "react";
import styled, { keyframes } from "styled-components";
import testimonials from "./testimonialsData"; // Import testimonials

const TestimonialsSection = () => {
  const shuffleArray = (array) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  const shuffledTestimonials = shuffleArray([...testimonials, ...testimonials]);

  return (
    <Section>
      <OverlayStars /> {/* Background Effect */}
      <Title>What Our Users Say</Title>
      <SliderWrapper>
        <Slider>
          {shuffledTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index}>
              <Text>{testimonial.text}</Text>
              <Name>— {testimonial.name}</Name>
            </TestimonialCard>
          ))}
        </Slider>
      </SliderWrapper>
    </Section>
  );
};

// Animation for smooth scrolling
const scrollAnimation = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-10%); }
`;

const starsAnimation = keyframes`
  0% { opacity: 0.6; transform: translateY(0); }
  50% { opacity: 0.9; transform: translateY(-10px); }
  100% { opacity: 0.6; transform: translateY(0); }
`;

// Styled Components
const Section = styled.section`
  padding: 80px 0;
  text-align: center;
  overflow: hidden;
  max-width: 100vw;
  position: relative;
`;

const Title = styled.h2`
  font-size: 25px;
  color: #fff;
  font-weight: 700;
  margin-bottom: 40px;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #ff6ec4, #7873f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SliderWrapper = styled.div`
  width: 85vw;
  max-width: 1000px;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
`;

const Slider = styled.div`
  display: flex;
  gap: 15px;
  width: fit-content;
  animation: ${scrollAnimation} 30s linear infinite;
  
  &:hover {
    animation-play-state: paused; /* Pause scrolling on hover */
  }
`;

const TestimonialCard = styled.div`
  width: 300px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 24px;
  flex-shrink: 0;
  text-align: left;
  position: relative;
  height: auto; /* Auto height to ensure name is always visible */
  max-height: 120px; /* Ensures enough space for text + name */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid rgba(255, 255, 255, 0.15);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 30px rgba(255, 255, 255, 0.2);
  }
`;

const Text = styled.p`
  font-size: 16px;
  color: #e0e0e0;
  font-weight: 500;
  line-height: 1.6;
  flex-grow: 1;
`;

const Name = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  opacity: 0.9;
  text-align: right;
  display: block;
  padding-top: 12px;
  border-top: 1px none;
`;

// Floating Stars Animation
const OverlayStars = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0.2;
  animation: ${starsAnimation} 6s infinite ease-in-out;
`;

export default TestimonialsSection;
