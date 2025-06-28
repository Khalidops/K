const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { chatId, botToken, lang, soundAlert } = require('../config');

const soundFile = path.join(__dirname, 'alert.mp3');

const playSound = () => {
  if (soundAlert) {
    try {
      require('child_process').exec(`ffplay -nodisp -autoexit ${soundFile}`);
    } catch (err) {
      console.error('فشل تشغيل التنبيه الصوتي:', err.message);
    }
  }
};

const sendTelegramAlert = async (message) => {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown',
  };

  try {
    await axios.post(url, payload);
    playSound();
  } catch (error) {
    console.error('فشل إرسال تنبيه التليجرام:', error.message);
  }
};

module.exports = {
  sendTelegramAlert,
  playSound,
};
