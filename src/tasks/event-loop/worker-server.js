const path = require("path");

const Fastify = require("fastify");

const { Worker } = require("worker_threads");

const fastify = Fastify({
  logger: true,
});

fastify.get("/fast", async () => {
  return {
    message: "I am fast",
  };
});

fastify.get("/slow", async () => {
  const result = await new Promise((resolve, reject) => {
    const worker = new Worker(
      path.join(__dirname, "slow-worker.js"),
      {
        workerData: {
          limit: 5_000_000_000,
        },
      }
    );

    worker.on("message", resolve);

    worker.on("error", reject);
  });

  return {
    result,
  };
});

const start = async () => {
  try {
    await fastify.listen({
      port: 3000,
    });

    console.log("Worker server started on port 3000");
  } catch (error) {
    fastify.log.error(error);

    process.exit(1);
  }
};

start();