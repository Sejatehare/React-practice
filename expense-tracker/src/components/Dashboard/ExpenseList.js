import { useDispatch } from "react-redux";
import { expenseActions } from "../../Store/expense-slice";

const ExpenseList = ({ expenses, onEdit }) => {
  const dispatch = useDispatch();

  const deleteHandler = (id) => {
    dispatch(expenseActions.removeItem({ id }));
  };

  return (
    <ul>
      {expenses.length === 0 && <p>No expenses found.</p>}
      {expenses.map((expense) => (
        <li key={expense.id}>
          <p>
            ₹{expense.moneySpent} - {expense.description} ({expense.category})
          </p>
          <button onClick={() => onEdit(expense)}>Edit</button>
          <button onClick={() => deleteHandler(expense.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default ExpenseList;
