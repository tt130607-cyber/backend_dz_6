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

const productSchema = {
  body: {
    type: "object",
    required: ["name", "price", "categoryId"],
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 200,
      },
      price: {
        type: "number",
        minimum: 0.01,
      },
      categoryId: {
        type: "integer",
        minimum: 1,
      },
      inStock: {
        type: "boolean",
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

fastify.get("/api/products", async (request) => {
  let result = [...products];

  const { categoryId, inStock } = request.query;

  if (categoryId) {
    result = result.filter(
      (product) => product.categoryId === Number(categoryId)
    );
  }

  if (inStock !== undefined) {
    result = result.filter(
      (product) => product.inStock === (inStock === "true")
    );
  }

  return result;
});

fastify.get("/api/products/:id", async (request, reply) => {
  const id = Number(request.params.id);

  const product = products.find((item) => item.id === id);

  if (!product) {
    return reply.status(404).send({
      error: "Product not found",
    });
  }

  return product;
});

fastify.post(
  "/api/products",
  {
    schema: productSchema,
  },
  async (request, reply) => {
    const category = categories.find(
      (item) => item.id === request.body.categoryId
    );

    if (!category) {
      return reply.status(400).send({
        error: "Category not found",
      });
    }

    const newProduct = {
      id: productId++,
      name: request.body.name,
      price: request.body.price,
      categoryId: request.body.categoryId,
      inStock: request.body.inStock ?? true,
      createdAt: new Date().toISOString(),
    };

    products.push(newProduct);

    reply.status(201);

    return newProduct;
  }
);

fastify.put(
  "/api/products/:id",
  {
    schema: productSchema,
  },
  async (request, reply) => {
    const id = Number(request.params.id);

    const product = products.find((item) => item.id === id);

    if (!product) {
      return reply.status(404).send({
        error: "Product not found",
      });
    }

    const category = categories.find(
      (item) => item.id === request.body.categoryId
    );

    if (!category) {
      return reply.status(400).send({
        error: "Category not found",
      });
    }

    product.name = request.body.name;
    product.price = request.body.price;
    product.categoryId = request.body.categoryId;
    product.inStock = request.body.inStock ?? true;

    return product;
  }
);

fastify.delete("/api/products/:id", async (request, reply) => {
  const id = Number(request.params.id);

  const productIndex = products.findIndex(
    (item) => item.id === id
  );

  if (productIndex === -1) {
    return reply.status(404).send({
      error: "Product not found",
    });
  }

  products.splice(productIndex, 1);

  return {
    message: "Product deleted",
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