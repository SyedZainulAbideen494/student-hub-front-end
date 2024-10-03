import React,{Fragment, useState} from "react";
import './homeMain.css'
import HomeTopBoxes from "./homeTopCards";
import TodayEventsAndTasks from "./homeTodayData";
import FooterNav from "../app_modules/footernav";
import TipBox from "../Tip box/TipBox";
import FeedbackForm from "../help/FeedbackForm";
import InviteFriends from "../help/InviteFriends";
import QuoteCard from "./dailyquote";
import { useNavigate } from "react-router-dom";

const HomeMain = () => {
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const navigate = useNavigate()


        // Toggle feedback form visibility
        const toggleFeedbackForm = () => {
            setShowFeedbackForm(prev => !prev);
        };


    return<Fragment>
        <TipBox/>
        <HomeTopBoxes/>
        <TodayEventsAndTasks/>
<div style={{ margin: '20px 0' }}>
    <InviteFriends />
</div>
<div style={{ marginBottom: '90px' }}>
        <div class="button-container__feedback__btn__planner__page">
    <button onClick={toggleFeedbackForm} className='feedback__btn__planner__page'>
        {showFeedbackForm ? 'Cancel' : 'Provide Feedback'}
    </button>
</div>

            {showFeedbackForm && <FeedbackForm />}
</div>

        <FooterNav/>
    </Fragment>
}

export default HomeMain