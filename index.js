require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Создаем бота с токеном из переменной окружения
const bot = new TelegramBot(process.env.BOT_TOKEN);

// Обработчик команды /start
async function handleStart(chatId) {
  const welcomeMessage = 'Добро пожаловать! Нажмите кнопку ниже, чтобы запустить приложение.';

  const keyboard = {
    inline_keyboard: [
      [{ text: 'Запустить приложение', url: 'https://t.me/WeAiBot_bot/WeAi' }]
    ]
  };

  await bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: JSON.stringify(keyboard)
  });
}

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { body } = req;
    if (body.message && body.message.text === '/start') {
      await handleStart(body.message.chat.id);
    }
    res.status(200).send('OK');
  } else {
    res.status(200).send('Бот работает');
  }
};
