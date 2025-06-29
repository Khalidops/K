const TelegramBot = require('node-telegram-bot-api');
const { botToken, chatId, lang, soundAlert, timeFrames } = require('./config');
const { sendTelegramAlert } = require('./utils/notifier');
const analyzeMarket = require('./analyzer/marketAnalyzer');
const candlesData = require('./data/mockCandles');

const startCommand = require('./commands/start');
const stopCommand = require('./commands/stop');
const statusCommand = require('./commands/status');
const settingsCommand = require('./commands/settings');

let isRunning = false;
let interval;

const bot = new TelegramBot(botToken, { polling: true });

bot.onText(/\/start/, (msg) => {
  startCommand(bot, msg);
  isRunning = true;
  if (!interval) startMonitoring();
});

bot.onText(/\/stop/, (msg) => {
  stopCommand(bot, msg);
  isRunning = false;
  clearInterval(interval);
  interval = null;
});

bot.onText(/\/status/, (msg) => {
  statusCommand(bot, msg, isRunning);
});

bot.onText(/\/settings/, (msg) => {
  settingsCommand(bot, msg, { lang, soundAlert, timeFrames });
});

const startMonitoring = () => {
  interval = setInterval(() => {
    if (!isRunning) return;

    const symbols = Object.keys(candlesData['1']); // نفترض جميع الفريمات تحتوي نفس العملات

    symbols.forEach((symbol) => {
      const result = analyzeMarket(symbol, candlesData);
      if (result) {
        const { signal, strategy, indicators, price, time, timeFrame } = result;

        // تعديل الوقت إلى توقيت السعودية +3 ساعات
        const date = new Date(time);
        date.setHours(date.getHours() + 3);
        const formattedTime = date.toLocaleString('ar-EG');

        const message = `
📊 *إشارة جديدة*  
العملة: *${symbol}*  
الإستراتيجية: *${strategy}*  
الإشارة: *${signal === 'buy' ? 'شراء 🔼' : 'بيع 🔽'}*  
السعر: *${price}*
مدة الصفقة المقترحة: *${timeFrame} دقيقة*
الوقت: *${formattedTime}*
RSI: ${indicators.rsi} | EMA: ${indicators.ema} | MACD: ${indicators.macd.histogram}
        `.trim();

        sendTelegramAlert(message);
      }
    });
  }, 60 * 1000);
};

console.log('🤖 البوت يعمل الآن...');
