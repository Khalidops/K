module.exports = (bot, msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'تم إيقاف البوت. شكراً لاستخدامك.');
};
