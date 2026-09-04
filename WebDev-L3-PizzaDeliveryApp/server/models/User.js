const mongoose = require("mongoose");
const refreshTokenSchema = new mongoose.Schema({ tokenHash: { type: String, required: true }, createdAt: { type: Date, default: Date.now, expires: 7 * 24 * 60 * 60 } }, { _id: false });
const addressSchema = new mongoose.Schema({ label: String, fullName: String, phone: String, addressLine1: String, addressLine2: String, city: String, state: String, postalCode: String, country: { type: String, default: "India" } });
const userSchema = new mongoose.Schema({ name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, trim: true }, password: { type: String, required: true, select: false }, role: { type: String, enum: ["user", "admin"], default: "user" }, avatar: { type: String, default: "" }, isActive: { type: Boolean, default: true }, refreshTokens: [refreshTokenSchema], savedAddresses: [addressSchema] }, { timestamps: true });
module.exports = mongoose.model("User", userSchema);
