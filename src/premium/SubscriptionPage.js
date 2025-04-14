import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import {
  FaMagic, FaTasks, FaClipboardCheck, FaBrain, FaFileAlt, FaRegClock,
  FaStickyNote, FaLightbulb, FaUsers, FaCalendarAlt, FaLock, FaChartBar, FaStopwatch,
  FaFilePdf, FaImage, FaLayerGroup,
  FaChartLine, FaPlayCircle, FaCommentDots, FaBookOpen, FaFileInvoice
} from 'react-icons/fa';
import { API_ROUTES } from "../app_modules/apiRoutes";
import TestimonialsSection from "./testimonials";

// Styled Components
const Wrapper = styled.div`
  background: linear-gradient(135deg, #F8F6FF, #ECE6FF);
  color: #1c1c1e;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ScrollContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 40px 20px 80px;
  display: flex;
  justify-content: center;
`;

const SubscriptionContainer = styled.div`
  width: 100%;
  max-width: 460px;
  text-align: center;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  padding: 45px 30px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 18px;
  color: #2D1E64;
  letter-spacing: 0.5px;
  line-height: 1.3;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #5C4A99;
  margin-bottom: 32px;
  line-height: 1.8;
  font-weight: 500;
`;

const Plans = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 35px;
`;

const PlanBox = styled.div`
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  border: 2px solid ${(props) => (props.active ? "#7F56D9" : "#d1d1d6")};
  width: 150px;
  background: ${(props) =>
    props.active ? "rgba(127, 86, 217, 0.12)" : "rgba(255, 255, 255, 0.05)"};
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.active ? "0 0 14px rgba(127, 86, 217, 0.25)" : "none"};

  &:hover {
    border-color: #7F56D9;
    background: rgba(127, 86, 217, 0.14);
    transform: translateY(-3px);
  }

  h4 {
    font-size: 16px;
    margin-bottom: 6px;
    color: #2D1E64;
  }

  p {
    font-size: 14px;
    color: #6e6e73;
  }
`;

const BestOfferTag = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #7F56D9;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(127, 86, 217, 0.5);
`;

const SmallText = styled.p`
  font-size: 12px;
  color: #8e8e93;
  margin-top: 5px;
`;

const Button = styled.button`
  background: #7F56D9;
  color: white;
  border: none;
  padding: 16px 42px;
  font-size: 17px;
  border-radius: 50px;
  font-weight: 600;
  width: 100%;
  max-width: 320px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(127, 86, 217, 0.35);

  &:hover {
    box-shadow: 0 12px 30px rgba(127, 86, 217, 0.5);
    transform: translateY(-2px);
  }

  &:disabled {
    background: #d1d1d6;
    cursor: default;
    opacity: 0.6;
    box-shadow: none;
  }
`;

const Footer = styled.p`
  margin-top: 30px;
  font-size: 14px;
  color: #6e6e73;
  text-align: center;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #7F56D9;
  }
`;

const Divider = styled.div`
  height: 2px;
  width: 60px;
  background: #D6CFFF;
  margin: 60px auto 40px;
  border-radius: 10px;
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title2 = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 600;
  color: #2D1E64;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle2 = styled.p`
  font-size: 1.1rem;
  color: #5C4A99;
  text-align: center;
  margin-bottom: 2.2rem;
  font-weight: 500;
`;

const Badge = styled.div`
  font-size: 0.85rem;
  background: #DAD4FF;
  padding: 4px 10px;
  color: #4B3B8E;
  border-radius: 20px;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  font-size: 1.05rem;
  font-weight: 500;
  color: #322154;
  padding: 0.95rem 1rem;
  background: #F3F0FF;
  border-radius: 14px;
  transition: all 0.25s ease;
  border-left: 4px solid #B49CFF;
  box-shadow: 0 4px 14px rgba(120, 90, 240, 0.07);

  &:hover {
    background: #EBE3FF;
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.span`
  font-size: 1.4rem;
  margin-right: 14px;
  background: linear-gradient(135deg, #6F42C1, #A066FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const CallToAction = styled.div`
  margin-top: 2.5rem;
  text-align: center;
  color: #5E3ABF;
  font-size: 1.15rem;
  font-weight: 600;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(90, 60, 200, 0.15);
  line-height: 1.7;
`;

const DreamGlow = styled.h2`
  font-size: 2.5rem;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  background: linear-gradient(120deg, #9F63FF, #FFB1F9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 0.75rem;
  animation: glowIn 1.2s ease-out forwards;

  @keyframes glowIn {
    0% {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;


const PaymentComponent = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [isPremium, setIsPremium] = useState(null);
  const [step, setStep] = useState(1);


  // Handle Payment with Razorpay
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to subscribe.");
        return;
      }

    // Set pricing based on selected plan
let planAmount = 0;
if (selectedPlan === "daily") {
  planAmount = 8; // ₹8 → 800 paise
} else if (selectedPlan === "weekly") {
  planAmount = 39;
} else if (selectedPlan === "monthly") {
  planAmount = 99;
}

const { data } = await axios.post(API_ROUTES.getPremium, {
  amount: planAmount, // Razorpay accepts amount in paise
  currency: "INR",
  subscription_plan: "Edusify Premium",
  token,
  duration: selectedPlan,
});

      const options = {
        key: "rzp_live_jPX6SxetQbApHC",
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,
        name: "Edusify",
        description: `Subscription Payment (${selectedPlan})`,
        handler: async (response) => {
          const { data } = await axios.post(API_ROUTES.verifyPayment, {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            token,
            subscription_plan: "Edusify Premium",
            duration: selectedPlan,
          });
      
          if (data.success) {
            navigate("/payment-success");
          } else {
            alert("Payment verification failed!");
          }
        },
        theme: { color: "#000000" },
      
        method: {
          upi: true, // ✅ Enable UPI but force manual entry
          card: true,
          netbanking: true,
          wallet: true,
        },
      
        config: {
          display: {
            hide: ["upi_recommended"], // ✅ Hide "Recommended" UPI options (PhonePe, Google Pay, Paytm)
          },
        },
      
        prefill: {
          method: "upi", // ✅ Forces users to enter UPI ID manually
        },
      };
      
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      
    } catch (error) {
      console.error("Error initiating payment", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
        .then(response => setIsPremium(response.data.premium))
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);

  const scrollRef = useRef();

  const handleNext = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  

  return (
    <Wrapper>
  {step === 1 && (
  <PageWrapper>
    <DreamGlow>Everything You’ve Ever Wanted in a Study App</DreamGlow>

    <Badge>Only on Edusify Premium</Badge>
    <Subtitle2>
      Edusify Premium gives you elite tools, unlimited AI, and the power to study 10x smarter.
    </Subtitle2>

    <FeatureList>
      {[
        ["Start each day with clarity — your plan, already optimized.", <FaRegClock />],
        ["Smart to-dos. Intelligent breaks. Everything adapts to you.", <FaClipboardCheck />],
        ["No clutter. Just calm, focused execution.", <FaMagic />],
        ["AI-generated notes & flashcards that actually feel personal.", <FaStickyNote />],
        ["Visuals that make complex topics beautifully simple.", <FaBrain />],
        ["Pomodoros that adapt based on your rhythm — not trends.", <FaStopwatch />],
        ["A workspace that’s minimal, powerful, and distraction-free.", <FaChartLine />],
        ["No chaos. Just quiet consistency.", <FaUsers />]
      ].map(([text, icon]) => (
        <FeatureItem key={text}>
          <IconWrapper>{icon}</IconWrapper>{text}
        </FeatureItem>
      ))}
    </FeatureList>

    <CallToAction>
      This isn’t just studying. <br />
      <strong>This is what the top 1% use to stay ahead.</strong> <br />
      <span style={{ fontSize: '0.9rem', color: '#2E1A47' }}>
        You can keep guessing — or join the students who don’t need to.
      </span>
    </CallToAction>

    <Button style={{ marginTop: "2.5rem" }} onClick={handleNext}>
      Next 
    </Button>
  </PageWrapper>
)}
{step === 2 && (
  <ScrollContent ref={scrollRef}>
    <SubscriptionContainer>
      <Title>Your Edge Begins Here</Title>
      <Subtitle>Precision-crafted for students who expect more from themselves.</Subtitle>

      <Plans>
        <PlanBox active={selectedPlan === "daily"} onClick={() => setSelectedPlan("daily")}>
          <h4>Just Curious</h4>
          <p>₹8/day</p>
          <SmallText>Perfect for a quick taste</SmallText>
        </PlanBox>
        <PlanBox active={selectedPlan === "monthly"} onClick={() => setSelectedPlan("monthly")}>
          <BestOfferTag>Most Chosen</BestOfferTag>
          <h4>Stay Ahead</h4>
          <p>₹3.30/day</p>
          <SmallText>Billed ₹99 monthly</SmallText>
        </PlanBox>
        <PlanBox active={selectedPlan === "weekly"} onClick={() => setSelectedPlan("weekly")}>
          <h4>Test the Waters</h4>
          <p>₹39/week</p>
          <SmallText>Ideal for focused prep weeks</SmallText>
        </PlanBox>
      </Plans>

      {isPremium ? (
        <Button disabled>You have Premium! 🔥</Button>
      ) : (
        <Button onClick={handlePayment}>Continue with Edusify</Button>
      )}
      <Link to='/help'>
          <Footer>
      Need Help?
    </Footer>
    </Link>
    </SubscriptionContainer>

      </ScrollContent>
)}

  </Wrapper>
  );
};

export default PaymentComponent;
//  <Button disabled>You have Premium! 🔥</Button>