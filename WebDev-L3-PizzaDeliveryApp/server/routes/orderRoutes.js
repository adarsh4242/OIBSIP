const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, phone, address, cart, totalPrice } = req.body;

    const newOrder = new Order({
      name,
      phone,
      address,
      cart,
      totalPrice
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to place order",
      error: error.message
    });
  }
});

module.exports = router;