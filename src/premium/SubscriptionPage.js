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
  font-size: 22px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 1;
  }
`;

const SubscriptionContainer = styled.div`
  text-align: center;
  width: 90%;
  max-width: 420px;
  padding: 30px 20px;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #bbb;
  margin-bottom: 24px;
`;

const Plans = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 25px;
`;

const PlanBox = styled.div`
  padding: 18px;
  border-radius: 14px;
  text-align: center;
  border: 2px solid ${(props) => (props.active ? "#7a5af8" : "rgba(255, 255, 255, 0.3)")};
  width: 165px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  &:hover {
    border-color: #7a5af8;
    background: rgba(122, 90, 248, 0.1);
  }
`;

const BestOfferTag = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #7a5af8;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 5px 12px;
  border-radius: 6px;
`;

const SmallText = styled.p`
  font-size: 12px;
  color: #bbb;
`;

const Button = styled.button`
  background: #7a5af8;
  color: white;
  border: none;
  padding: 16px 42px;
  font-size: 17px;
  border-radius: 30px;
  cursor: pointer;
  width: 100%;
  max-width: 290px;
  font-weight: 600;
  transition: background 0.3s ease;
  &:hover {
    background: #6a4be8;
  }
  &:disabled {
    background: #444;
    cursor: default;
  }
`;

const Footer = styled.p`
  margin-top: 18px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
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
        theme: { color: "#121212" },
      
        method: {
          upi: true, // ✅ Enable UPI but force manual entry
          card: true,
          netbanking: true,
          wallet: true,
        },
      
        config: {
          display: {
            hide: ["recommended", "Pay by any UPI App"], // ✅ Hide "Recommended" UPI options (PhonePe, Google Pay, Paytm)
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

  return (
    <Wrapper>
    {/* Close Button */}
    <CloseButton onClick={() => navigate("/")}>✕</CloseButton>
  
    {/* Subscription Section */}
    <SubscriptionContainer>
      <Title>Effortless Learning. Exceptional Results.</Title>
      <Subtitle>Smart tools for the next generation of achievers.</Subtitle>
  
      {/* Plans */}
      <Plans>
        <PlanBox active={selectedPlan === "monthly"} onClick={() => setSelectedPlan("monthly")}>
          <BestOfferTag>BEST OFFER</BestOfferTag>
          <h4>1 MONTH</h4>
          <p>₹3.30 per day</p>
          <SmallText>Billed ₹99 per month</SmallText>
        </PlanBox>
  
        <PlanBox active={selectedPlan === "weekly"} onClick={() => setSelectedPlan("weekly")}>
          <h4>1 WEEK</h4>
          <p>₹5.57 per day</p>
          <SmallText>Billed ₹39 per week</SmallText>
        </PlanBox>
      </Plans>
  
      {/* CTA Button */}
      {isPremium ? (
        <Button>You have Premium! 🔥</Button>
      ) : (
        <Button onClick={handlePayment}>Unlock Edusify Premium</Button>
      )}
  
      {/* Secure Payment Notice */}
      <Footer>🔒 Secure Payment via Razorpay</Footer>
    </SubscriptionContainer>
  </Wrapper>
  );
};

export default PaymentComponent;
