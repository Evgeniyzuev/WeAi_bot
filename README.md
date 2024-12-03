
# Документация проекта WeAi

## 1. Общее описание
WeAi - это Telegram Mini App, разработанное на Next.js, представляющее собой многофункциональную платформу с элементами геймификации и интеграцией с блокчейном TON.

## 2. Структура проекта

### 2.1 Основные компоненты:
- **Core** - Ядро приложения, отвечающее за основную логику и расчёты
- **AI** - Интерфейс взаимодействия с ИИ
- **Wallet** - Криптокошелёк с поддержкой TON
- **Tasks** - Система заданий и достижений
- **Friends** - Реферальная система
- **Goals** - Система целей и планирования

### 2.2 Технологический стек:
- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (ORM)
- TON SDK
- Telegram Web App SDK

## 3. Основные функциональные модули

### 3.1 Система ИИ

- Реализует чат с ИИ
- Поддерживает многоязычность (русский/английский)
- Сохраняет историю диалогов
- Интегрирована с системой уровней пользователя

### 3.2 Криптокошелёк

- Поддержка TON
- Мультивалютное отображение баланса (USD, RUB, CNY, INR)
- Система транзакций
- Интеграция с TON Connect

### 3.3 Система заданий

- Динамическая система заданий
- Награды за выполнение
- Интеграция с другими модулями
- Сохранение прогресса

### 3.4 Реферальная система

- Многоуровневая реферальная программа
- Отслеживание рефералов
- Система вознаграждений
- Интеграция с Telegram

## 4. Конфигурация и настройка

### 4.1 Установка и запуск
```bash
npm install
npm run dev
```

### 4.2 Переменные окружения
Необходимые переменные окружения:
- `NEXT_PUBLIC_DEPLOYER_WALLET_MNEMONIC`
- `NEXT_PUBLIC_MAINNET_TONCENTER_API_KEY`
- `DATABASE_URL`

## 5. Архитектурные особенности

### 5.1 Контекст и состояние
- UserContext - управление данными пользователя
- LanguageContext - многоязычность
- WalletContext - состояние кошелька

### 5.2 API endpoints
- `/api/user` - управление пользователями
- `/api/chat` - взаимодействие с ИИ
- `/api/complete-task` - система заданий
- `/api/check-membership` - проверка подписок

## 6. Безопасность
- Интеграция с Telegram авторизацией
- Проверка подписи транзакций
- Валидация данных на сервере
- Защита API endpoints

## 7. Масштабирование и производительность
- Кэширование данных в localStorage
- Оптимизация запросов к базе данных
- Lazy loading компонентов
- Оптимизация изображений

## 8. Дальнейшее развитие
- Интеграция новых блокчейн-функций
- Расширение функционала ИИ
- Добавление новых языков
- Развитие геймификации

Эта документация предоставляет общий обзор проекта и его основных компонентов. Для более детальной информации по конкретным модулям, обратитесь к соответствующим разделам кода.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
