class APIFeatures {
  constructor(query, queryString) { this.query = query; this.queryString = queryString; }
  search() { if (this.queryString.keyword) { const regex = { $regex: this.queryString.keyword, $options: "i" }; this.query = this.query.find({ $or: [{ name: regex }, { description: regex }, { category: regex }] }); } return this; }
  filter() { const excluded = ["keyword", "sort", "page", "limit"]; const filters = { ...this.queryString }; excluded.forEach((key) => delete filters[key]); if (filters.minPrice || filters.maxPrice) { filters.price = {}; if (filters.minPrice) filters.price.$gte = Number(filters.minPrice); if (filters.maxPrice) filters.price.$lte = Number(filters.maxPrice); delete filters.minPrice; delete filters.maxPrice; } if (filters.stock === "in") filters.stock = { $gt: 0 }; if (filters.stock === "out") filters.stock = 0; this.query = this.query.find(filters); return this; }
  sort() { const map = { newest: "-createdAt", price_asc: "price", price_desc: "-price", rating_desc: "-ratingsAverage" }; this.query = this.query.sort(map[this.queryString.sort] || "-createdAt"); return this; }
  paginate() { const page = Math.max(Number(this.queryString.page) || 1, 1); const limit = Math.min(Math.max(Number(this.queryString.limit) || 12, 1), 50); this.page = page; this.limit = limit; this.query = this.query.skip((page - 1) * limit).limit(limit); return this; }
}
module.exports = APIFeatures;
