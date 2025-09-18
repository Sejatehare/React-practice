import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteExpense } from "../../Store/expense-slice";

const ExpenseContainer = ({ onEdit }) => {
  const expenses = useSelector((state) => state.expenses.items);
  const dispatch = useDispatch();

  const deleteHandler = (id) => {
    dispatch(deleteExpense(id));
  };

  return (
    <ul>
      {expenses.map((expense) => (
        <li key={expense.id}>
          {expense.title} - ${expense.amount}
          <button onClick={() => onEdit(expense)}>Edit</button>
          <button onClick={() => deleteHandler(expense.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default ExpenseContainer;
