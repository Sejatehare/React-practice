import { createSlice } from "@reduxjs/toolkit";

const initialState = { items: [] };

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
    addItem(state, action) {
      state.items.push(action.payload);
    },
    editItem(state, action) {
      const idx = state.items.findIndex((e) => e.id === action.payload.item.id);
      if (idx >= 0) state.items[idx] = action.payload.item;
    },
    removeItem(state, action) {
      state.items = state.items.filter((e) => e.id !== action.payload.id);
    },
  },
});

export const expenseActions = expenseSlice.actions;
export default expenseSlice.reducer;
