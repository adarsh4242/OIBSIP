const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => jwt.sign(
  { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
  process.env.JWT_ACCESS_SECRET,
  { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" }
);

const generateRefreshToken = (user) => jwt.sign(
  { id: user._id.toString(), tokenVersion: Date.now() },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d" }
);

module.exports = { generateAccessToken, generateRefreshToken };
