// src/store/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "../api/dbAPI";

export const getProducts = createAsyncThunk("products/fetchAll", async () => await fetchProducts());
export const createProduct = createAsyncThunk("products/add", async (data) => await addProduct(data));
export const editProduct = createAsyncThunk("products/update", async ({ id, data }) => await updateProduct(id, data));
export const removeProduct = createAsyncThunk("products/delete", async (id) => await deleteProduct(id));

const productSlice = createSlice({
  name: "products",
  initialState: { items: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state)=>{state.loading=true})
      .addCase(getProducts.fulfilled, (state, action)=>{state.loading=false; state.items=action.payload})
      .addCase(getProducts.rejected, (state, action)=>{state.loading=false; state.error=action.error.message})
      .addCase(createProduct.fulfilled, (state, action)=>{ state.items.push(action.payload) })
      .addCase(editProduct.fulfilled, (state, action)=> {
        const idx = state.items.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeProduct.fulfilled, (state, action)=> {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  },
});

export default productSlice.reducer;
