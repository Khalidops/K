const TelegramBot = require('node-telegram-bot-api');
const { botToken } = require('../config');

const bot = new TelegramBot(botToken, { polling: false });

const sendMessage = (chatId, text) => {
  return bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
};

module.exports = {
  sendMessage,
  bot,
};
