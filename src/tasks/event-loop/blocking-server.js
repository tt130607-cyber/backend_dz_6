const Fastify = require("fastify");

const fastify = Fastify({
  logger: true,
});

fastify.get("/fast", async () => {
  return {
    message: "I am fast",
  };
});

fastify.get("/slow", async () => {
  let sum = 0;

  const limit = 5_000_000_000;
  const chunkSize = 100_000_000;

  let current = 0;

  return new Promise((resolve) => {
    function processChunk() {
      const end = Math.min(current + chunkSize, limit);

      for (let i = current; i < end; i++) {
        sum += i;
      }

      current = end;

      if (current < limit) {
        setImmediate(processChunk);
      } else {
        resolve({
          result: sum,
        });
      }
    }

    processChunk();
  });
});

const start = async () => {
  try {
    await fastify.listen({
      port: 3000,
    });

    console.log("Server started on port 3000");
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();