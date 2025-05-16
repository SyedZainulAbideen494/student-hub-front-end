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

    const lastClosed = localStorage.getItem("offerLastClosed");

   if (!isPremium && (!lastClosed || Date.now() - lastClosed > 40 * 60 * 1000)) {
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
        amount: 150,
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
<div className="overlay__premium__modal">
  <div className="modal-container__premium__modal">
    <button className="close-btn__premium__modal" onClick={closeOffer}><FaTimes /></button>

    <h2 className="modal-title__premium__modal">Unlock Premium Access</h2>
    <p className="modal-subtitle__premium__modal">All your AI tools. One simple plan.</p>

    <div className="modal-price__premium__modal">
      <span className="old-price">₹299</span>
      <span className="new-price">₹199/mo</span>
      <span className="offer-tag">Limited Time Offer</span>
    </div>

    <ul className="modal-benefits__premium__modal">
      <li>AI Smart Quizzes, Mindmaps & more</li>
      <li>Predicted Questions & Exam Mode</li>
  <li>Weekly Reports — Track Progress with Clarity</li>
  <li>And so much more!</li>
    </ul>

    <button className="unlock-btn__premium__modal" onClick={handlePayment}>
      Get Premium –   <span className="old-price">₹299</span> ₹199/month
    </button>

    <button className="not-now-btn__premium__modal" onClick={closeOffer}>
      Maybe Later
    </button>
  </div>
</div>

  );
};

export default ExamTimeOffer;
