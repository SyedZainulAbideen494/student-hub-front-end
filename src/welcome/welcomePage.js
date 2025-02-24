import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import './welcome.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const Welcome = () => {
    const [transition, setTransition] = useState('');
    const [offerPrice, setOfferPrice] = useState(59); // Discounted price

    useEffect(() => {
        setTransition('show');
    }, []);

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to subscribe.');
                return;
            }

            const planAmount = offerPrice === 59 ? 59 : 99; // Check if user skips

            const { data } = await axios.post(API_ROUTES.getPremium, {
                amount: planAmount,
                currency: 'INR',
                subscription_plan: 'monthly',
                token,
                duration: '1 month',
            });

            const options = {
                key: 'rzp_live_jPX6SxetQbApHC',
                amount: data.order.amount,
                currency: 'INR',
                order_id: data.order.id,
                name: 'Edusify',
                description: 'Exclusive Study Experience',
                handler: async (response) => {
                    const { data } = await axios.post('YOUR_VERIFY_ENDPOINT', {
                        payment_id: response.razorpay_payment_id,
                        order_id: response.razorpay_order_id,
                        signature: response.razorpay_signature,
                        token,
                        subscription_plan: 'monthly',
                        duration: '1 month',
                    });

                    if (data.success) {
                        alert('Subscription Activated!');
                    } else {
                        alert('Payment verification failed!');
                    }
                },
                theme: { color: '#ff79c6' },
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.open();
        } catch (error) {
            console.error('Error initiating payment', error);
        }
    };

    return (
        <div className={`welcome__container__Welcome__page__new ${transition}`}>
            <h1 className="welcome__title__Welcome__page__new">Welcome to Edusify </h1>
            <p className="welcome__subtitle__Welcome__page__new">The study app that just <strong>gets</strong> you.</p>

            <div className="welcome__premium__section__Welcome__page__new">
                <h3 className="premium__title__Welcome__page__new">🎀 Special Offer: ₹59/month</h3>
                <p className="premium__description__Welcome__page__new">Get everything. No limits. Just perfect.</p>

                <button onClick={handlePayment} className="premium__button__Welcome__page__new">
                    <FaStar className="premium__icon__Welcome__page__new" /> Claim Now
                </button>

                <button
                    className="notnow__button__Welcome__page__new"
                    onClick={() => setOfferPrice(99)}
                >
                    Not Now <span className="fomo__text__Welcome__page__new">(Next time: ₹99/month)</span>
                </button>
            </div>
        </div>
    );
};

export default Welcome;
