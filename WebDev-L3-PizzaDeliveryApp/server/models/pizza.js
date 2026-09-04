const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    category: { type: String, default: "veg" },
    image: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "pizzas" }
);

module.exports = mongoose.model("Pizza", pizzaSchema);