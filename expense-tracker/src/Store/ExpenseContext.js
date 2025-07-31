import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import AuthContext from "./AuthContext";
import { expenseActions } from "./expense-slice";

const ExpenseContext = React.createContext();

export const ExpenseContextProvider = (props) => {
  const [expenseItems, setExpenseItems] = useState([]);
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);

  const userId = (authCtx.userId || "").replace(/[^a-zA-Z0-9]/g, "");
  const api = "https://expense-tracker-3817d-default-rtdb.firebaseio.com";

  const fetchExpense = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${api}/expenses/${userId}.json`);
      const data = await res.json();
      const list = data
        ? Object.entries(data).map(([id, val]) => ({ id, ...val }))
        : [];
      setExpenseItems(list);
      dispatch(expenseActions.setItems(list));
    } catch (err) {
      console.error("Fetching failed", err);
    }
  };

  const addExpense = async (item) => {
    if (!userId) return;
    const res = await fetch(`${api}/expenses/${userId}.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    const newItem = { ...item, id: data.name };
    setExpenseItems((prev) => [...prev, newItem]);
    dispatch(expenseActions.addItem(newItem));
  };

  const updateExpense = async (item) => {
    if (!userId) return;
    await fetch(`${api}/expenses/${userId}/${item.id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    setExpenseItems((prev) => prev.map((e) => (e.id === item.id ? item : e)));
    dispatch(expenseActions.editItem({ item }));
  };

  const removeExpense = async (id) => {
    if (!userId) return;
    await fetch(`${api}/expenses/${userId}/${id}.json`, {
      method: "DELETE",
    });
    setExpenseItems((prev) => prev.filter((e) => e.id !== id));
    dispatch(expenseActions.removeItem({ id }));
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses: expenseItems,
        fetchExpense,
        addExpense,
        updateExpense,
        removeExpense,
      }}
    >
      {props.children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContext;
