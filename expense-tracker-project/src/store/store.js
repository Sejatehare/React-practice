import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import expenseReducer from './expense-slice';
import themeReducer from './theme-slice';

export default configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    theme: themeReducer
  }
});
