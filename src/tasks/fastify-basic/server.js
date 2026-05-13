const Fastify = require("fastify");

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async () => {
  return {
    message: "Server is running",
  };
});

fastify.get("/health", async () => {
  return {
    status: "ok",
    uptime: process.uptime(),
  };
});

fastify.get("/time", async () => {
  return {
    iso: new Date().toISOString(),
    unix: Date.now(),
  };
});

const start = async () => {
  try {
    await fastify.listen({
      port: 3000,
    });

    console.log("Fastify server started on port 3000");
  } catch (error) {
    fastify.log.error(error);

    process.exit(1);
  }
};

start();

const gracefulShutdown = async () => {
  console.log("Shutting down server...");

  await fastify.close();

  console.log("Server closed");

  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);

process.on("SIGTERM", gracefulShutdown);