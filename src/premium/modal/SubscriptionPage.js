import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SubscriptionModal.css";
import { API_ROUTES } from "../../app_modules/apiRoutes";
import { useNavigate } from "react-router-dom";

const PaymentComponentModal = () => {
  const [isPremium, setIsPremium] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const firstSignInTime = localStorage.getItem("firstSignInTime");

    if (!firstSignInTime) {
      // If firstSignInTime is not set, save the current time
      localStorage.setItem("firstSignInTime", Date.now());
    } else {
      const elapsedTime = Date.now() - parseInt(firstSignInTime, 10);
      const fiveMinutes = 1 * 60 * 1000;

      if (elapsedTime < fiveMinutes) {
        return; // Don't show the modal yet
      }
    }

    if (token) {
      axios
        .post(API_ROUTES.checkSubscription, {}, { headers: { Authorization: token } })
        .then((response) => {
          if (!response.data.premium) {
            setShowModal(true);
          }
          setIsPremium(response.data.premium);
        })
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
      setShowModal(true);
    }
  }, []);

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to subscribe.");
        return;
      }

      const { data } = await axios.post(API_ROUTES.getPremium, {
        amount: 69, // Offer price
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

  if (!showModal) return null; // Don't render if the user is already premium or 5 mins haven't passed

  return (
    <div className="overlay__modal__subs__offer">
      <div className="subscription-card__modal__subs__offer">
        <h2 className="subscription-title__modal__subs__offer">
          One-Time Exclusive Offer!
        </h2>
        <p className="subscription-description__modal__subs__offer">
          You’ll never see this again. Get <strong>Edusify Premium for ₹69/month</strong> instead of ₹99.
          Don’t miss out on this limited-time <strong>exclusive deal</strong>!
        </p>

        <div className="subscription-plan__modal__subs__offer">
          <button className="plan-button__modal__subs__offer active__modal__modal__subs__offer">
            ₹69 / Month
          </button>
        </div>

        <div className="subscription-button-container__modal__subs__offer">
          <button className="subscription-action__modal__subs__offer" onClick={handlePayment}>
            Claim Now
          </button>
          <button className="dismiss-button__modal__subs__offer" onClick={() => setShowModal(false)}>
            No thanks, I'll pay ₹99 later 😔
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponentModal;
