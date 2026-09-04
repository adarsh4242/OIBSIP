const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Margherita", price: 199 },
    { id: 2, name: "Farmhouse", price: 249 },
    { id: 3, name: "Peppy Paneer", price: 299 },
    { id: 4, name: "Veg Extravaganza", price: 349 }
  ]);
});

module.exports = router;