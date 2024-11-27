require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

// Создаем бота с токеном из переменной окружения
const bot = new TelegramBot(process.env.BOT_TOKEN);

// Простое хранение пользователей в памяти (в реальном проекте лучше использовать базу данных)
const users = new Set();

// Обработчик команды /start
async function handleStart(chatId) {
  const welcomeMessage = 'Добро пожаловать! Нажмите кнопку ниже, чтобы запустить приложение.';
  
  const keyboard = {
    inline_keyboard: [
      [{ text: 'Запустить приложение', url: 'https://t.me/WeAiBot_bot/WeAi' }]
    ]
  };

  // Добавляем пользователя в список
  users.add(chatId);
  
  await bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: JSON.stringify(keyboard)
  });
}

// Функция ежедневной рассылки
async function sendDailyMessage() {
  const message = 'Не забудьте запустить приложение сегодня!';
  const keyboard = {
    inline_keyboard: [
      [{ text: 'Запустить приложение', url: 'https://t.me/WeAiBot_bot/WeAi' }]
    ]
  };

  const failedDeliveries = [];

  for (const chatId of users) {
    try {
      await bot.sendMessage(chatId, message, {
        reply_markup: JSON.stringify(keyboard)
      });
      // Добавляем небольшую задержку между отправками
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Ошибка отправки сообщения пользователю ${chatId}:`, error.message);
      
      // Если пользователь заблокировал бота или чат не найден, удаляем его из списка
      if (error.code === 'ETELEGRAM' && 
         (error.response.body.error_code === 403 || error.response.body.error_code === 400)) {
        users.delete(chatId);
        console.log(`Пользователь ${chatId} удален из списка рассылки`);
      }
      
      failedDeliveries.push({
        chatId,
        error: error.message
      });
    }
  }

  // Логируем общую статистику отправки
  console.log(`Рассылка завершена:
    - Всего пользователей: ${users.size}
    - Ошибок доставки: ${failedDeliveries.length}
  `);

  if (failedDeliveries.length > 0) {
    console.log('Детали ошибок:', JSON.stringify(failedDeliveries, null, 2));
  }
}

// Запускаем планировщик (каждый день в 10:00)
cron.schedule('0 10 * * *', () => {
  sendDailyMessage();
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { body } = req;
    
    // Обработка команды /start
    if (body.message && body.message.text === '/start') {
      await handleStart(body.message.chat.id);
      res.status(200).send('OK');
      return;
    }
    
    // Защищенный эндпоинт для крон-задачи
    if (body.cronToken === process.env.CRON_SECRET) {
      console.log('Запуск ежедневной рассылки через cron-job.org');
      await sendDailyMessage();
      res.status(200).send('Рассылка выполнена');
      return;
    }
    
    res.status(400).send('Неверный запрос');
  } else {
    res.status(200).send('Бот работает');
  }
};
