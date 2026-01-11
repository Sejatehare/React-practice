import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCategories, addCategory, deleteCategory, updateCategory } from "../api/dbAPI";

export const getCategories = createAsyncThunk("categories/fetchAll", async () => await fetchCategories());
export const createCategory = createAsyncThunk("categories/add", async (data) => await addCategory(data));
export const removeCategory = createAsyncThunk("categories/delete", async (id) => await deleteCategory(id));
export const editCategory = createAsyncThunk("categories/update", async ({ id, data }) => await updateCategory(id, data));

const categorySlice = createSlice({
  name: "categories",
  initialState: { items: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => { state.loading = true; })
      .addCase(getCategories.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(getCategories.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(createCategory.fulfilled, (state, action) => { state.items.push(action.payload); })

      .addCase(removeCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      })

      .addCase(editCategory.fulfilled, (state, action) => {
        const idx = state.items.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export default categorySlice.reducer;
