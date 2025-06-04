import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from 'styled-components';
import axios from "axios";
import { FaRocket, FaStar, FaMoon, FaCloudSun, FaCube, FaRegClock } from 'react-icons/fa';

import { API_ROUTES } from "../app_modules/apiRoutes";
import TestimonialsSection from "./testimonials";
import './Welcome.css'
import Welcome from "./welcome";
import PriceHikeBanner from "./priceHikeBanner";

const Wrapper = styled.div`
  background: #0D0D0D;
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
  background: rgb(17, 17, 17);
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
  }

  h4 {
    font-size: 16px;
    margin-bottom: 6px;
    color: #f5f5f7;
  }

  p {
    font-size: 14px;
    color: rgb(138, 138, 138);
  }
`;

const SmallText = styled.p`
  font-size: 12px;
  color: #8e8e93;
  margin-top: 5px;
`;
const Button = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 36px;
  font-size: 16px;
  font-weight: 500;
  color: #a88beb;
  background: white;
  border: white;
  border-radius: 25px;
  width: 100%;
  max-width: 320px;
  cursor: pointer;
  z-index: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);


  &:disabled {
    color: rgba(255, 255, 255, 0.4);
    background: transparent;
    cursor: not-allowed;
    transform: none;
    opacity: 0.6;
  }

  @keyframes shimmer {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
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
const BenefitsContainer = styled.div`
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
  padding: 32px 24px;
  backdrop-filter: blur(14px);
  animation: fadeIn 0.5s ease;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease-in-out;
`;

const Feature = styled.p`
  font-size: 15px;
  color: #eaeaea;
  margin-bottom: 16px;
  line-height: 1.6;
`;

const Highlight = styled.span`
  font-weight: 600;
  color: #ffffff;
`;

const Tagline = styled.p`
  font-size: 14px;
  color: #b1b1b1;
  text-align: center;
  margin-top: 30px;
  line-height: 1.8;
  font-style: italic;
`;

const Divider = styled.div`
  height: 1px;
  background: #3c3c43;
  margin: 32px auto;
  width: 40%;
  border-radius: 10px;
  opacity: 0.3;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
`;



const PaymentComponent = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [isPremium, setIsPremium] = useState(null);
  const [step, setStep] = useState(1);
const [showBenefits, setShowBenefits] = useState(false);


  // Handle Payment with Razorpay
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to subscribe.");
        return;
      }

    // Set pricing based on selected plan
   // Set pricing based on selected plan
let planAmount = 0;
if (selectedPlan === "daily") {
  planAmount = 9;
} else if (selectedPlan === "weekly") {
  planAmount = 39;
} else if (selectedPlan === "monthly") {
  planAmount = 99;
} else if (selectedPlan === "3months") {
  planAmount = 239; // 💡 Adjust price as per your pricing strategy
} else if (selectedPlan === "6months") {
  planAmount = 499; // 💡 Adjust price as per your pricing strategy
} else if (selectedPlan === "yearly") {
  planAmount = 999;
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
        modal: {
    ondismiss: () => {
      navigate("/premium-abandon"); // 👉 Redirect when payment is canceled or closed
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
  const SparkleIcon = () => (
    <svg
      height="20"
      width="20"
      fill="url(#gradient)"
      viewBox="0 0 24 24"
      style={{ marginLeft: '4px' }}
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a88beb" />
          <stop offset="100%" stopColor="#7f56d9" />
        </linearGradient>
      </defs>
      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
    </svg>
  );
  
  
  return (
   <Wrapper>
  <ScrollContent ref={scrollRef}>
    <SubscriptionContainer>
      <Title>Unlock the Edge.</Title>
      <Subtitle>Built for students who move smart — and move first.</Subtitle>
<PriceHikeBanner/>
      <Plans>
  {/*       <PlanBox active={selectedPlan === "daily"} onClick={() => setSelectedPlan("daily")}>
          <h4>First Step to Mastery</h4>
          <p>₹9/day</p>
          <SmallText>No commitment. Just results.</SmallText>
        </PlanBox>
 {/* <PlanBox 
  active={selectedPlan === "freePremium"} 
  onClick={() => setSelectedPlan("freePremium")}
>
  <BestOfferTag style={{ backgroundColor: "#0a84ff", color: "#fff" }}>
    Claim Free Premium
  </BestOfferTag>
  <h4>Enjoy 14 Days Free</h4>
  <p>
    ₹0
  </p>
  <SmallText style={{ color: "#60aaff" }}>
    Full premium access. No cost.
  </SmallText>


  <Button onClick={() => navigate('/story-free-promo-premium')}>
  Claim Premium
</Button>
</PlanBox>*/}

        <PlanBox active={selectedPlan === "monthly"} onClick={() => setSelectedPlan("monthly")}>
          <BestOfferTag>Exclusive Value</BestOfferTag>
          <h4>Lead Without Limits</h4>
          <p>₹99/month</p>
          <SmallText>Full access. Effortless excellence.</SmallText>
        </PlanBox>

        <PlanBox active={selectedPlan === "weekly"} onClick={() => setSelectedPlan("weekly")}>
          <h4>Own Your Week</h4>
          <p>₹39/week</p>
          <SmallText>Focused. Achieved. Repeated.</SmallText>
        </PlanBox>

        <PlanBox active={selectedPlan === "3months"} onClick={() => setSelectedPlan("3months")}>
          <h4>Rise Quarterly</h4>
          <p>₹239/3 months</p>
          <SmallText>Save more. Stay sharp.</SmallText>
        </PlanBox>

        <PlanBox active={selectedPlan === "6months"} onClick={() => setSelectedPlan("6months")}>
          <h4>Half-Year Hustle</h4>
          <p>₹499/6 months</p>
          <SmallText>Consistency breeds champions.</SmallText>
        </PlanBox>

        <PlanBox active={selectedPlan === "yearly"} onClick={() => setSelectedPlan("yearly")}>
          <BestOfferTag>Best Value</BestOfferTag>
          <h4>Commit to Greatness</h4>
          <p>₹999/year</p>
          <SmallText>12 months for the price of 10 — secure your edge today.</SmallText>
        </PlanBox>
      </Plans>

      <Button onClick={() => setShowBenefits(!showBenefits)} style={{ marginBottom: '20px' }}>
        {showBenefits ? 'Hide Premium Benefits' : 'See Why Toppers Upgrade'}
      </Button>

      {showBenefits && (
        <BenefitsContainer style={{ marginBottom: '20px' }}>
          <Divider />
          <Feature>✨ <Highlight>AI notes</Highlight> that sound like a topper made them.</Feature>
          <Feature>✨ <Highlight>Predicted questions</Highlight> before your teacher finishes the chapter.</Feature>
          <Feature>✨ <Highlight>Study plan</Highlight> that feels like it was made by a rank coach.</Feature>
          <Feature>✨ <Highlight>Stats</Highlight> so clean, they look screenshot-worthy.</Feature>
          <Feature>✨ <Highlight>Edusify badge.</Highlight> If you know, you know.</Feature>
          <Divider />
          <Tagline>
            Thousands use Edusify. <br />
            The top 1% don’t just use it — <br />
            <Highlight>they own it.</Highlight>
          </Tagline>
        </BenefitsContainer>
      )}

      {isPremium ? (
        <Button disabled>You’ve Got Premium. That Says It All. 🔥</Button>
      ) : (
        <Button onClick={handlePayment}>
          <SparkleIcon /> Get Premium
        </Button>
      )}

      <Link to='/'>
        <Footer>Go Back — But Just Know: Premium Hits Different.</Footer>
      </Link>
    </SubscriptionContainer>
  </ScrollContent>
</Wrapper>

  );
  
};

export default PaymentComponent;
//  <Button disabled>You have Premium! 🔥</Button>