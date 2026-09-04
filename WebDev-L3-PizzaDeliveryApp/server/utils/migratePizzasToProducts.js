require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const slugify = (value) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const createUniqueSlug = async (name, sourceId) => {
  const baseSlug = slugify(name) || `pizza-${sourceId}`;
  let slug = baseSlug;
  let suffix = 1;

  while (await Product.exists({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

const migrate = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const legacyPizzas = await mongoose.connection.db.collection("pizzas").find({}).toArray();
  let migrated = 0;

  for (const pizza of legacyPizzas) {
    const alreadyMigrated = await Product.exists({
      $or: [
        { legacyPizzaId: pizza._id },
        { name: pizza.name, price: pizza.price },
      ],
    });

    if (alreadyMigrated) continue;

    await Product.create({
      name: pizza.name,
      slug: await createUniqueSlug(pizza.name, pizza._id.toString()),
      description: pizza.description || `${pizza.name} pizza`,
      price: pizza.price,
      category: ["veg", "non-veg", "sides", "drinks"].includes(pizza.category)
        ? pizza.category
        : "veg",
      stock: pizza.stock ?? 20,
      images: pizza.image ? [pizza.image] : [],
      isFeatured: false,
      isActive: pizza.isAvailable !== false,
      legacyPizzaId: pizza._id,
    });
    migrated += 1;
  }

  console.log(`Migrated ${migrated} pizza record(s) from pizzas to products.`);
  await mongoose.disconnect();
};

migrate().catch(async (error) => {
  console.error("Pizza migration failed:", error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
