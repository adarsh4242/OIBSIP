const Stripe = require("stripe");

module.exports = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== "sk_test_replace_me"
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;
