import React, { useState } from 'react';
import axios from 'axios';

function PaymentForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentUrl, setPaymentUrl] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/create-payment/insta/mojo', {
        name,
        email,
        phone,
        amount
      });

      if (response.data.paymentUrl) {
        setPaymentUrl(response.data.paymentUrl);
      }
    } catch (err) {
      console.error('Error during payment creation:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div>
      <h2>Instamojo Payment</h2>
      <form onSubmit={handlePayment}>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Phone</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <label>Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <button type="submit">Pay Now</button>
      </form>

      {paymentUrl && (
        <div>
          <h3>Proceed with Payment:</h3>
          <a href={paymentUrl} target="_blank" rel="noopener noreferrer">Pay Here</a>
        </div>
      )}
    </div>
  );
}

export default PaymentForm;
