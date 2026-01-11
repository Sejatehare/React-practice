import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], 
  total: 0,
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const found = state.items.find((i) => i.id === item.id);
      if (found) {
        found.qty += 1;
      } else {
        state.items.push({ ...item, qty: 1 });
      }
      state.total = state.items.reduce((s, it) => s + it.price * it.qty, 0);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.total = state.items.reduce((s, it) => s + it.price * it.qty, 0);
    },
    updateQty(state, action) {
      const { id, qty } = action.payload;
      const it = state.items.find((i) => i.id === id);
      if (it) it.qty = qty;
      state.total = state.items.reduce((s, it) => s + it.price * it.qty, 0);
    },
    clearCart(state) {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = slice.actions;
export default slice.reducer;
