// server.js

const express = require('express');
const app = express();
require('dotenv').config();
require('./bot'); // تشغيل البوت

app.get('/', (req, res) => {
  res.send('✅ KEO Trading Bot is running.');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
