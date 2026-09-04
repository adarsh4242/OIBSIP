const User = require("../models/User");
const addresses = async (req, res) => { const user = await User.findById(req.user.id); res.json(user.savedAddresses); };
const addAddress = async (req, res) => { const user = await User.findById(req.user.id); user.savedAddresses.push(req.body); await user.save(); res.status(201).json(user.savedAddresses); };
const updateAddress = async (req, res) => { const user = await User.findById(req.user.id); const address = user.savedAddresses.id(req.params.addressId); if (!address) return res.status(404).json({ message: "Address not found" }); Object.assign(address, req.body); await user.save(); res.json(user.savedAddresses); };
const deleteAddress = async (req, res) => { const user = await User.findById(req.user.id); user.savedAddresses.pull(req.params.addressId); await user.save(); res.json(user.savedAddresses); };
module.exports = { addresses, addAddress, updateAddress, deleteAddress };
