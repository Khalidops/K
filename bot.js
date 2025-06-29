const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const { botToken, chatId, lang, soundAlert } = require('./config');
const { sendTelegramAlert } = require('./utils/notifier');
const analyzeMarket = require('./analyzer/marketAnalyzer');
const candlesData = require('./data/mockCandles'); // مؤقتاً حتى يتم ربط API فعلي

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
  settingsCommand(bot, msg, { lang, soundAlert });
});

const startMonitoring = () => {
  interval = setInterval(() => {
    if (!isRunning) return;

    const symbols = Object.keys(candlesData);
    symbols.forEach((symbol) => {
      const candles = candlesData[symbol];
      const result = analyzeMarket(symbol, candles);
      if (result) {
        const { signal, strategy, indicators, price, time } = result;

        const message = `
📊 *إشارة جديدة*  
العملة: *${symbol}*  
الإستراتيجية: *${strategy}*  
الإشارة: *${signal === 'buy' ? 'شراء 🔼' : 'بيع 🔽'}*  
السعر: *${price}*
الوقت: *${new Date(time).toLocaleString('ar-EG')}*
RSI: ${indicators.rsi} | EMA: ${indicators.ema} | MACD: ${indicators.macd.histogram}
        `.trim();

        sendTelegramAlert(message);
      }
    });
  }, 60 * 1000); // كل دقيقة
};

console.log('🤖 البوت يعمل الآن...');
