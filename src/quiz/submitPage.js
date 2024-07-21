import React from 'react';
import { useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import './quiz.css'
import FooterNav from '../app_modules/footernav';

const SubmitPage = () => {
    const location = useLocation();
    const score = location.state?.score || 0;

    return (
        <div className="submit-page">
        {score > 70 && <Confetti />}
        <h1 className="congratulations-title">Congratulations!</h1>
        <p className="score-text">You scored {score}%.</p>
        <p className="feedback-text">{score > 70 ? 'Awesome job!' : 'Keep practicing!'}</p>
        <FooterNav/>
    </div>
    );
};

export default SubmitPage;