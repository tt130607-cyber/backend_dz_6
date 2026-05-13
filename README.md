# DZ 6 — Backend Fastify

## 1. Фазы Event Loop

Фазы Event Loop идут в таком порядке:
1. timers
2. pending callbacks
3. idle, prepare
4. poll
5. check
6. close callbacks

setTimeout выполняется в фазе timers.

setImmediate выполняется в фазе check.

---

## 2. Почему process.nextTick выполняется раньше Promise.then

process.nextTick имеет самый высокий приоритет.
Сначала Node.js выполняет nextTick queue, потом Promise microtasks.
Оба относятся к microtasks, но nextTick обрабатывается раньше.

---

## 3. Что будет при тяжелом синхронном цикле в Fastify

Тяжелый синхронный цикл блокирует Event Loop.

Пока цикл работает:
- сервер не может обрабатывать другие запросы
- зависают остальные роуты
- setTimeout и async операции задерживаются

Из-за этого сервер становится медленным.

---

## 4. Разница между CommonJS и ESM

CommonJS использует require() и module.exports.
ESM использует import/export.
"type": "module" в package.json говорит Node.js использовать ESM по умолчанию для .js файлов.
Без этого:
- .cjs → CommonJS
- .mjs → ESM

---

## 5. Что такое REST

REST — это подход к построению API через HTTP методы.
GET — получение данных.
POST — создание.
PUT — обновление.
DELETE — удаление.
PUT /api/products/5 обновляет товар с id 5.
POST /api/products создает новый товар.

---

## 6. Что такое graceful shutdown

Graceful shutdown — это корректная остановка сервера.
fastify.close() завершает текущие подключения и только потом выключает сервер.
Это безопаснее чем просто завершить процесс, потому что запросы не обрываются.