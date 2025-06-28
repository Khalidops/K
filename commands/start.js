module.exports = (bot, msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'تم تفعيل البوت بنجاح! أهلاً بك.');
};
