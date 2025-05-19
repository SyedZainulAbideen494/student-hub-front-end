import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";

const Wrapper = styled.div`
  background: #0D0D0D;
  color: #f5f5f7;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
`;

const Container = styled.div`
  max-width: 420px;
  background: rgba(17, 17, 17, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h1`
  font-size: 26px;
  margin-bottom: 10px;
  color: #ffffff;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #a1a1aa;
  margin-bottom: 30px;
`;

const Price = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #00c853;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #a88beb, #7f56d9);
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(168, 139, 235, 0.4);
  }

  &:disabled {
    background: #444;
    cursor: not-allowed;
  }
`;

const WeeklyPaymentComponent = () => {
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(null);

  const selectedPlan = "weekly";
  const planAmount = 49;

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to subscribe.");
        return;
      }

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
        description: `Weekly Premium Subscription`,
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
            navigate("/premium-abandon");
          }
        },
        theme: { color: "#000000" },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        config: {
          display: {
            hide: ["upi_recommended"],
          },
        },
        prefill: {
          method: "upi",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.post(API_ROUTES.checkSubscription, {}, {
        headers: { Authorization: token }
      })
        .then(res => setIsPremium(res.data.premium))
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);

  return (
    <Wrapper>
      <Container>
        <Title>Own Your Week 🔥</Title>
        <Subtitle>1 week of full Premium access for just:</Subtitle>
        <Price>₹49/week</Price>

        {isPremium ? (
          <Button disabled>You already have Premium!</Button>
        ) : (
          <Button onClick={handlePayment}>Subscribe Now</Button>
        )}
      </Container>
    </Wrapper>
  );
};

export default WeeklyPaymentComponent;
