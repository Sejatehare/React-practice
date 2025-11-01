// src/store/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOrders, placeOrder, updateOrder } from "../api/dbAPI";

export const getOrders = createAsyncThunk("orders/fetchAll", async () => {
  return await fetchOrders();
});

export const addOrder = createAsyncThunk("orders/add", async (order) => {
  return await placeOrder(order);
});

export const setOrder = createAsyncThunk("orders/update", async ({ id, data }) => {
  return await updateOrder(id, data);
});

const orderSlice = createSlice({
  name: "orders",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => { state.loading = true; })
      .addCase(getOrders.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(getOrders.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(addOrder.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(setOrder.fulfilled, (state, action) => {
        const idx = state.items.findIndex(o => o.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export default orderSlice.reducer;
