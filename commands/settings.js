module.exports = (bot, msg, settings) => {
  const chatId = msg.chat.id;
  let text = 'إعدادات البوت الحالية:\n';

  if (settings.soundAlert) {
    text += '- التنبيه الصوتي مفعل\n';
  } else {
    text += '- التنبيه الصوتي معطل\n';
  }

  if (settings.lang === 'ar') {
    text += '- اللغة: العربية\n';
  } else {
    text += '- اللغة: غير محددة\n';
  }

  bot.sendMessage(chatId, text);
};
