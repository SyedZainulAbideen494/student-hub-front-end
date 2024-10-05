import React, { useState } from "react";
import axios from "axios";

const PaymentButton = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const handlePayment = () => {
    const paymentData = { name, email, phone, amount };

    axios
      .post("http://localhost:8080/create-payment/insta/mojo", paymentData)
      .then(response => {
        // Redirect user to Instamojo payment page
        if (response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          alert("Payment request failed");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Payment request error");
      });
  };

  return (
    <div>
      <h3>Make a Payment</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentButton;
