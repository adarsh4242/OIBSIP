const express = require("express");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const products = require("../controllers/productController");
const orders = require("../controllers/orderController");
const users = require("../controllers/adminController");

const router = express.Router();
router.use(auth, admin);
router.get("/stats", users.stats);
router.get("/users", users.users);
router.put("/users/:id/role", users.changeRole);
router.get("/products", products.listAdminProducts);
router.post("/products", products.createProduct);
router.put("/products/:id", products.updateProduct);
router.delete("/products/:id", products.deleteProduct);
router.get("/orders", orders.all);
router.put("/orders/:id/status", orders.updateStatus);

module.exports = router;
