const Product = require("../models/Product");

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const buildUniqueSlug = async (name, id) => {
  const base = slugify(name);
  let slug = base;
  let suffix = 1;
  while (await Product.exists({ slug, ...(id ? { _id: { $ne: id } } : {}) })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
};

const pagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 50);
  return { page, limit, skip: (page - 1) * limit };
};

const sortBy = (value) => ({
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating_desc: { rating: -1 },
}[value] || { createdAt: -1 });

const buildFilter = (query, includeInactive = false) => {
  const filter = includeInactive ? {} : {
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  };
  if (query.keyword) {
    const keyword = new RegExp(query.keyword.trim(), "i");
    filter.$or = [{ name: keyword }, { description: keyword }];
  }
  if (query.category) filter.category = query.category;
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.stock === "in") filter.stock = { $gt: 0 };
  if (query.stock === "out") filter.stock = 0;
  return filter;
};

const listProducts = async (req, res) => {
  try {
    const { page, limit, skip } = pagination(req.query);
    const filter = buildFilter(req.query);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortBy(req.query.sort)).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);
    res.json({ products, page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

const listAdminProducts = async (req, res) => {
  try {
    const filter = buildFilter(req.query, true);
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ products, total: products.length });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin products", error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Invalid product id" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, stock, images, isFeatured, isActive } = req.body;
    if (!name || !description || price === undefined || !category) return res.status(400).json({ message: "Name, description, price, and category are required" });
    const product = await Product.create({ name, slug: await buildUniqueSlug(name), description, price, discountPrice: discountPrice === "" ? undefined : discountPrice, category, stock, images: Array.isArray(images) ? images : [], isFeatured: Boolean(isFeatured), isActive: isActive === undefined ? true : Boolean(isActive) });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Failed to create product", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    ["name", "description", "price", "discountPrice", "category", "stock", "images", "isFeatured", "isActive"].forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });
    if (req.body.name) product.slug = await buildUniqueSlug(req.body.name, product._id);
    if (product.discountPrice === "") product.discountPrice = undefined;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Failed to update product", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully", productId: product._id });
  } catch (error) {
    res.status(400).json({ message: "Invalid product id" });
  }
};

const addReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.reviews.push({ user: req.user.id, rating: req.body.rating, comment: req.body.comment });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.numReviews;
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Failed to add review", error: error.message });
  }
};

module.exports = { listProducts, listAdminProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview };
