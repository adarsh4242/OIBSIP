const express = require("express");
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/userController");
const router = express.Router();
router.use(auth); router.get("/addresses", controller.addresses); router.post("/addresses", controller.addAddress); router.put("/addresses/:addressId", controller.updateAddress); router.delete("/addresses/:addressId", controller.deleteAddress);
module.exports = router;
