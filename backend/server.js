require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const registerRouter = require('./routes/register');
const paymentRouter = require('./routes/payment');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors());
app.use(bodyParser.json({ verify: (req, res, buf) => { req.rawBody = buf } }));
app.use('/api/register', registerRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => res.send('CTW Registration Backend'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`));
