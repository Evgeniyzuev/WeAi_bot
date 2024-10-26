require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Создаем бота с токеном из переменной окружения
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = 'Добро пожаловать! Нажмите кнопку ниже, чтобы запустить приложение.';

  const keyboard = {
    inline_keyboard: [
      [{ text: 'Запустить приложение', url: 'https://t.me/WeAiBot_bot/WeAi' }]
    ]
  };

  bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: JSON.stringify(keyboard)
  });
});

console.log('Бот запущен');
