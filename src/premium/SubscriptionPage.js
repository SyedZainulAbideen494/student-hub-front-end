import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";
import TestimonialsSection from "./testimonials";

const Wrapper = styled.div`
  background: #0d0d0d;
  color: white;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ScrollContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 30px 20px 60px; /* bottom padding to avoid overflow */
  display: flex;
  justify-content: center;
`;

const SubscriptionContainer = styled.div`
  width: 100%;
  max-width: 420px;
  text-align: center;
  backdrop-filter: blur(18px);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 24px;
  padding: 40px 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #fff;
`;

const Subtitle = styled.p`
  font-size: 15.5px;
  color: #b9b9b9;
  margin-bottom: 28px;
  line-height: 1.6;
`;

const Plans = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
`;

const PlanBox = styled.div`
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  border: 2px solid ${(props) => (props.active ? "#a88bfa" : "rgba(255, 255, 255, 0.2)")};
  width: 160px;
  background: ${(props) =>
    props.active
      ? "rgba(122, 90, 248, 0.1)"
      : "rgba(255, 255, 255, 0.03)"};
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.active ? "0 0 10px rgba(122, 90, 248, 0.4)" : "none"};

  &:hover {
    border-color: #7a5af8;
    background: rgba(122, 90, 248, 0.06);
  }

  h4 {
    font-size: 17px;
    margin-bottom: 6px;
    color: white;
  }

  p {
    font-size: 14px;
    color: #ccc;
  }
`;

const BestOfferTag = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #7a5af8, #a88bfa);
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 6px 14px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(122, 90, 248, 0.4);
`;

const SmallText = styled.p`
  font-size: 12px;
  color: #999;
  margin-top: 6px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #7a5af8, #a88bfa);
  color: white;
  border: none;
  padding: 16px 40px;
  font-size: 17px;
  border-radius: 32px;
  font-weight: 600;
  width: 100%;
  max-width: 290px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(122, 90, 248, 0.4);

  &:hover {
    box-shadow: 0 0 20px rgba(122, 90, 248, 0.6);
    transform: translateY(-2px);
  }

  &:disabled {
    background: #444;
    box-shadow: none;
    cursor: default;
    opacity: 0.6;
  }
`;

const Footer = styled.p`
  margin-top: 28px;
  font-size: 14px;
  color: #aaa;
  text-align: center;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.25s ease;

  &:hover {
    color: #a88bfa;
    text-shadow: 0 1px 1px rgba(122, 90, 248, 0.3);
  }
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

  return (
    <Wrapper>
    <ScrollContent>
      <SubscriptionContainer>
        <Title>Effortless Learning. Exceptional Results.</Title>
        <Subtitle>Smart tools for the next generation of achievers.</Subtitle>

        <Plans>
          <PlanBox
            active={selectedPlan === "monthly"}
            onClick={() => setSelectedPlan("monthly")}
          >
            <BestOfferTag>BEST OFFER</BestOfferTag>
            <h4>1 MONTH</h4>
            <p>₹3.30 per day</p>
            <SmallText>Billed ₹99 per month</SmallText>
          </PlanBox>

          <PlanBox
            active={selectedPlan === "weekly"}
            onClick={() => setSelectedPlan("weekly")}
          >
            <h4>1 WEEK</h4>
            <p>₹5.57 per day</p>
            <SmallText>Billed ₹39 per week</SmallText>
          </PlanBox>
        </Plans>

        {isPremium ? (
          <Button disabled>You have Premium! 🔥</Button>
        ) : (
          <Button onClick={handlePayment}>Start Your Mastery</Button>

        )}

        <Footer onClick={() => navigate("/subscription/features")}>
          🚀 Why Top Students Choose Edusify
        </Footer>
      </SubscriptionContainer>
    </ScrollContent>
  </Wrapper>
  );
};

export default PaymentComponent;
