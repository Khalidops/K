// bot.js

const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const { analyzeMarket } = require('./analyzer/marketAnalyzer');

// ✅ تأكيد قراءة التوكن من المتغير البيئي الصحيح
const token = process.env.BOT_TOKEN;
const userId = process.env.USER_CHAT_ID;

if (!token) {
  console.error('❌ لم يتم العثور على التوكن. تأكد من تعيين BOT_TOKEN في Replit Secrets');
  process.exit(1); // إيقاف التشغيل إذا ما فيه توكن
}

console.log('✅ التوكن تم تحميله بنجاح');

const bot = new TelegramBot(token, { polling: true });

// إعدادات المستخدم
const lang = process.env.LANG || 'ar';
const audioEnabled = process.env.AUDIO_ALERT === 'true';
const interval = parseInt(process.env.ANALYZE_INTERVAL || '60'); // بالثواني

// رسائل البوت
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
  console.log('📥 وصلك أمر /start من:', msg.chat.id);

  if (msg.chat.id.toString() !== userId) {
    console.log('⛔ تم تجاهل المستخدم غير المصرح له');
    return;
  }

  bot.sendMessage(msg.chat.id, messages[lang].welcome);
});

// تحليل السوق بشكل دوري
setInterval(async () => {
  try {
    const results = await analyzeMarket();

    for (const result of results) {
      if (result.strong) {
        const message = messages[lang].opportunity(result.symbol, result.direction, result.strength);
        bot.sendMessage(userId, message);

        if (audioEnabled) {
          bot.sendVoice(userId, './assets/alert.ogg'); // تأكد من وجود الملف
        }
      }
    }
  } catch (err) {
    console.error('❌ خطأ أثناء التحليل:', err.message);
  }
}, interval * 1000);
