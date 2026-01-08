import React, { Fragment, useEffect, useState } from "react";
import './homeMain.css';
import HomeTopBoxes from "./homeTopCards";
import TodayEventsAndTasks from "./homeTodayData";
import FooterNav from "../app_modules/footernav";
import TipBox from "../Tip box/TipBox";
import FeedbackForm from "../help/FeedbackForm";
import InviteFriends from "../help/InviteFriends";
import QuoteCard from "./dailyquote";
import { useLocation, useNavigate } from "react-router-dom";
import ReviewModal from "../help/ReviewModal";
import AppUpdates from "./AppUpdates";
import ExploreCard from "./ExploreCard";
import SeasonalBanner from "./seasionalBanner";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";
import BirthdayModal from "../app_modules/TakeBirthDay";
import BirthdayCelebration from "../app_modules/birthdayCelebrate";
import ModalHowTo from "../Pop ups/HowtoUsePopUp";
import FriendsDashboard from "./FriendsDashboard";
import FeedbackFormWeekly from "../help/Survey";
import DowntimePage from "../help/DowntimePage";
import AIDowntimeCard from "../help/AIDowntimeCard";
import PaymentComponentModal from "../premium/modal/SubscriptionPage";
import OneTimeOffer from "../premium/modal/onetimeModal";
import ValentineModal from "../gift Cards/modals/ValentineModal";
import ExamTimeOffer from "../premium/modal/exam-time-modal";
import SubscriptionRedirector from "../premium/SubscriptionRedirector";
import PomodoroChallengeBannerPremium from "../Challenges/PomodoroChallengeBannerPremium";
import GuideBanner from "../guides/neet/guideBanner";
import PremiumTeasePopup from "./PremiumTeasePopup";
import SpinWheel from "../spin wheel/SpinWheel";
import MadeWithLove from "../app_modules/madeWithLove";
import CheckSubscription from "../help/CheckSubscription";

const HomeMain = () => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
 const [isAIDown, setIsAIDown] = useState(true)
 const [location, setLocation] = useState(null);
 const [showPopup, setShowPopup] = useState(true);
 const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getLocation = () => {
      if (!localStorage.getItem("token")) {
        console.log("🚫 No token found. Waiting for authentication...");
        return; // Exit if no token is available
      }
  
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
  
            // Set location state
            setLocation({ latitude, longitude });
  
            // Check last update before sending to backend
            const lastUpdate = localStorage.getItem("lastLocationUpdate");
            const oneWeek = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds
            const now = Date.now();
  
            if (!lastUpdate || now - parseInt(lastUpdate) > oneWeek) {
              sendLocationToBackend(latitude, longitude);
              localStorage.setItem("lastLocationUpdate", now.toString()); // Update timestamp
            }
  
            setError(null);
          },
          (error) => {
            setError(error.message);
            setLocation(null);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };
  
    const sendLocationToBackend = (latitude, longitude) => {
      const token = localStorage.getItem("token"); // Get token from local storage
  
      if (!token) {
        console.error("🚫 User is not authenticated. Skipping location update.");
        return;
      }
  
      fetch(API_ROUTES.updateUserLocation, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
        body: JSON.stringify({ latitude, longitude }),
      })
        .then((response) => response.json())
        .then((data) => console.log("✅ Location updated:", data))
        .catch((err) => console.error("❌ Error updating location:", err));
    };
  
    // Check for token every 5 seconds until it's available
    const interval = setInterval(() => {
      if (localStorage.getItem("token")) {
        clearInterval(interval); // Stop checking once token is found
        getLocation();
      }
    }, 5000);
  
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Toggle feedback form visibility
  const toggleFeedbackForm = () => {
    setShowFeedbackForm(prev => !prev);
  };

  const token = localStorage.getItem('token'); // Replace with your auth token retrieval method

  // Function to log daily login
  const logDailyLogin = async () => {
    try {
      const response = await axios.post(
        API_ROUTES.trackLogins,
        {},
        { headers: { Authorization: token } }
      );
    } catch (error) {
      console.error('Error logging daily login:', error);
    }
  };

  // Log login on component mount
  useEffect(() => {
    logDailyLogin();
  }, []);


  

  return (
    <Fragment>
        <>
        <ReviewModal />
        <CheckSubscription/>
          <HomeTopBoxes />
          <TodayEventsAndTasks />
          <FriendsDashboard />
          <div style={{ marginTop: '20px'}}>
            <InviteFriends />
          </div>
          <MadeWithLove/>
          <FooterNav />
        </>
    </Fragment>
  );
};

export default HomeMain;

