const Pizza = require("../models/pizza");

const getAllPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find().sort({ createdAt: -1 });
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pizzas" });
  }
};

const getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }
    res.json(pizza);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pizza" });
  }
};

const createPizza = async (req, res) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;
    const pizza = await Pizza.create({
      name,
      description,
      price,
      category,
      image,
      isAvailable,
    });
    res.status(201).json(pizza);
  } catch (error) {
    res.status(500).json({ message: "Failed to create pizza", error: error.message });
  }
};

const updatePizza = async (req, res) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, {
      name,
      description,
      price,
      category,
      image,
      isAvailable,
    }, {
      new: true,
      runValidators: true,
    });

    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }

    res.json(pizza);
  } catch (error) {
    res.status(500).json({ message: "Failed to update pizza" });
  }
};

const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);

    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }

    res.json({ message: "Pizza deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete pizza" });
  }
};

module.exports = {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
};