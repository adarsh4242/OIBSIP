const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const stats = async (req, res) => { const [users, products, orders, revenue, lowStock, recentOrders] = await Promise.all([User.countDocuments(), Product.countDocuments(), Order.countDocuments(), Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }]), Product.find({ stock: { $lte: 5 } }).limit(10), Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email")]); res.json({ users, products, orders, revenue: revenue[0]?.total || 0, lowStock, recentOrders }); };
const users = async (req, res) => res.json(await User.find().select("-password -refreshTokens").sort({ createdAt: -1 }));
const changeRole = async (req, res) => { const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true, runValidators: true }).select("-password -refreshTokens"); if (!user) return res.status(404).json({ message: "User not found" }); res.json(user); };
module.exports = { stats, users, changeRole };
