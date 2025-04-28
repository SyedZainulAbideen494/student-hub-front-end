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

const Wrapper = styled.div`
  background: linear-gradient(135deg, #0a0a0a, #1c1c1e);
  color: #f5f5f7;
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
  backdrop-filter: blur(30px);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  padding: 45px 30px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  transition: all 0.4s ease;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 18px;
  color: #f5f5f7;
  letter-spacing: 0.5px;
  line-height: 1.3;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #a1a1aa;
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
  border: 2px solid ${(props) => (props.active ? "#7f56d9" : "#2c2c2e")};
  width: 150px;
  background: ${(props) =>
    props.active ? "rgba(127, 86, 217, 0.12)" : "rgba(255, 255, 255, 0.02)"};
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.active ? "0 0 14px rgba(127, 86, 217, 0.4)" : "none"};

  &:hover {
    border-color: #7f56d9;
    background: rgba(127, 86, 217, 0.14);
    transform: translateY(-3px);
  }

  h4 {
    font-size: 16px;
    margin-bottom: 6px;
    color: #f5f5f7;
  }

  p {
    font-size: 14px;
    color:rgb(138, 138, 138);
  }
`;



const SmallText = styled.p`
  font-size: 12px;
  color: #8e8e93;
  margin-top: 5px;
`;

const Button = styled.button`
  background: #7f56d9;
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

  &:hover {
    box-shadow: 0 12px 30px rgba(127, 86, 217, 0.5);
    transform: translateY(-2px);
  }

  &:disabled {
    background: #3a3a3c;
    cursor: default;
    opacity: 0.5;
    box-shadow: none;
  }
`;

const Footer = styled.p`
  margin-top: 30px;
  font-size: 14px;
  color: #7c7c80;
  text-align: center;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #a58dfb;
  }
`;

const Divider = styled.div`
  height: 2px;
  width: 60px;
  background: #3c3c43;
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
  color: #f5f5f7;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle2 = styled.p`
  font-size: 1.1rem;
  color: #a1a1aa;
  text-align: center;
  margin-bottom: 2.2rem;
  font-weight: 500;
`;

const Badge = styled.div`
  font-size: 0.85rem;
  background: #2c2c2e;
  padding: 4px 10px;
  color: #a58dfb;
  border-radius: 20px;
  font-weight: 600;
  margin-bottom: 1rem;
  margin-top: 1em;
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
  color: #f5f5f7;
  padding: 0.95rem 1rem;
  background: #1c1c1e;
  border-radius: 14px;
  transition: all 0.25s ease;
  border-left: 4px solid #7f56d9;
  box-shadow: 0 4px 14px rgba(255, 255, 255, 0.03);

  &:hover {
    background: #2c2c2e;
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.span`
  font-size: 1.4rem;
  margin-right: 14px;
  background: linear-gradient(135deg, #7f56d9, #c08fff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const CallToAction = styled.div`
  margin-top: 2.5rem;
  text-align: center;
  color: #a58dfb;
  font-size: 1.15rem;
  font-weight: 600;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  line-height: 1.7;
`;

const DreamGlow = styled.h2`
  font-size: 2.5rem;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  background: linear-gradient(120deg, #9f63ff, #ffb1f9);
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

const BestOfferTag = styled.div`
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #9f63ff, #ffb1f9);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(127, 86, 217, 0.35);
  letter-spacing: 0.3px;
`;

const StyledWrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;

.pay-btn {
  position: relative;
  padding: 12px 24px;
  font-size: 16px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.pay-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}

.icon-container {
  position: relative;
  width: 24px;
  height: 24px;
}

.icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  color: #22c55e;
  opacity: 0;
  visibility: hidden;
}

.default-icon {
  opacity: 1;
  visibility: visible;
}

/* Hover animations */
.pay-btn:hover .icon {
  animation: none;
}

.pay-btn:hover .wallet-icon {
  opacity: 0;
  visibility: hidden;
}

.pay-btn:hover .card-icon {
  animation: iconRotate 2.5s infinite;
  animation-delay: 0s;
}

.pay-btn:hover .payment-icon {
  animation: iconRotate 2.5s infinite;
  animation-delay: 0.5s;
}

.pay-btn:hover .dollar-icon {
  animation: iconRotate 2.5s infinite;
  animation-delay: 1s;
}

.pay-btn:hover .check-icon {
  animation: iconRotate 2.5s infinite;
  animation-delay: 1.5s;
}

/* Active state - show only checkmark */
.pay-btn:active .icon {
  animation: none;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.pay-btn:active .check-icon {
  animation: checkmarkAppear 0.6s ease forwards;
  visibility: visible;
}

.btn-text {
  font-weight: 600;
  font-family: system-ui, -apple-system, sans-serif;
}

@keyframes iconRotate {
  0% {
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px) scale(0.5);
  }
  5% {
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scale(1);
  }
  15% {
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scale(1);
  }
  20% {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px) scale(0.5);
  }
  100% {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px) scale(0.5);
  }
}

@keyframes checkmarkAppear {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(-45deg);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
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
  planAmount = 15; // ₹8 → 800 paise
} else if (selectedPlan === "weekly") {
  planAmount = 39;
} else if (selectedPlan === "monthly") {
  planAmount = 59;
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

  useEffect(() => {
    // Scroll to the top of the page on load
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling animation
    });
  }, []); // Empty dependency array to run only once when the component is mounted

  return (
    <Wrapper>
      {step === 1 && (
        <PageWrapper>
          <Title2>Everything You’ve Ever Wanted in a Study App</Title2>
  
          <Badge>Only on Edusify</Badge>
          <Subtitle2>
            Meet the app that gives you elite tools, unlimited AI, and the power to study 10x smarter — while making it feel effortless.
          </Subtitle2>
  
          <FeatureList>
            {[
              ["Unlimited AI Power", <FaMagic />],
              ["Create Quizzes, Flashcards & Mind Maps Instantly", <FaBrain />],
              ["Convert Any PDF into Notes, Quizzes & More", <FaFilePdf />],
              ["AI-Generated Expert Topic Notes", <FaClipboardCheck />],
              ["Custom Study Plans Tailored to You", <FaTasks />],
              ["Daily Smart Task Generation", <FaRegClock />],
              ["Intelligent Study Suggestions That Adapt to You", <FaLightbulb />],
              ["Advanced Quiz Analytics & Progress Insights", <FaChartLine />],
              ["Exclusive NEET, JEE, Boards AI Quizzes", <FaStopwatch />],
              ["Full NEET Study Guide & Curated Resources", <FaBookOpen />],
              ["Instant AI-Generated Assignments", <FaFileInvoice />],
              ["Stunning AI Image Generator for Notes & Projects", <FaImage />],
              ["Craft Beautiful, Aesthetic Notes Effortlessly", <FaStickyNote />],
              ["Find the Perfect Study Resources in Seconds", <FaFileAlt />],
              ["Personalized Smart Dashboard to Track Your Success", <FaChartBar />],
              ["Dynamic Mind Maps for Visual Learning", <FaLayerGroup />],
              ["Join Collaborative Study Rooms & Communities", <FaUsers />],
              ["Secure Document Locker for Your Important Files", <FaLock />],
              ["And so much more — designed for the next generation of top students."]
            ].map(([text, icon]) => (
              <FeatureItem key={text}>
                <IconWrapper>{icon}</IconWrapper>{text}
              </FeatureItem>
            ))}
          </FeatureList>
  
          <CallToAction>
            You’ve seen the future of studying. <br />
            <strong>Now it's your turn to unlock it.</strong> <br />
            <span style={{ fontSize: '0.9rem', color: '#2E1A47' }}>
              Join the students who are no longer guessing — they’re dominating.
            </span>
          </CallToAction>
  
          <Button style={{ marginTop: "2.5rem" }} onClick={handleNext}>
            See Plans
          </Button>
        </PageWrapper>
      )}
  
      {step === 2 && (
        <ScrollContent ref={scrollRef}>
          <SubscriptionContainer>
            <Title>Your Edge Begins Here</Title>
            <Subtitle>Precision-crafted for students who expect more from themselves — and get it.</Subtitle>
  
            <Plans>
            <PlanBox active={selectedPlan === "daily"} onClick={() => setSelectedPlan("daily")}>
  <h4>First Step to Mastery</h4>
  <p>₹15/day</p>
  <SmallText>Experience premium. No commitments.</SmallText>
</PlanBox>

              <PlanBox active={selectedPlan === "monthly"} onClick={() => setSelectedPlan("monthly")}>
  <BestOfferTag>Exclusive Value</BestOfferTag>
  <h4>Lead Without Limits</h4>
  <p>
    ₹99/month
  </p>
  <SmallText>Full access. Effortless excellence.</SmallText>
</PlanBox>

  
<PlanBox active={selectedPlan === "weekly"} onClick={() => setSelectedPlan("weekly")}>
  <h4>Own Your Week</h4>
  <p>₹39/week</p>
  <SmallText>Focus. Achieve. Repeat.</SmallText>
</PlanBox>

            </Plans>
  
            {isPremium ? (
      <Button disabled>You have Premium! 🔥</Button>     ) : (
              <StyledWrapper>
                <button className="pay-btn" onClick={handlePayment}>
                  <span className="btn-text">Pay Now</span>
                  <div className="icon-container">
                  <svg viewBox="0 0 24 24" className="icon card-icon">
                    <path d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18C2,19.11 2.89,20 4,20H20C21.11,20 22,19.11 22,18V6C22,4.89 21.11,4 20,4Z" fill="currentColor" />
                  </svg>
                  <svg viewBox="0 0 24 24" className="icon payment-icon">
                    <path d="M2,17H22V21H2V17M6.25,7H9V6H6V3H18V6H15V7H17.75L19,17H5L6.25,7M9,10H15V8H9V10M9,13H15V11H9V13Z" fill="currentColor" />
                  </svg>
                  <svg viewBox="0 0 24 24" className="icon dollar-icon">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill="currentColor" />
                  </svg>
                  <svg viewBox="0 0 24 24" className="icon wallet-icon default-icon">
                    <path d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H22V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z" fill="currentColor" />
                  </svg>
                  <svg viewBox="0 0 24 24" className="icon check-icon">
                    <path d="M9,16.17L4.83,12L3.41,13.41L9,19L21,7L19.59,5.59L9,16.17Z" fill="currentColor" />
                  </svg>
                  </div>
                </button>
              </StyledWrapper>
            )}
  
            <Link to='/help'>
              <Footer>Need Help?</Footer>
            </Link>
          </SubscriptionContainer>
        </ScrollContent>
      )}
    </Wrapper>
  );
  
};

export default PaymentComponent;
//  <Button disabled>You have Premium! 🔥</Button>