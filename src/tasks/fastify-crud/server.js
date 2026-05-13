const Fastify = require("fastify");

const fastify = Fastify({
  logger: true,
});

let categories = [];

let products = [];

let users = [];

let categoryId = 1;
let productId = 1;
let userId = 1;

const categorySchema = {
  body: {
    type: "object",
    required: ["name"],
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 50,
      },
      description: {
        type: "string",
        maxLength: 300,
      },
    },
  },
};

fastify.get("/api/categories", async () => {
  return categories;
});

fastify.get("/api/categories/:id", async (request, reply) => {
  const id = Number(request.params.id);

  const category = categories.find((item) => item.id === id);

  if (!category) {
    return reply.status(404).send({
      error: "Category not found",
    });
  }

  return category;
});

fastify.post(
  "/api/categories",
  {
    schema: categorySchema,
  },
  async (request, reply) => {
    const newCategory = {
      id: categoryId++,
      name: request.body.name,
      description: request.body.description || "",
    };

    categories.push(newCategory);

    reply.status(201);

    return newCategory;
  }
);

fastify.put(
  "/api/categories/:id",
  {
    schema: categorySchema,
  },
  async (request, reply) => {
    const id = Number(request.params.id);

    const category = categories.find((item) => item.id === id);

    if (!category) {
      return reply.status(404).send({
        error: "Category not found",
      });
    }

    category.name = request.body.name;
    category.description = request.body.description || "";

    return category;
  }
);

fastify.delete("/api/categories/:id", async (request, reply) => {
  const id = Number(request.params.id);

  const categoryProducts = products.find(
    (product) => product.categoryId === id
  );

  if (categoryProducts) {
    return reply.status(400).send({
      error: "Category has products",
    });
  }

  const categoryIndex = categories.findIndex(
    (item) => item.id === id
  );

  if (categoryIndex === -1) {
    return reply.status(404).send({
      error: "Category not found",
    });
  }

  categories.splice(categoryIndex, 1);

  return {
    message: "Category deleted",
  };
});

const start = async () => {
  try {
    await fastify.listen({
      port: 3000,
    });

    console.log("CRUD server started on port 3000");
  } catch (error) {
    fastify.log.error(error);

    process.exit(1);
  }
};

start();