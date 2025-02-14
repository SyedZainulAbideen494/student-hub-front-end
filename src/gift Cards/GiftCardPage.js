import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiGift,FiCopy, FiCheckCircle, FiXCircle, FiX, FiCreditCard, FiUserPlus, FiSend, FiArrowLeft, FiLock } from 'react-icons/fi';
import './GiftCardPage.css';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';

const GiftCardPage = () => {
  const [giftCardCode, setGiftCardCode] = useState('');
  const [message, setMessage] = useState('');
  const [giftCards, setGiftCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isPremium, setIsPremium] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const fetchGiftCards = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const { data } = await axios.get(API_ROUTES.getGiftCards, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGiftCards(data.giftCards);
    } catch (error) {
      console.error('Error fetching gift cards:', error);
    }
  };

  const handleBuyGiftCard = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Please log in to buy a gift card.');

      const { data } = await axios.post(API_ROUTES.buyGiftCard, {
        amount: 99,
        currency: 'INR',
        token,
      });

      const options = {
        key: 'rzp_live_jPX6SxetQbApHC',
        amount: data.order.amount,
        currency: 'INR',
        order_id: data.order.id,
        name: 'Edusify Gift Card',
        description: '1 Month Premium Gift Card',
        handler: async (response) => {
          await axios.post(API_ROUTES.verifyGiftCardPayment, {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            token,
            giftCardCode: data.giftCardCode,
          });

      setGeneratedCode(data.giftCardCode); // Show code after purchase
          fetchGiftCards();
        },
        theme: { color: '#000' },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error('Error purchasing gift card:', error);
      alert('Failed to purchase gift card.');
    }
  };

  const handleRedeemGiftCard = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Please log in to redeem a gift card.');

      const { data } = await axios.post(API_ROUTES.redeemGiftCard, {
        giftCardCode,
        token,
      });

      setMessage(data.success ? `Premium activated for ${data.message}` : 'Invalid or already redeemed gift card.');
      fetchGiftCards();
    } catch (error) {
      console.error('Error redeeming gift card:', error);
      setMessage('Failed to redeem gift card.');
    }
  };

  const handleFetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Please log in to send a gift.');

      const { data } = await axios.get(API_ROUTES.fetchGiftFriendsModal, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFriends(data.friends);
      setIsFriendsModalOpen(true);
    } catch (error) {
      console.error('Error fetching friends:', error);
      alert('Failed to fetch friends.');
    }
  };

  const handleGiftToFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !generatedCode) return alert('Invalid action.');

      await axios.post(API_ROUTES.giftPremiumTofriend, {
        friendId,
        giftCardCode: generatedCode,
        token,
      });

      alert('Gift card sent successfully!');
      setIsFriendsModalOpen(false);
      fetchGiftCards();
    } catch (error) {
      console.error('Error gifting gift card:', error);
      alert('Failed to gift card.');
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


  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="gift-card-container">
<div className="gift-card-header">
  <button className="gift-card-back-btn" onClick={handleBack}>
    <FiArrowLeft />
  </button>
  <h2 className="gift-card-title"><FiCreditCard /> Gift Cards</h2>
</div>


      <div className="gift-card-section">
        <h3><FiGift /> Buy a Gift Card</h3>
        <p className="gift-card-price">₹99 - 1 Month Premium</p>
        <button onClick={handleBuyGiftCard} className="gift-card-button">Buy Now</button>

        {generatedCode && (
  <div className="gift-card-generated__gift__Card__gift__friend__page">
    <p>Your Gift Card Code: <strong>{generatedCode}</strong></p>
    
    {/* Copy Button */}
    <button 
      className="gift-card-give__gift__Card__gift__friend__page" 
      onClick={() => {
        navigator.clipboard.writeText(generatedCode);
        alert("Gift card code copied!");
      }}
    >
      <FiCopy /> Copy Code
    </button>

    <button onClick={handleFetchFriends} className="gift-card-give__gift__Card__gift__friend__page">
      <FiUserPlus /> Give to Friend
    </button>
  </div>
)}

      </div>

      {isFriendsModalOpen && (
  <div className="gift-card-modal-overlay__gift__Card__gift__friend__page" onClick={() => setIsFriendsModalOpen(false)}>
    <div className="gift-card-modal__gift__Card__gift__friend__page" onClick={(e) => e.stopPropagation()}>
      <div className="gift-card-modal-content__gift__Card__gift__friend__page">
        <h3>Select a Friend</h3>
        <button onClick={() => setIsFriendsModalOpen(false)} className="gift-card-close__gift__Card__gift__friend__page"><FiX /></button>
        <ul className="gift-card-list">
          {friends.map(friend => (
            <li key={friend.id} className="gift-card-item__gift__Card__gift__friend__page">
              <span>{friend.unique_id}</span>
              <button onClick={() => handleGiftToFriend(friend.id)} className="gift-card-gift-butto__gift__Card__gift__friend__pagen">
                <FiSend /> Gift
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)}

  

      <div className="gift-card-section">
        <h3><FiCheckCircle /> Redeem a Gift Card</h3>
        {isPremium ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <button 
            className="action__button__today__ai__pan_overview__locked__premium__"
            disabled
          >
            <FiLock className="lock-icon" /> You already have <span>Premium</span>
          </button>
        </div>        
    ) : (
        <div>
        <input
          type="text"
          placeholder="Enter gift card code"
          value={giftCardCode}
          onChange={(e) => setGiftCardCode(e.target.value)}
          className="gift-card-input"
        />
        <button onClick={handleRedeemGiftCard} className="gift-card-button">Redeem</button>
     </div>
    )}
      </div>

      {message && <p className="gift-card-message">{message}</p>}

      <button onClick={() => setIsModalOpen(true)} className="gift-card-view-button">
        View My Gift Cards
      </button>

      {isModalOpen && (
        <div className="gift-card-modal">
          <div className="gift-card-modal-content">
            <h3>My Gift Cards</h3>
            <button onClick={() => setIsModalOpen(false)} className="gift-card-close"><FiX /></button>

            <ul className="gift-card-list">
            {giftCards.length > 0 ? (
  giftCards.map((card, index) => {
    const isExpired = card.status === 'used'; // Check status instead of expiry date

    return (
      <li key={index} className={`gift-card-item ${isExpired ? 'used' : 'valid'}`}>
        <span><strong>Code:</strong> {card.code}</span>
        <span className="gift-card-status">
          {isExpired ? <FiXCircle className="expired-icon" /> : <FiCheckCircle className="valid-icon" />}
        </span>
      </li>
    );
  })
) : (
  <p>No gift cards found.</p>
)}

            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftCardPage;
