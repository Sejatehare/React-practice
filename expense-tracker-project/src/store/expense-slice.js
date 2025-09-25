import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expenses: [],
  loading: false,
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpenses(state, action) {
      state.expenses = action.payload;
    },
    addExpense(state, action) {
      state.expenses.push(action.payload);
    },
    updateExpense(state, action) {
      const index = state.expenses.findIndex(e => e.id === action.payload.id);
      if (index !== -1) state.expenses[index] = action.payload;
    },
    removeExpense(state, action) {
      state.expenses = state.expenses.filter(e => e.id !== action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    clearExpenses(state) {
      state.expenses = [];
    }
  }
});

export const { setExpenses, addExpense, updateExpense, removeExpense, setLoading, clearExpenses } = expensesSlice.actions;
export default expensesSlice.reducer;
