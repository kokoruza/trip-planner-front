# 🏖️ Trip Planner - Frontend

Современное веб-приложение для планирования отпусков с красивым сине-белым интерфейсом. 

**Статус:** ✅ Функциональный прототип с полной UI/UX системой

---

## 🎨 Особенности

✨ **Красивый дизайн** - Сине-белая цветовая гамма с плавными анимациями
📱 **Адаптивный** - Работает на всех устройствах (desktop, tablet, mobile)
🔐 **Безопасный** - JWT аутентификация с refresh токенами
📊 **Полнофункциональный** - Управление отпусками, досками и проектами
🎯 **Интуитивный** - Удобная навигация и логичная структура

---

## 📋 Требования

- Node.js 14+
- npm или yarn
- Бэкенд API на адресе `https://localhost:7085`

---

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Запуск dev сервера
```bash
npm run dev
```

### 3. Откройте в браузере
```
http://localhost:5173
```

---

## 📁 Структура проекта

```
src/
├── api/                    # API операции
│   ├── axios.js           # Конфигурация HTTP клиента
│   ├── authApi.js         # Аутентификация
│   ├── tripApi.js         # Работа с отпусками
│   ├── boardApi.js        # Работа с досками
│   └── accountsApi.js     # Управление аккаунтом
│
├── auth/
│   └── AuthContext.jsx    # Глобальный контекст аутентификации
│
├── pages/
│   ├── LoginPage.jsx      # Страница входа
│   ├── RegisterPage.jsx   # Страница регистрации
│   ├── TripsPage.jsx      # Список отпусков
│   ├── TripDetailsPage.jsx # Детали отпуска
│   ├── BoardDetailPage.jsx # Детали доски
│   └── BoardPage.jsx      # Старая страница (можно удалить)
│
├── components/            # Переиспользуемые компоненты
│   ├── Board.jsx          # Компонент доски
│   ├── Sticker.jsx        # Компонент стикера
│   ├── TripList.jsx       # Список отпусков
│   └── AddTrip.jsx        # Форма добавления отпуска
│
├── router/
│   └── router.jsx         # Конфигурация маршрутов
│
├── styles/
│   └── main.scss          # Глобальные стили
│
├── App.jsx                # Главный компонент
├── main.jsx               # Точка входа
└── index.css              # CSS точки входа
```

---

## 🗺️ Маршруты приложения

| Путь | Страница | Описание |
|------|----------|----------|
| `/` | Login | Вход в приложение |
| `/register` | Register | Регистрация нового пользователя |
| `/trips` | Trips | Список всех отпусков пользователя |
| `/trips/:tripId` | TripDetails | Детали конкретного отпуска |
| `/boards/:boardId` | BoardDetail | Детали доски (в разработке) |

---

## 🎯 Функционал

### ✅ Реализовано
- [x] Аутентификация (вход, регистрация)
- [x] Просмотр списка отпусков
- [x] Создание нового отпуска
- [x] Просмотр деталей отпуска
- [x] Просмотр участников отпуска
- [x] Просмотр списка досок отпуска
- [x] Создание новой доски
- [x] Навигация между страницами
- [x] Красивый UI с анимациями
- [x] Обработка ошибок

### 🔄 В разработке
- [ ] Полная функциональность досок (стикеры, карточки)
- [ ] Редактирование отпусков
- [ ] Удаление отпусков
- [ ] Добавление участников
- [ ] Удаление участников
- [ ] Экспорт/импорт данных

---

## 🎨 Цветовая палитра

```
Основной синий:    #2563eb
Тёмный синий:      #1e40af
Светлый синий:     #3b82f6
Очень светлый:     #dbeafe
Фон страницы:      #f0f7ff
Белый:             #ffffff
Текст:             #1e293b
Текст второй:      #64748b
Опасный цвет:      #ef4444
```

---

## 🔧 Команды

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 📚 Используемые технологии

- **React 18** - UI библиотека
- **React Router 6** - Маршрутизация
- **Axios** - HTTP клиент
- **SCSS** - Препроцессор стилей
- **Vite** - Сборщик проекта
- **ES6+** - Современный JavaScript

---

## 📖 Документация

Детальное описание смотрите в:
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Полная архитектура приложения
- **[UI_GUIDE.md](./UI_GUIDE.md)** - Гайд по UI компонентам и цветовой гамме

---

## 🔗 Бэкенд интеграция

Приложение интегрируется с бэкенд API на адресе:
```
https://localhost:7085/api
```

Бэкенд находится в папке `TripPlannerVibeCode/`

---

## ✨ Приложение готово к использованию! 🎉

- From the workspace root open a terminal and run:

```bash
cd TripPlannerVibeCode/TripPlanner
dotnet run
```

By default the API listens on `https://localhost:7085` (see `Properties/launchSettings.json`).

Frontend (React + Vite):

```bash
cd trip-planner-front
npm install
npm run dev
```

The front-end will proxy requests (directly) to the API at `https://localhost:7085/api` via the configured axios base URL.

SCSS: a global SCSS file was added at `src/styles/main.scss`. Make sure `sass` is installed if you encounter build errors:

```bash
npm install -D sass
```
