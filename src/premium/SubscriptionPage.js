import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";

// Styled Components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0d0d0d;
  color: white;
  height: 100vh;
  padding: 20px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
`;

const SubscriptionContainer = styled.div`
  text-align: center;
  width: 90%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #bbb;
  margin-bottom: 20px;
`;

const Plans = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const PlanBox = styled.div`
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid ${(props) => (props.active ? "#7a5af8" : "rgba(255, 255, 255, 0.3)")};
  width: 160px;
  cursor: pointer;
  position: relative;
  transition: border 0.3s ease;
`;

const BestOfferTag = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #7a5af8;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
`;

const Button = styled.button`
  background: #7a5af8;
  color: white;
  border: none;
  padding: 14px 40px;
  font-size: 16px;
  border-radius: 25px;
  cursor: pointer;
  width: 100%;
  max-width: 280px;
`;

const Footer = styled.p`
  margin-top: 15px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const PaymentComponent = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [isPremium, setIsPremium] = useState(null);
  // Handle Payment with Razorpay
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to subscribe.");
        return;
      }

      // Set pricing based on selected plan
      const planAmount = selectedPlan === "weekly" ? 39 : 99; // Razorpay accepts paise (₹39 → 3900, ₹99 → 9900)

      const { data } = await axios.post(API_ROUTES.getPremium, {
        amount: planAmount,
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

  return (
    <Wrapper>
      {/* Close Button */}
      <CloseButton onClick={() => navigate("/")}>✕</CloseButton>

      {/* Subscription Section */}
      <SubscriptionContainer>
        <Title>Unlock Your Learning Potential!</Title>
        <Subtitle>Master Any Topic with AI-Generated Mind Maps. Simplify Complex Ideas.</Subtitle>

        <Plans>
          {/* 1 Month Plan (Best Offer) */}
          <PlanBox active={selectedPlan === "monthly"} onClick={() => setSelectedPlan("monthly")}>
            <BestOfferTag>BEST OFFER</BestOfferTag>
            <h2>1 MONTH</h2>
            <p>₹3.30 per day</p>
            <p style={{ fontSize: "12px", color: "#bbb" }}>Billed ₹99.00 per month</p>
          </PlanBox>

          {/* 1 Week Plan */}
          <PlanBox active={selectedPlan === "weekly"} onClick={() => setSelectedPlan("weekly")}>
            <h2>1 WEEK</h2>
            <p>₹5.57 per day</p>
            <p style={{ fontSize: "12px", color: "#bbb" }}>Billed ₹39 per week</p>
          </PlanBox>
        </Plans>

        {isPremium ? (
  <>
   <Button>You have Premium! 🔥</Button>
     {/*   <BorderButton onClick={() => nav('/subscription/features')}>See What You're Missing 👀</BorderButton>*/}
  </>
) : (
  <>
  <Button onClick={handlePayment}>Continue</Button>

    {/*  <BorderButton onClick={() => nav('/subscription/features')}>See What You're Missing 👀</BorderButton>*/}
  </>
)}

<Footer>🚀 Secured Payment with Razorpay.</Footer>

      </SubscriptionContainer>
    </Wrapper>
  );
};

export default PaymentComponent;
