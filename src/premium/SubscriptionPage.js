import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";
import TestimonialsSection from "./testimonials";

const MicroTrust = styled.p`
  font-size: 12px;
  color: #8e8e93;
  margin-top: 12px;
`;

const Wrapper = styled.div`
  background: linear-gradient(145deg, #f5f5f7, #eaeaec);
  color: #1c1c1e;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ScrollContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 40px 20px 60px;
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
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  transition: all 0.4s ease;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 18px;
  color: #1c1c1e;
  letter-spacing: 0.8px;
  line-height: 1.3;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #6e6e73;
  margin-bottom: 32px;
  line-height: 1.8;
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
  border: 2px solid ${(props) => (props.active ? "#0071e3" : "#d1d1d6")};
  width: 150px;
  background: ${(props) =>
    props.active ? "rgba(0, 113, 227, 0.1)" : "rgba(255, 255, 255, 0.05)"};
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.active ? "0 0 12px rgba(0, 113, 227, 0.25)" : "none"};

  &:hover {
    border-color: #0071e3;
    background: rgba(0, 113, 227, 0.12);
    transform: translateY(-3px);
  }

  h4 {
    font-size: 16px;
    margin-bottom: 6px;
    color: #1c1c1e;
  }

  p {
    font-size: 14px;
    color: #8e8e93;
  }
`;

const BestOfferTag = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #0071e3;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.5);
`;

const SmallText = styled.p`
  font-size: 12px;
  color: #8e8e93;
  margin-top: 5px;
`;

const Button = styled.button`
  background: #0071e3;
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
  box-shadow: 0 8px 24px rgba(0, 113, 227, 0.35);

  &:hover {
    box-shadow: 0 12px 30px rgba(0, 113, 227, 0.5);
    transform: translateY(-2px);
  }

  &:disabled {
    background: #d1d1d6;
    box-shadow: none;
    cursor: default;
    opacity: 0.6;
  }
`;

const Footer = styled.p`
  margin-top: 30px;
  font-size: 14px;
  color: #6e6e73;
  text-align: center;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.3s ease;

  &:hover {
    color: #0071e3;
    text-shadow: 0 1px 2px rgba(0, 113, 227, 0.3);
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

  return (
    <Wrapper>
    <ScrollContent>
      <SubscriptionContainer>
      <Title>Your Edge Begins Here</Title>
<Subtitle>Precision-crafted for students who expect more from themselves.</Subtitle>

  
        <Plans>
          <PlanBox
            active={selectedPlan === "daily"}
            onClick={() => setSelectedPlan("daily")}
          >
       <h4>Just Curious</h4>
<p>₹8/day</p>
<SmallText>Perfect for a quick taste</SmallText>

          </PlanBox>
  
          <PlanBox
            active={selectedPlan === "monthly"}
            onClick={() => setSelectedPlan("monthly")}
          >
          <BestOfferTag>Most Chosen</BestOfferTag>
<h4>Stay Ahead</h4>
<p>₹3.30/day</p>
<SmallText>Billed ₹99 monthly</SmallText>

          </PlanBox>
  
          <PlanBox
            active={selectedPlan === "weekly"}
            onClick={() => setSelectedPlan("weekly")}
          >
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
  
        <Footer onClick={() => navigate("/subscription/features")}>
        👀 See Why Edusify Isn't Like the Rest
        </Footer>
      </SubscriptionContainer>
    </ScrollContent>
  </Wrapper>
  );
};

export default PaymentComponent;
//  <Button disabled>You have Premium! 🔥</Button>