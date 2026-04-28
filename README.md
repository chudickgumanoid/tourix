# Tourix Onboarding Chrome Extension

Интерактивный онбординг для любых сайтов.

## Стек
- **Vue 3** (Composition API)
- **TypeScript**
- **Vite**
- **CRXJS Vite Plugin** (Manifest V3)
- **Shadow DOM** (для изоляции стилей)

## Возможности
- Детекция Vue на страницах.
- Пошаговые инструкции (гайды) с привязкой к CSS селекторам.
- Затемнение экрана с "прожектором" (spotlight) на активный элемент.
- Сохранение прогресса в `chrome.storage`.
- Изоляция стилей через Shadow DOM (не ломает верстку сайта).
- Обработка ситуаций, когда элемент не найден на странице.

## Архитектура
1. `GuideRegistry` - Хранилище доступных гайдов.
2. `GuideRunner` - Управление состоянием активного гайда.
3. `OverlayRenderer` - Отрисовка UI в Shadow DOM.
4. `ElementResolver` - Поиск элементов по селекторам.
5. `StorageService` - Работа с хранилищем Chrome.
6. `MessageBridge` - Связь между Popup и Content Script.

## Установка и запуск

1. Установите зависимости:
   ```bash
   pnpm install
   ```

2. Соберите проект:
   ```bash
   pnpm run build
   ```

3. Загрузите расширение в Chrome:
   - Перейдите в `chrome://extensions/`
   - Включите **Developer mode** (режим разработчика).
   - Нажмите **Load unpacked** (загрузить распакованное расширение).
   - Выберите папку `dist` в корне проекта.

## Разработка
Для запуска в режиме разработки с hot-reload:
```bash
pnpm run dev
```

## Добавление гайдов
Гайды описываются в `src/core/GuideRegistry.ts`. Каждый гайд содержит массив `matches` (URL или часть URL сайта) и массив `steps` с селекторами.
