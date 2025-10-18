const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({error:'Unauthorized'});
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) { return res.status(401).json({error:'Invalid token'}); }
}

router.get('/stats', authMiddleware, async (req, res) => {
  const totalQ = await db.query('SELECT COUNT(*) FROM registrants');
  const paidQ = await db.query("SELECT COUNT(*) FROM registrants WHERE payment_status='PAID'");
  const unpaidQ = await db.query("SELECT COUNT(*) FROM registrants WHERE payment_status!='PAID'");
  res.json({
    total: totalQ.rows[0].count,
    paid: paidQ.rows[0].count,
    unpaid: unpaidQ.rows[0].count
  });
});

router.get('/registrants', authMiddleware, async (req, res) => {
  const {search, status, limit=100, offset=0} = req.query;
  let base = 'SELECT * FROM registrants';
  const where = [];
  const params = [];
  if(search) {
    params.push(`%${search}%`);
    where.push(`(full_name ILIKE $${params.length} OR email ILIKE $${params.length} OR phone ILIKE $${params.length})`);
  }
  if(status) {
    params.push(status);
    where.push(`payment_status = $${params.length}`);
  }
  if(where.length) base += ' WHERE ' + where.join(' AND ');
  params.push(limit, offset);
  base += ` ORDER BY created_at DESC LIMIT $${params.length-1} OFFSET $${params.length}`;
  const q = await db.query(base, params);
  res.json({ rows: q.rows });
});

router.post('/attend/:registration_id', authMiddleware, async (req, res)=>{
  const rid = req.params.registration_id;
  await db.query('UPDATE registrants SET attended=true WHERE registration_id=$1', [rid]);
  res.json({ ok: true });
});

module.exports = router;
