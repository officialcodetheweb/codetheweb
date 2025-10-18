const express = require('express');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { generateDataUri } = require('../utils/qrcode');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      full_name, age, email, phone,
      country, occupation, interest_area, experience, program_type
    } = req.body;
    if(!full_name || !email || !phone) return res.status(400).json({ error: 'Missing required fields' });

    const rn = Math.floor(Math.random()*90000)+10000;
    const registration_id = `CTW-CHRISTMAS-${rn}`;

    const insertQ = `
      INSERT INTO registrants (full_name, age, email, phone, country, occupation, interest_area, experience, program_type, registration_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`;
    const result = await db.query(insertQ, [
      full_name, age, email, phone, country, occupation, interest_area, experience, program_type, registration_id
    ]);
    const registrant = result.rows[0];

    const qr = await generateDataUri(registration_id);
    await db.query('UPDATE registrants SET qr_code=$1 WHERE id=$2', [qr, registrant.id]);

    return res.json({ registrant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
