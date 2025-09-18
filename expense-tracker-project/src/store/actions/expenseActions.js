// store/actions/expenseActions.js
import { getDatabase, ref, push, set, get, remove, update } from "firebase/database";
import { setExpenses, addExpense, updateExpense, deleteExpense, setLoading } from "../expense-slice";

export const fetchExpenses = (userId) => async (dispatch) => {
  if (!userId) return;
  dispatch(setLoading(true));
  const db = getDatabase();
  try {
    const snapshot = await get(ref(db, `users/${userId}/expenses`)); // ✅ corrected path
    if (snapshot.exists()) {
      const expensesArray = Object.keys(snapshot.val()).map(key => ({
        id: key,
        ...snapshot.val()[key]
      }));
      dispatch(setExpenses(expensesArray));
    } else {
      dispatch(setExpenses([]));
    }
  } catch (err) {
    console.error(err);
  }
  dispatch(setLoading(false));
};

export const addExpenseToFirebase = (userId, expenseData) => async (dispatch) => {
  if (!userId) return;
  const db = getDatabase();
  const newExpenseRef = push(ref(db, `users/${userId}/expenses`)); // ✅ corrected path
  await set(newExpenseRef, expenseData);
  dispatch(addExpense({ id: newExpenseRef.key, ...expenseData }));
};

export const updateExpenseInFirebase = (userId, expenseId, expenseData) => async (dispatch) => {
  if (!userId) return;
  const db = getDatabase();
  await update(ref(db, `users/${userId}/expenses/${expenseId}`), expenseData); // ✅ corrected path
  dispatch(updateExpense({ id: expenseId, ...expenseData }));
};

export const deleteExpenseFromFirebase = (userId, expenseId) => async (dispatch) => {
  if (!userId) return;
  const db = getDatabase();
  await remove(ref(db, `users/${userId}/expenses/${expenseId}`)); // ✅ corrected path
  dispatch(deleteExpense(expenseId));
};
