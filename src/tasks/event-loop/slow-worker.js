const { parentPort, workerData } = require("worker_threads");

const limit = workerData.limit;

let sum = 0;

for (let i = 0; i < limit; i++) {
  sum += i;
}

parentPort.postMessage(sum);