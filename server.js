const express = require('express');
const app = express();
require('dotenv').config();
require('./bot'); // تشغيل البوت

app.get('/', (req, res) => {
  res.send('✅ KHALID Bot is running successfully.');
});

const PORT = process.env.PORT || 5000; // أو 3000، لكن 5000 ممتاز لـ Replit

// ✅ هذا أهم سطر: خليه يستمع على 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
