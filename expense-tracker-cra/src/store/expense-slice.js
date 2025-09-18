import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    setExpenses(state, action){ state.items = action.payload },
    addExpense(state, action){ state.items.push(action.payload) },
    updateExpense(state, action){ state.items = state.items.map(e=>e.id===action.payload.id?action.payload:e) },
    removeExpense(state, action){ state.items = state.items.filter(e=>e.id!==action.payload) },
    setLoading(state, action){ state.loading = action.payload }
  }
});

export const { setExpenses, addExpense, updateExpense, removeExpense, setLoading } = expenseSlice.actions;
export default expenseSlice.reducer;
