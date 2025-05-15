import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./exam-time-modal.css";
import axios from "axios";
import { API_ROUTES } from "../../app_modules/apiRoutes";
import { FaCheckCircle, FaClock, FaFire, FaGift, FaTimes } from "react-icons/fa";

const ExamTimeOffer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPremium, setIsPremium] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post(API_ROUTES.checkSubscription, {}, { headers: { Authorization: token } })
        .then((response) => setIsPremium(response.data.premium))
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);

  useEffect(() => {
    if (isPremium === null) return; // Wait until isPremium is determined

//    const lastClosed = localStorage.getItem("offerLastClosed");

  if (!isPremium) {
      setIsVisible(true);
    }
    
 }, [isPremium]);

  const closeOffer = () => {
    localStorage.setItem("offerLastClosed", Date.now());
    setIsVisible(false);
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to subscribe.");
        return;
      }

      const { data } = await axios.post(API_ROUTES.getPremium, {
        amount: 199,
        currency: "INR",
        subscription_plan: "premium",
        token,
        duration: "monthly",
      });

      const options = {
        key: "rzp_live_jPX6SxetQbApHC",
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,
        name: "Edusify",
        description: "Exclusive One-Time Offer (Monthly)",
        handler: async (response) => {
          const { data } = await axios.post(API_ROUTES.verifyPayment, {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            token,
            subscription_plan: "premium",
            duration: "monthly",
          });

          if (data.success) {
            nav("/payment-success");
          } else {
            alert("Payment verification failed!");
          }
        },
        theme: { color: "#030303" },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Error initiating payment", error);
    }
  };

  if (!isVisible) return null;

  return (
<div className="overlay__exam__modal">
  <div className="exam-container__exam__modal">
    <button className="close-btn__exam__modal" onClick={closeOffer}><FaTimes/></button>

    <h2 className="exam-title__exam__modal">🚨 Exclusive Unlock – 48 Hours Only</h2>
    <p className="exam-subtitle__exam__modal">
      You’ve unlocked a limited-time offer: full access to all AI tools for just <strong>₹199/month</strong> — that’s <strong>33% OFF</strong> the usual ₹299 price!
    </p>

    <div className="exam-card__exam__modal">
      <div className="exam-icon__exam__modal"><FaClock size={30} color="#DCB99D" /></div>
      <p className="exam-benefits__exam__modal" style={{textAlign: 'left'}}>
        <FaCheckCircle className="icon-check__exam__modal" /> <strong>AI Smart Notes & Flashcards – no more manual work</strong><br/>
        <FaCheckCircle className="icon-check__exam__modal" /> <strong>Predicted Questions, Mindmaps & Exam Mode</strong><br/>
        <FaCheckCircle className="icon-check__exam__modal" /> <strong>Mock Quizzes for Boards, JEE, NEET & more</strong>
      </p>

      <div className="exam-price-box__exam__modal">
        <span className="price">Just <strong>₹199</strong> / month</span>
      </div>

      <p className="lowest-price__exam__modal">
        ⏳ Hurry! This <strong>33% OFF</strong> deal lasts only 48 hours.<br/>
        After that, it’s ₹299/month forever. Don’t miss out.
      </p>
    </div>

    <button className="claim-btn__exam__modal" onClick={handlePayment}>
      <strong>Unlock 33% OFF — All Features for ₹199 Now</strong>
    </button>
<button className="not-now-btn__exam__modal" onClick={closeOffer} style={{textDecoration:'underline'}}>
  Not Now —<br/> but ₹299/month after 48 hrs, so why wait?
</button>
  </div>
</div>

  );
};

export default ExamTimeOffer;
