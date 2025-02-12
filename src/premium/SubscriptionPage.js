import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubscriptionPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import { useNavigate } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';

const PaymentComponent = () => {
  const [amount, setAmount] = useState(129); // Default to ₹129 (monthly)
  const [subscriptionPlan, setSubscriptionPlan] = useState('premium');
  const [duration, setDuration] = useState('monthly'); // Always set to 'monthly' now
  const [showPremium, setShowPremium] = useState(true); // State to toggle between free and premium features
  const [isPremium, setIsPremium] = useState(null);
  const [timeLeft, setTimeLeft] = useState(72 * 60 * 60); // 3 days in seconds
  const nav = useNavigate();
  
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to subscribe.');
        return;
      }
  
      let planAmount = 129; // Always ₹129 for monthly plan
  
      const { data } = await axios.post(API_ROUTES.getPremium, {
        amount: planAmount,
        currency: 'INR',
        subscription_plan: subscriptionPlan,
        token,
        duration, // Send the selected duration
      });
  
      const options = {
        key: 'rzp_live_jPX6SxetQbApHC',
        amount: data.order.amount,
        currency: 'INR',
        order_id: data.order.id,
        name: 'Edusify',
        description: `Subscription Payment (${duration})`,
        handler: async (response) => {
          const { data } = await axios.post(API_ROUTES.verifyPayment, {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            token,
            subscription_plan: subscriptionPlan,
            duration, // Send the selected duration
          });
  
          if (data.success) {
            nav('/payment-success');
          } else {
            alert('Payment verification failed!');
          }
        },
        theme: { color: '#000000' },
      };
  
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Error initiating payment', error);
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

  useEffect(() => {
    // Countdown timer logic
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    if (timeLeft <= 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
<div className="container__pricing__subs__page">


  {/* Premium Card */}
  <div className="card__pricing__subs__page">
    <h3 className="title__pricing__subs__page">Edusify Premium</h3>
    <p className="description__pricing__subs__page">
      Unlock powerful AI tools to elevate your studies.
    </p>
    <p className="price__pricing__subs__page">
      <span className="currency">₹</span>129<span className="per"> / Month</span>
    </p>

    {isPremium ? (
           <button className="button__pricing__subs__page">
           You have Premium!
         </button>
    ) : (
      <button className="button__pricing__subs__page" onClick={handlePayment}>
        Upgrade to Premium
      </button>
    )}

    <p className="users-count">Join 10,000+ students using Edusify Premium</p>
  </div>


{/* Plan Includes */}
<div className="card__features__pricing__subs__page">
  <h3 className="title__features__pricing__subs__page">Everything You Unlock</h3>
  <p className="subtitle__features__pricing__subs__page" style={{marginTop: '30px', marginBottom: "30px"}}>
  Get it all for just ₹129 – Invest in your future for the cost of a snack! 🍫
  </p>

  {/* AI-Powered Study Features */}
  <div className="feature-category__pricing__subs__page">
    <h4 className="category-title__pricing__subs__page">AI Study Tools – Study Smarter, Not Harder</h4>
    <ul className="features-list__pricing__subs__page">
      {[
        { icon: "⚡", text: "Unlimited Magic Usage", desc: "Transform AI answers into notes, quizzes & flashcards instantly." },
        { icon: "📖", text: "Unlimited AI Quiz Generation", desc: "Generate chapter-wise quizzes in seconds—never run out of practice questions!" },
        { icon: "📝", text: "Unlimited AI Study Plan Generations", desc: "Get customized study plans based on your schedule & goals." },
        { icon: "📄", text: "Unlimited AI Notes Generation", desc: "Create structured, exam-ready notes from any topic instantly." },
        { icon: "📑", text: "Unlimited PDF to Notes", desc: "Extract & summarize PDFs into well-organized study notes effortlessly." },
      ].map((feature, index) => (
        <li key={index} className="feature-item__pricing__subs__page">
          <span className="checkmark__pricing__subs__page"></span> 
          <strong className="feature-title">{feature.text}</strong>
          <p className="feature-description">{feature.desc}</p>
        </li>
      ))}
    </ul>
  </div>

  {/* AI-Powered Smart Assistance */}
  <div className="feature-category__pricing__subs__page">
    <h4 className="category-title__pricing__subs__page">Smart Assistance – Let AI Do the Hard Work</h4>
    <ul className="features-list__pricing__subs__page">
      {[
        { icon: "⏳", text: "AI Pomodoro Recommendations", desc: "Get AI-suggested session durations based on your fatigue & progress." },
        { icon: "✅", text: "AI Task Generation", desc: "Let AI break down complex topics into easy-to-follow tasks." },
        { icon: "📌", text: "AI Plan Tasks Generation", desc: "Your study plan just got smarter—AI auto-generates tasks for you." },
        { icon: "📊", text: "AI Quiz Results Analysis", desc: "See where you went wrong & get insights to improve instantly." },
        { icon: "📚", text: "AI Flashcards Explain", desc: "Confused? AI explains each flashcard in detail so you truly understand it." },
      ].map((feature, index) => (
        <li key={index} className="feature-item__pricing__subs__page">
          <span className="checkmark__pricing__subs__page"></span> 
          <strong className="feature-title">{feature.text}</strong>
          <p className="feature-description">{feature.desc}</p>
        </li>
      ))}
    </ul>
  </div>

  {/* Advanced Study Tools */}
  <div className="feature-category__pricing__subs__page">
    <h4 className="category-title__pricing__subs__page">Advanced Study Tools – Take Learning to the Next Level</h4>
    <ul className="features-list__pricing__subs__page">
      {[
        { icon: "📜", text: "AI PDF to Quiz", desc: "Upload any PDF & AI generates quizzes from it automatically!" },
        { icon: "🔄", text: "AI PDF to Flashcards", desc: "Convert PDFs into AI-generated flashcards for quick revision." },
        { icon: "🎓", text: "Notes to Quiz", desc: "Turn your notes into quizzes to test yourself efficiently." },
        { icon: "🃏", text: "Notes to Flashcards", desc: "Instantly convert long notes into bite-sized flashcards for quick recall." },
      ].map((feature, index) => (
        <li key={index} className="feature-item__pricing__subs__page">
          <span className="checkmark__pricing__subs__page"></span> 
          <strong className="feature-title">{feature.text}</strong>
          <p className="feature-description">{feature.desc}</p>
        </li>
      ))}
    </ul>
  </div>
</div>
<FooterNav/>
</div>

  );
};

export default PaymentComponent;
