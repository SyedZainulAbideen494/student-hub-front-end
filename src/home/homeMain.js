import React,{Fragment, useEffect, useState} from "react";
import './homeMain.css'
import HomeTopBoxes from "./homeTopCards";
import TodayEventsAndTasks from "./homeTodayData";
import FooterNav from "../app_modules/footernav";
import TipBox from "../Tip box/TipBox";
import FeedbackForm from "../help/FeedbackForm";
import InviteFriends from "../help/InviteFriends";
import QuoteCard from "./dailyquote";
import { useNavigate } from "react-router-dom";
import ReviewModal from "../help/ReviewModal";
import AppUpdates from "./AppUpdates";
import ExploreCard from "./ExploreCard";
import SeasonalBanner from "./seasionalBanner";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";
import BirthdayModal from "../app_modules/TakeBirthDay";
import BirthdayCelebration from "../app_modules/birthdayCelebrate";
const HomeMain = () => {
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const navigate = useNavigate()


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


    return<Fragment>
      <BirthdayCelebration/>
      <TipBox/>
        <ReviewModal/>
        <HomeTopBoxes/>
        <TodayEventsAndTasks/>
<div style={{ margin: '20px 0' }}>
 <InviteFriends/>
</div>
<div style={{ marginBottom: '90px' }}>
        <div class="button-container__feedback__btn__planner__page">
    <button onClick={toggleFeedbackForm} style={{
        backgroundColor: 'transparent',
        color: '#48cae4',
        border: 'none',
        cursor: 'pointer',
        padding: '10px',
      }} >
        {showFeedbackForm ? 'Cancel' : 'Provide Feedback'}
    </button>
</div>

            {showFeedbackForm && <FeedbackForm />}
</div>

        <FooterNav/>
    </Fragment>
}

export default HomeMain