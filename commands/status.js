module.exports = (bot, msg, status) => {
  const chatId = msg.chat.id;
  const text = status
    ? 'البوت يعمل حالياً.'
    : 'البوت متوقف حالياً.';
  bot.sendMessage(chatId, text);
};
