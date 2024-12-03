require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('@prisma/client');

const bot = new TelegramBot(process.env.BOT_TOKEN);
const prisma = new PrismaClient();

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

// Функция ежедневной рассылки
async function sendDailyMessage() {
  const message = 'Проверить свой ежедневный доход!💵';
  const keyboard = {
    inline_keyboard: [
      [{ text: 'Запустить приложение', url: 'https://t.me/WeAiBot_bot/WeAi' }]
    ]
  };

  const failedDeliveries = [];

  try {
    // Получаем всех пользователей из базы данных
    const users = await prisma.user.findMany({
      select: {
        telegramId: true
      }
    });

    for (const user of users) {
      try {
        // Отправляем новое сообщение и получаем его message_id
        const sentMessage = await bot.sendMessage(user.telegramId, message, {
          reply_markup: JSON.stringify(keyboard)
        });

        // Пытаемся удалить предыдущее сообщение
        const previousMessageId = sentMessage.message_id - 1;
        await bot.deleteMessage(user.telegramId, previousMessageId);

        // Добавляем небольшую задержку между отправками
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Ошибка отправки сообщения пользователю ${user.telegramId}:`, error.message);
        
        // Если пользователь заблокировал бота или чат не найден, помечаем это в логах
        if (error.code === 'ETELEGRAM' && 
           (error.response.body.error_code === 403 || error.response.body.error_code === 400)) {
          console.log(`Пользователь ${user.telegramId} недоступен`);
        }
        
        failedDeliveries.push({
          chatId: user.telegramId,
          error: error.message
        });
      }
    }

    // Логируем общую статистику отправки
    console.log(`Рассылка завершена:
      - Всего пользователей: ${users.length}
      - Ошибок доставки: ${failedDeliveries.length}
    `);

    if (failedDeliveries.length > 0) {
      console.log('Детали ошибок:', JSON.stringify(failedDeliveries, null, 2));
    }

  } catch (error) {
    console.error('Ошибка при получении списка пользователей:', error);
    throw error;
  }
}

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
