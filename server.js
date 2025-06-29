const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('🤖 بوت التداول يعمل حالياً.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
