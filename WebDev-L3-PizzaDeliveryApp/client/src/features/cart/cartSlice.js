import { createSlice } from "@reduxjs/toolkit";

const readCart = () => {
	try {
		const stored = JSON.parse(localStorage.getItem("cart") || "[]");
		if (!Array.isArray(stored)) return [];

		return stored
			.map((item) => ({
				...item,
				product: item.product || item._id || item.id || item.name,
				price: Number(item.price) || 0,
				quantity: Math.max(Number(item.quantity) || 1, 1),
				stock: Number(item.stock) > 0 ? Number(item.stock) : 999999,
			}))
			.filter((item) => item.product);
	} catch {
		return [];
	}
};

const slice = createSlice({
	name: "cart",
	initialState: readCart(),
	reducers: {
		add: (state, action) => {
			const product = action.payload.product || action.payload._id || action.payload.id || action.payload.name;
			const quantity = Math.max(Number(action.payload.quantity) || 1, 1);
			const stock = Number(action.payload.stock) > 0 ? Number(action.payload.stock) : 999999;
			const item = state.find((cartItem) => cartItem.product === product);

			if (item) {
				item.quantity = Math.min(item.quantity + quantity, item.stock || stock);
			} else {
				state.push({ ...action.payload, product, quantity, stock });
			}
		},
		increase: (state, action) => {
			const item = state.find((cartItem) => cartItem.product === action.payload);
			if (item) item.quantity = Math.min(item.quantity + 1, item.stock || 999999);
		},
		decrease: (state, action) => {
			const item = state.find((cartItem) => cartItem.product === action.payload);
			if (!item) return;

			if (item.quantity <= 1) {
				const index = state.findIndex((cartItem) => cartItem.product === action.payload);
				state.splice(index, 1);
				return;
			}

			item.quantity -= 1;
		},
		remove: (state, action) => state.filter((item) => item.product !== action.payload),
		clear: () => [],
	},
});

export const { add, increase, decrease, remove, clear } = slice.actions;
export default slice.reducer;
