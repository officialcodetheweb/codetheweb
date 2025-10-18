const express = require('express');
const axios = require('axios');
const db = require('../db');
const router = express.Router();
require('dotenv').config();

router.post('/init', async (req, res) => {
  const { registrantId, amount } = req.body;
  if(!registrantId || !amount) return res.status(400).json({error:'Missing data'});
  try {
    const registrantRes = await db.query('SELECT * FROM registrants WHERE id=$1', [registrantId]);
    if (registrantRes.rowCount === 0) return res.status(404).json({error:'Registrant not found'});

    const reference = `ctw_${Date.now()}_${Math.floor(Math.random()*10000)}`;
    const payload = {
      email: registrantRes.rows[0].email,
      amount: Math.round(Number(amount) * 100),
      currency: "GHS",
      reference,
      metadata: { registrantId }
    };

    const paystackRes = await axios.post('https://api.paystack.co/transaction/initialize', payload, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
    });

    await db.query(
      `INSERT INTO payments (registrant_id, ref, amount, currency, gateway, status, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [registrantId, reference, payload.amount, payload.currency, 'paystack', 'PENDING', JSON.stringify(payload.metadata)]
    );

    res.json({ authorization_url: paystackRes.data.data.authorization_url, reference });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({error:'Payment init failed'});
  }
});

router.post('/webhook', async (req, res) => {
  const event = req.body;
  try {
    if(event.event === 'charge.success' || event.event === 'payment.success') {
      const data = event.data || {};
      const ref = data.reference || data.reference;
      await db.query('UPDATE payments SET status=$1 WHERE ref=$2', ['SUCCESS', ref]);
      const q = await db.query('SELECT registrant_id FROM payments WHERE ref=$1', [ref]);
      if (q.rowCount) {
        const rid = q.rows[0].registrant_id;
        await db.query('UPDATE registrants SET payment_status=$1, payment_ref=$2 WHERE id=$3', ['PAID', ref, rid]);
      }
    }
    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'webhook error' });
  }
});

router.get('/verify/:reference', async (req,res) => {
  const ref = req.params.reference;
  try {
    const payRes = await axios.get(`https://api.paystack.co/transaction/verify/${ref}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
    });
    const status = payRes.data.data.status;
    await db.query('UPDATE payments SET status=$1 WHERE ref=$2', [status, ref]);
    if (status === 'success') {
      const q = await db.query('SELECT registrant_id FROM payments WHERE ref=$1', [ref]);
      if (q.rowCount) {
        await db.query('UPDATE registrants SET payment_status=$1 WHERE id=$2', ['PAID', q.rows[0].registrant_id]);
      }
    }
    res.json({ ok: true, status: status });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'verify failed' });
  }
});

module.exports = router;
