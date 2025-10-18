import React, { useState } from 'react';
import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:5000/api' });

export default function PaymentButton({ registrant, amount, onPaid }) {
  const [loading,setLoading] = useState(false);

  const initPayment = async () => {
    setLoading(true);
    try {
      const res = await API.post('/payment/init', { registrantId: registrant.id, amount });
      const url = res.data.authorization_url;
      window.open(url, '_blank');
      setTimeout(async () => {
        const v = await API.get(`/payment/verify/${res.data.reference}`);
        if(v.data.status === 'success' || v.data.status === 'success') {
          onPaid();
        } else {
          alert('Payment not yet confirmed. Wait a moment and refresh your ticket page.');
        }
      }, 8000);
    } catch (err) {
      console.error(err);
      alert('Payment init failed');
    } finally { setLoading(false); }
  };

  return <button onClick={initPayment} disabled={loading}>{loading ? 'Processing...' : `Pay GHS ${amount}`}</button>;
}
