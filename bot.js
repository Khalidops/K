// bot.js

const TelegramBot = require('node-telegram-bot-api');
const { analyzeMarket } = require('./analyzer/marketAnalyzer');

require('dotenv').config();

const token = process.env.BOT_TOKEN;
const userId = process.env.USER_CHAT_ID;

const bot = new TelegramBot(token, { polling: true });

// إعدادات المستخدم
const lang = process.env.LANG || 'ar';
const audioEnabled = process.env.AUDIO_ALERT === 'true';
const interval = parseInt(process.env.ANALYZE_INTERVAL || '60'); // بالثواني

// رسائل بوت ذكية
const messages = {
  ar: {
    welcome: '🤖 تم تفعيل بوت التداول بنجاح.\nسيتم تنبيهك بالفرص القوية تلقائيًا.',
    opportunity: (symbol, direction, strength) =>
      `📈 فرصة ${direction === 'buy' ? 'شراء' : 'بيع'} قوية على ${symbol}\nالقوة: ${strength}%`,
  },
  en: {
    welcome: '🤖 Trading bot activated.\nYou will receive strong signals automatically.',
    opportunity: (symbol, direction, strength) =>
      `📈 ${direction === 'buy' ? 'Buy' : 'Sell'} signal on ${symbol}\nStrength: ${strength}%`,
  },
};

// أمر /start
bot.onText(/\/start/, (msg) => {
  if (msg.chat.id.toString() !== userId) return;
  bot.sendMessage(msg.chat.id, messages[lang].welcome);
});

// تحليل السوق كل X ثانية
setInterval(async () => {
  try {
    const results = await analyzeMarket(); // تحليل العملات كلها

    for (const result of results) {
      if (result.strong) {
        const message = messages[lang].opportunity(result.symbol, result.direction, result.strength);
        bot.sendMessage(userId, message);

        if (audioEnabled) {
          bot.sendVoice(userId, './assets/alert.ogg'); // تأكد من وجود هذا الملف
        }
      }
    }
  } catch (err) {
    console.error('❌ خطأ أثناء التحليل:', err.message);
  }
}, interval * 1000);
