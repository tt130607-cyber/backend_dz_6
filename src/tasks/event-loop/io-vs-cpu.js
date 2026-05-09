const fs = require("fs").promises;
const path = require("path");

async function runTasks() {
  console.log("START");

  // Проверка блокировки Event Loop
  setTimeout(() => {
    console.log("I should fire in 100ms");
  }, 100);

  // CPU-bound задача
  console.time("CPU task");

  let sum = 0;

  for (let i = 1; i <= 1_000_000_000; i++) {
    sum += i;
  }

  console.timeEnd("CPU task");

  console.log("CPU sum:", sum);

  // I/O-bound задача
  console.time("I/O task");

  const files = [];

  for (let i = 1; i <= 10; i++) {
    const filePath = path.join(
      __dirname,
      "test-files",
      `file${i}.txt`
    );

    files.push(fs.readFile(filePath, "utf-8"));
  }

  await Promise.all(files);

  console.timeEnd("I/O task");

  console.log("I/O completed");
}

runTasks();