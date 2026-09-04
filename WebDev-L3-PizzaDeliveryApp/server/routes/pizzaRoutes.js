const express = require("express");
const router = express.Router();
const {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
} = require("../controllers/pizzaController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", getAllPizzas);
router.get("/:id", getPizzaById);
router.post("/", authMiddleware, adminMiddleware, createPizza);
router.put("/:id", authMiddleware, adminMiddleware, updatePizza);
router.delete("/:id", authMiddleware, adminMiddleware, deletePizza);

module.exports = router;