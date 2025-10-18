const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const q = await db.query('SELECT * FROM users WHERE email=$1 AND role=$2', [email, 'admin']);
  if (!q.rowCount) return res.status(401).json({ error: 'Invalid credentials' });
  const user = q.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

module.exports = router;
