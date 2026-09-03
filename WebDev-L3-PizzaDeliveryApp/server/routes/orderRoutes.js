const express = require("express");
const router = express.Router();

router.post("/place", (req, res) => {
  const { name, phone, address, cart, totalPrice } = req.body;

  if (!name || !phone || !address || !cart || cart.length === 0) {
    return res.status(400).json({ message: "Please fill all fields and add items to cart" });
  }

  res.status(201).json({
    message: "Order placed successfully",
    order: {
      name,
      phone,
      address,
      cart,
      totalPrice
    }
  });
});

module.exports = router;