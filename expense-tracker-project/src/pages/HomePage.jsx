import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchExpenses, deleteExpenseFromFirebase } from "../store/actions/expenseActions";
import AddExpenseForm from "../components/AddExpenseForm";
import EditExpenseForm from "../components/EditExpenseForm";

const HomePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const expenses = useSelector(state => state.expenses?.expenses || []);
  const loading = useSelector(state => state.expenses?.loading);

  const [editingExpense, setEditingExpense] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (user) dispatch(fetchExpenses(user.uid));
  }, [dispatch, user]);

  if (!user) return <p className="text-center mt-10">Please login to see expenses.</p>;

  // ✅ Filter by title or type
  const filteredExpenses = expenses.filter(e =>
    !filter ||
    (e.title || "").toLowerCase().includes(filter.toLowerCase()) ||
    (e.type || "").toLowerCase().includes(filter.toLowerCase())
  );

  // Totals
  const totalCredit = expenses
    .filter(e => e.type === "credit")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalDebit = expenses
    .filter(e => e.type === "debit")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const balance = totalCredit - totalDebit;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4 space-y-6">
      {/* Totals */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center">
          <h4 className="font-bold text-green-700 dark:text-green-300">Total Credit</h4>
          <p className="text-xl text-green-800 dark:text-green-200">₹{totalCredit}</p>
        </div>
        <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg text-center">
          <h4 className="font-bold text-red-700 dark:text-red-300">Total Debit</h4>
          <p className="text-xl text-red-800 dark:text-red-200">₹{totalDebit}</p>
        </div>
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg text-center">
          <h4 className="font-bold text-blue-700 dark:text-blue-300">Balance</h4>
          <p className="text-xl text-blue-800 dark:text-blue-200">₹{balance}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search by title or type"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="p-2 rounded border flex-1 dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      {/* Add form */}
      <AddExpenseForm userId={user.uid} />

      {/* Expenses list */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredExpenses.length === 0 ? (
        <p className="text-center mt-4 text-sm opacity-70">No expenses found.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {filteredExpenses.map(exp => (
            <li
              key={exp.id}
              className="p-3 bg-white dark:bg-gray-700 rounded-md shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{exp.title}</p>
                <p>${exp.amount}</p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-bold rounded ${
                    exp.type === "credit" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {exp.type.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingExpense(exp)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch(deleteExpenseFromFirebase(user.uid, exp.id))}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit form */}
      {editingExpense && (
        <EditExpenseForm
          userId={user.uid}
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
