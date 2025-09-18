import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch only logged-in user's expenses
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://expense-tracker-3817d-default-rtdb.firebaseio.com/expenses/${userId}.json`
      );

      if (!response.data) {
        return []; // no expenses yet
      }

      // Convert object to array
      const loadedExpenses = Object.keys(response.data).map((key) => ({
        id: key,
        ...response.data[key],
      }));

      return loadedExpenses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addExpense(state, action) {
      state.items.push(action.payload);
    },
    updateExpense(state, action) {
      const index = state.items.findIndex((exp) => exp.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteExpense(state, action) {
      state.items = state.items.filter((exp) => exp.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { addExpense, updateExpense, deleteExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
