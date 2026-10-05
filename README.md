# GREEN-API Chat (MAX / WhatsApp)

Тестовое задание «Frontend Developer React»: интерфейс отправки и получения
https://drive.google.com/file/d/1Ut39kkIs0QK-swnCsIPJc6pNqVIVGOD2/view?pli=1
текстовых сообщений через [GREEN-API](https://green-api.com/max).
Прототип интерфейса — [web.max.ru](https://web.max.ru/).

## Функциональность

- Вход по данным инстанса GREEN-API (`idInstance`, `apiTokenInstance`)
- Выбор мессенджера (MAX или WhatsApp)
- Создание чата по номеру телефона
- Отправка текстовых сообщений — метод `sendMessage`
- Получение входящих сообщений — HTTP API (`receiveNotification` → `deleteNotification`, polling каждые 3 секунды)
- История сообщений сохраняется в localStorage
- Обработка ошибок API с отображением в интерфейсе

## Запуск

```bash
npm install
cp .env.example .env
npm run dev
```

## или

```bash
yarn
cp .env.example .env
yarn dev
```
