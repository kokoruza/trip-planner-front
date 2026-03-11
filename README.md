# 🏖️ Trip Planner - Frontend

Современное веб-приложение для планирования отпусков и совместного управления проектами. Красивый сине-белый интерфейс с полной функциональностью для групповой работы.

**Статус:** ✅ Функциональный MVP с адаптивным дизайном

---

## ✨ Основные возможности

### 🎯 Управление отпусками
- ✅ Создание и редактирование отпусков/путешествий
- ✅ Приглашение и управление участниками
- ✅ Просмотр участников и их профилей

### 📅 Календарь событий
- ✅ Месячный календарь с сеткой дат
- ✅ Создание событий с датой, описанием и фотографией
- ✅ Планирование отпусков (vacation schedules)
- ✅ Просмотр событий на конкретный день
- ✅ Наведение мышью показывает аватары участников
- ✅ Адаптивный дизайн (на мобилке header зафиксирован)

### 📸 Галерея фотографий
- ✅ Загрузка фото с названием и описанием
- ✅ Лайки на фотографии
- ✅ Комментарии к фото с поддержкой удаления
- ✅ Модальное окно с полной информацией о фото
- ✅ На мобилке: прокрутка модала вместе с фото (не прокручивает страницу)

### 📝 Доски и карточки
- ✅ Создание досок для группировки задач
- ✅ Карточки (песочные часы, идеи, задачи)
- ✅ Стикеры с текстом для быстрых заметок

### 🗳️ Опросы
- ✅ Создание опросов с вариантами ответов
- ✅ Голосование участников
- ✅ Просмотр результатов

### 👤 Профили пользователей
- ✅ Просмотр профиля пользователя
- ✅ Информация об участнике (аватар, имя)
- ✅ Удобные ссылки на профиль из событий и галереи

### 🔐 Аутентификация и безопасность
- ✅ Регистрация новых пользователей
- ✅ JWT токены с refresh механизмом
- ✅ Защищенные маршруты и API

### 🌓 Дизайн и UI
- ✅ Светлая и тёмная темы
- ✅ Адаптивный дизайн для всех размеров экранов
- ✅ Плавные анимации и переходы
- ✅ Интуитивная навигация

---

## 📋 Требования

- **Node.js** 14+ (рекомендуется 18+)
- **npm** или **yarn**
- **Бэкенд API** на адресе `https://localhost:7085` (по умолчанию)

---

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
cd trip-planner-front
npm install
```

### 2. Конфигурация (опционально)
Отредактируйте API URL в [src/api/axios.js](src/api/axios.js) если нужно

### 3. Запуск dev сервера
```bash
npm run dev
```

### 4. Откройте в браузере
```
http://localhost:5173
```

### 5. Сборка для production
```bash
npm run build
npm run preview  # Проверить production сборку локально
```

---

## 📁 Структура проекта

```
src/
├── api/                     # API слой
│   ├── axios.js            # Конфигурация HTTP клиента с JWT
│   ├── authApi.js          # Аутентификация (login, register)
│   ├── tripApi.js          # Управление отпусками
│   ├── boardApi.js         # Управление досками
│   ├── calendarApi.js      # События и расписание отпусков
│   ├── galleryApi.js       # Фотографии, комментарии, лайки
│   ├── pollApi.js          # Опросы и голосование
│   └── accountsApi.js      # Профили пользователей
│
├── auth/
│   └── AuthContext.jsx     # Глобальный контекст аутентификации
│
├── pages/                   # Страницы приложения
│   ├── LoginPage.jsx       # Вход (public)
│   ├── RegisterPage.jsx    # Регистрация (public)
│   ├── TripsPage.jsx       # Список отпусков
│   ├── TripDetailsPage.jsx # Детали отпуска (главная)
│   ├── CalendarPage.jsx    # Календарь событий
│   ├── BoardDetailPage.jsx # Детали доски
│   ├── GalleryPage.jsx     # Галерея фотографий
│   ├── PollsPage.jsx       # Опросы
│   ├── ProfilePage.jsx     # Профиль пользователя
│   ├── JoinTripPage.jsx    # Присоединение к отпуску
│   └── BoardPage.jsx       # Старая версия доски
│
├── components/              # Переиспользуемые компоненты
│   ├── Calendar.jsx        # Месячный календарь
│   ├── EventModal.jsx      # Форма создания события
│   ├── EventDetailsModal.jsx # Просмотр события с картинкой
│   ├── DayDetailsModal.jsx # Модал дня с событиями
│   ├── VacationScheduleModal.jsx # Форма отпуска
│   ├── GalleryPhotoCard.jsx # Карточка фото в галерее
│   ├── GalleryPhotoModal.jsx # Модал фото с комментариями
│   ├── UploadPhotoModal.jsx # Загрузка фото
│   ├── CreatePollModal.jsx # Создание опроса
│   ├── PollCard.jsx        # Карточка опроса
│   ├── Board.jsx           # Доска с карточками
│   ├── Sticker.jsx         # Стикер для доски
│   ├── TripList.jsx        # Список отпусков
│   ├── TripMembersManager.jsx # Управление участниками
│   ├── UserLink.jsx        # Компонент ссылки на профиль
│   ├── UserMenu.jsx        # Меню пользователя
│   └── ThemeToggle.jsx     # Переключатель темы
│
├── router/
│   └── router.jsx          # Конфигурация маршрутов
│
├── App.jsx                 # Главный компонент
├── App.css                 # Стили
├── main.jsx                # Точка входа
└── index.css               # Глобальные CSS переменные
```

---

## 🗺️ Маршруты приложения

| Путь | Компонент | Доступ | Описание |
|------|-----------|--------|----------|
| `/` | LoginPage | Public | Вход в приложение |
| `/register` | RegisterPage | Public | Регистрация нового пользователя |
| `/trips` | TripsPage | Private | Список всех отпусков |
| `/trips/:tripId` | TripDetailsPage | Private | Главная страница отпуска |
| `/trips/:tripId/calendar` | CalendarPage | Private | Календарь событий |
| `/trips/:tripId/gallery` | GalleryPage | Private | Галерея фотографий |
| `/trips/:tripId/polls` | PollsPage | Private | Опросы |
| `/trips/:tripId/boards/:boardId` | BoardDetailPage | Private | Доска с карточками |
| `/profile/:userId` | ProfilePage | Private | Профиль пользователя |
| `/join/:tripId` | JoinTripPage | Private | Присоединение к отпуску |

---

## 🔌 API взаимодействие

### Аутентификация
```javascript
// POST /auth/login
{ email, password }
→ { token, refreshToken, user }

// POST /auth/register
{ email, password, name }
→ { token, refreshToken, user }

// POST /auth/refresh
{ refreshToken }
→ { token, refreshToken }
```

### Календарь (events)
```javascript
// POST /trips/:tripId/events
FormData: { title, description, date, file }
→ { id, title, description, date, imageUrl, createdBy... }

// GET /trips/:tripId/events
→ [{ id, title, imageUrl, ... }]

// DELETE /events/:eventId
→ 204 NoContent
```

### Календарь (vacation schedules)
```javascript
// POST /trips/:tripId/vacation-schedules
{ startDate, endDate }
→ { id, startDate, endDate, createdBy... }

// GET /trips/:tripId/vacation-schedules
→ [{ id, startDate, endDate, ... }]

// DELETE /vacation-schedules/:scheduleId
→ 204 NoContent
```

### Галерея
```javascript
// POST /gallery/:tripId
FormData: { file, title, description }
→ { id, title, imagePath, likeCount, comments: [] }

// GET /gallery/trip/:tripId
→ [{ id, title, imagePath, ... }]

// POST /gallery/:photoId/comments
{ text }
→ { id, text, commentedBy... }

// POST /gallery/:photoId/like
→ { likeCount }

// DELETE /gallery/:photoId/like
→ { likeCount }
```

---

## 🎨 Темизация

Приложение поддерживает светлую и тёмную темы через CSS переменные.

**Переменные темы** в [src/index.css](src/index.css):
```css
--primary: #2563eb         /* Синий основной */
--primary-dark: #1d4ed8
--primary-light: #dbeafe
--white: #ffffff
--text: #1f2937          /* Тёмный текст */
--text-secondary: #6b7280
--bg: #f9fafb            /* Светлый фон */
--bg-secondary: #f3f4f6
--border: #e5e7eb
--shadow: 0 1px 3px rgba(0,0,0,0.12)
```

---

## 🔍 Улучшения и исправления (последняя версия)

### Календарь
- ✅ Header (месяц + стрелки) зафиксирован вверху на мобилке
- ✅ Только сетка дат прокручивается горизонтально
- ✅ Исправлена ошибка -1 день при создании события (дата теперь создается в полдень)

### События
- ✅ Картинки события теперь выводятся (поддержка `imageUrl` с `/gallery/...`)
- ✅ Переход в профиль из события работает через `UserLink`
- ✅ Fallback на email если имя пользователя отсутствует

### Галерея
- ✅ На мобилке модал полностью занимает экран в одной колонке
- ✅ Фото и комментарии прокручиваются вместе (не прокручивается основная страница)
- ✅ Добавлено `document.body.overflow = hidden` при открытии

---

## 🛠️ Разработка

### Структура скриптов
- `npm run dev` - Запуск dev сервера Vite
- `npm run build` - Production сборка (в папку `dist/`)
- `npm run preview` - Просмотр production сборки локально
- `npm run lint` - Проверка ESLint

### Зависимости
- **react** 19.2 - UI фреймворк
- **react-router-dom** 7.13 - Маршрутизация
- **axios** 1.13 - HTTP клиент
- **sass** 1.97 - Препроцессор CSS

### Переменные окружения
```env
# По умолчанию в axios.js:
VITE_API_URL=https://localhost:7085
```

---

## 📚 Дополнительно

- [ARCHITECTURE.md](ARCHITECTURE.md) - Архитектура фронтенда
- [BOARD_FEATURES.md](BOARD_FEATURES.md) - Особенности досок
- [CALENDAR_IMPLEMENTATION.md](CALENDAR_IMPLEMENTATION.md) - Детали календаря
- [UI_GUIDE.md](UI_GUIDE.md) - Гайд по компонентам

---

## 📞 Контакты и поддержка

При возникновении проблем с API:
1. Убедитесь, что бэкенд запущен на `https://localhost:7085`
2. Проверьте консоль браузера на ошибки
3. Убедитесь, что token не истек (refresh token должен обновить его автоматически)

**Автор:** Trip Planner Team  
**Последнее обновление:** March 2026

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
