import React, { useState } from 'react';
import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:5000/api' });

export default function RegistrationForm({ onRegistered }) {
  const [form, setForm] = useState({ full_name:'', age:'', email:'', phone:'', country:'Ghana', occupation:'', interest_area:'Digital Marketing', experience:'', program_type:'Workshop' });
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await API.post('/register', form);
      setLoading(false);
      onRegistered(res.data.registrant);
    } catch(err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed');
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>Register for CTW Christmas Workshop</h2>
      <input name="full_name" required placeholder="Full name" value={form.full_name} onChange={handle} style={{width:'100%', padding:8, margin:'8px 0'}}/>
      <input name="age" type="number" placeholder="Age" value={form.age} onChange={handle} style={{width:'100%', padding:8, margin:'8px 0'}}/>
      <input name="email" type="email" required placeholder="Email" value={form.email} onChange={handle} style={{width:'100%', padding:8, margin:'8px 0'}}/>
      <input name="phone" required placeholder="Phone" value={form.phone} onChange={handle} style={{width:'100%', padding:8, margin:'8px 0'}}/>
      <select name="interest_area" value={form.interest_area} onChange={handle} style={{width:'100%', padding:8, margin:'8px 0'}}>
        <option>Digital Marketing</option>
        <option>Coding</option>
        <option>Design</option>
      </select>
      <button type="submit" disabled={loading} style={{padding:'10px 16px'}}>{loading ? 'Saving...' : 'Continue to payment'}</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
}
