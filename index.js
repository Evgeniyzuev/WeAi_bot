require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { MongoClient } = require('mongodb');
const cron = require('node-cron');

// Создаем бота с токеном из переменной окружения
const bot = new TelegramBot(process.env.BOT_TOKEN);
const mongoClient = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectToDatabase() {
  if (!db) {
    await mongoClient.connect();
    db = mongoClient.db('telegramBot');
  }
  return db;
}

async function saveChatId(chatId) {
  const database = await connectToDatabase();
  const users = database.collection('users');
  await users.updateOne({ chatId }, { $set: { chatId } }, { upsert: true });
}

async function getAllChatIds() {
  const database = await connectToDatabase();
  const users = database.collection('users');
  const allUsers = await users.find({}).toArray();
  return allUsers.map(user => user.chatId);
}

async function sendDailyMessage() {
  const chatIds = await getAllChatIds();
  const dailyMessage = 'Не забудьте проверить свой кошелек сегодня!';
  for (const chatId of chatIds) {
    await bot.sendMessage(chatId, dailyMessage);
  }
}

// Обработчик команды /start
async function handleStart(chatId) {
  const welcomeMessage = 'Добро пожаловать! Нажмите кнопку ниже, чтобы начать путь к 1.000.000$';

  const keyboard = {
    inline_keyboard: [
      [{ text: 'Start WeAi', url: 'https://t.me/WeAiBot_bot/WeAi' }]
    ]
  };

  await bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: JSON.stringify(keyboard)
  });

  await saveChatId(chatId);
}

// Запускаем задачу отправки ежедневного сообщения
cron.schedule('0 12 * * *', sendDailyMessage);

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
