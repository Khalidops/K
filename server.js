// server.js

const express = require('express');
const app = express();
const bot = require('./bot'); // هذا يستدعي كود البوت مباشرة

app.get('/', (req, res) => {
  res.send('✅ KEO Trading Bot is running.');
});

// Replit يخصص منفذ تلقائي، لذلك نستخدم process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
