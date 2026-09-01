# 💊 Аптечка

Веб-приложение для управления лекарствами и отслеживания их приёма.
Приложение позволяет хранить список лекарств, добавлять и редактировать препараты, отмечать их приём и просматривать историю.
---

## ✨ Возможности

- 🔐 Регистрация и авторизация пользователей
- 💊 Добавление и управление лекарствами
- 📋 Персональный список препаратов
- ⏰ Отметка факта приёма лекарства
- 📊 История приёма
- 🔒 Защищённые API-маршруты
- 🍪 Аутентификация через HTTP cookies
- 📱 Адаптивный интерфейс
- ⚡ Взаимодействие с API через Axios
- 🗄️ Хранение данных в SQLite

---

## 🛠️ Стек

### Frontend

- React
- TypeScript
- Vite
- SCSS / CSS Modules
- Axios

### Backend

- Node.js
- Express
- TypeScript
- SQLite
- JWT
- Cookie Parser
- CORS

### Деплой

- Frontend — Netlify
- Backend — Render

---

## 🏗️ Архитектура

Проект разделён на два независимых приложения:

```
apptechka/
│
├── client/                 # Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── ...
│   └── ...
│
└── server/                 # Backend
    ├── src/
    │   ├── routes/
    │   ├── middleware/
    │   ├── utils/
    │   └── ...
    └── ...

Frontend взаимодействует с backend через REST API.

┌─────────────────┐
│      React      │
│   TypeScript    │
└────────┬────────┘
         │
         │ REST API
         ▼
┌─────────────────┐
│     Express     │
│       API       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│      SQLite     │
└─────────────────┘
🔐 Авторизация

Для авторизации используется JWT.

После успешного входа сервер создаёт HTTP cookie с токеном авторизации. 
Защищённые API-маршруты проверяют наличие и валидность токена перед выполнением запроса.

Для взаимодействия frontend и backend используется CORS с поддержкой credentials.

🔌 API

Основные группы API:

/api/health
/api/auth
/api/medications
/api/intakes

Авторизация
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

Лекарства
GET    /api/medications
POST   /api/medications
PUT    /api/medications/:id
DELETE /api/medications/:id

Приём лекарств
GET    /api/intakes
POST   /api/intakes

Набор endpoint'ов может изменяться по мере развития проекта.

⚙️ Переменные окружения
Frontend
VITE_API_URL=/api
Backend
PORT=3000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_secret

Для production в CLIENT_URL должен быть указан адрес развернутого frontend-приложения.

🚀 Запуск проекта
1. Клонирование
git clone <repository-url>
cd apptechka
2. Установка зависимостей

Frontend:
cd client
npm install

Backend:
cd ../server
npm install

3. Настройка переменных окружения
Создайте .env файлы для frontend и backend и укажите необходимые переменные.

4. Запуск backend
npm run dev
5. Запуск frontend
npm run dev

После запуска frontend будет доступен по адресу:

http://localhost:5173
https://frabjous-cactus-c648de.netlify.app/ - демо

🗄️ База данных

Для хранения данных используется SQLite.
В базе хранятся:
пользователи;
лекарства;
записи о приёме лекарств.

SQLite выбран как лёгкое реляционное хранилище, не требующее отдельного сервера базы данных.

🔒 Безопасность

В проекте реализованы базовые механизмы защиты:
пароли не хранятся в открытом виде;
для авторизации используются JWT;
токен авторизации хранится в HTTP cookie;
защищённые маршруты проверяют авторизацию;
CORS ограничен разрешённым frontend origin;
секретные параметры вынесены в переменные окружения.

📦 Основные команды
Frontend

npm run dev
npm run build
npm run lint
Backend
npm run dev
npm run build
npm start

🎯 Цели проекта

Проект создавался как полноценное full-stack приложение, а не только как frontend-интерфейс.

В процессе разработки были реализованы и отработаны:

разработка интерфейсов на React + TypeScript;
построение REST API;
JWT-аутентификация;
работа с HTTP cookies;
взаимодействие frontend и backend;
работа с SQLite;
обработка API-запросов и ошибок;
настройка CORS;
работа с environment variables;
разделение frontend и backend;
деплой приложения.

🌐 Деплой

Frontend и backend развёрнуты независимо друг от друга:

                 Пользователь
                      │
             ┌────────┴────────┐
             ▼                 ▼
         Netlify             Render
        Frontend             Backend
          React              Express
                                │
                                ▼
                              SQLite

Такое разделение позволяет независимо разрабатывать и развёртывать клиентскую и серверную части приложения.

📌 Статус

🚧 Проект находится в разработке.

Функциональность и интерфейс продолжают развиваться.

📄 Лицензия

Проект создан в учебных и портфолио-целях.
