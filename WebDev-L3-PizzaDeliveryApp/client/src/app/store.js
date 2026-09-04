import { configureStore } from "@reduxjs/toolkit";
import auth from "../features/auth/authSlice"; import cart from "../features/cart/cartSlice"; import products from "../features/products/productSlice"; import orders from "../features/orders/orderSlice";
export default configureStore({ reducer: { auth, cart, products, orders } });
