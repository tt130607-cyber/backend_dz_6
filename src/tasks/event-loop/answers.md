# Event Loop Order Prediction

Предполагаемый порядок:

1
12
6
4
5
2
3
7
11
10
9
8

# Почему такой порядок

1. Сначала выполняется синхронный код.
2. process.nextTick выполняется раньше Promise.then.
3. Promise.then относится к microtasks.
4. setTimeout выполняется в timers phase.
5. setImmediate выполняется в check phase.
6. fs.readFile callback выполняется в poll phase.
7. После I/O callback снова выполняются microtasks.

# Microtasks

- process.nextTick
- Promise.then

# Macrotasks

- setTimeout
- setImmediate
- fs.readFile callback