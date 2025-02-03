import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OneTimeOffer.css";
import axios from "axios";
import { API_ROUTES } from "../../app_modules/apiRoutes";
import { FaGift, FaTimes } from "react-icons/fa";

const OneTimeOffer = () => {
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
    if (!isPremium === null) return; // Wait until isPremium is determined

    const lastClosed = localStorage.getItem("offerLastClosed");

    if (!isPremium && (!lastClosed || Date.now() - lastClosed > 12 * 60 * 60 * 1000)) {
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
        amount: 59,
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
    <div className="overlay__offer__modal__2">
    <div className="offer-container__offer__modal__2">
        <button className="close-btn__offer__modal__2" onClick={closeOffer}><FaTimes/></button>
        <h2 className="offer-title__offer__modal__2"> One Time Offer </h2>
        <p className="offer-subtitle__offer__modal__2">You will never see this again!</p>
        <div className="offer-card__offer__modal__2">
            <div className="gift-icon__offer__modal__2"><FaGift size={30} color="#DCB99D" /></div>
            <p className="discount-text__offer__modal__2">
                Get an <span className="discount-badge__offer__modal__2">50% OFF</span> discount! 🙌
            </p>
            <div className="price-box__offer__modal__2">
                <span className="price">Only <strong>₹59</strong> / month</span>
            </div>
            <p className="lowest-price__offer__modal__2">Lowest price ever</p>
        </div>
        <button className="claim-btn__offer__modal__2" onClick={handlePayment}>Claim Your Limited Offer Now!</button>
    </div>
</div>

  );
};

export default OneTimeOffer;
