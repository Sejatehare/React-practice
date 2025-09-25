import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchExpenses } from "../store/actions/expenseActions";
import AddExpenseForm from "../components/AddExpenseForm";
import ExpenseList from "../components/ExpenseList";
import EditExpenseForm from "../components/EditExpenseForm";

export default function HomePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const expenses = useSelector((state) => state.expenses.expenses);
  const loading = useSelector((state) => state.expenses.loading);

  const [search, setSearch] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    if (!user) return;
    dispatch(fetchExpenses(user.uid));
  }, [user, dispatch]);

  const filtered = expenses.filter((e) =>
    [e.title, e.type].some((f) => f?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalCredit = expenses.filter((e) => e.type === "credit").reduce((acc, e) => acc + e.amount, 0);
  const totalDebit = expenses.filter((e) => e.type === "debit").reduce((acc, e) => acc + e.amount, 0);
  const balance = totalCredit - totalDebit;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Expense Dashboard</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by title or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <AddExpenseForm userId={user.uid} />

          {loading ? (
            <p className="text-center mt-4">Loading...</p>
          ) : (
            <ExpenseList items={filtered} onEdit={setEditingExpense} userId={user?.uid} />
          )}
        </div>

        <div className="hidden lg:flex flex-col gap-4 w-56 sticky top-4 self-start h-[calc(80vh-2rem)]">
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center shadow flex-1 flex flex-col justify-center">
            <h4 className="font-bold text-green-700 dark:text-green-300">Total Credit</h4>
            <p className="text-xl text-green-800 dark:text-green-200">₹{totalCredit}</p>
          </div>
          <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg text-center shadow flex-1 flex flex-col justify-center">
            <h4 className="font-bold text-red-700 dark:text-red-300">Total Debit</h4>
            <p className="text-xl text-red-800 dark:text-red-200">₹{totalDebit}</p>
          </div>
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg text-center shadow flex-1 flex flex-col justify-center">
            <h4 className="font-bold text-blue-700 dark:text-blue-300">Balance</h4>
            <p className="text-xl text-blue-800 dark:text-blue-200">₹{balance}</p>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 flex gap-2 p-2 bg-white dark:bg-gray-800/90 shadow-inner border-t">
        <div className="flex-1 p-2 bg-green-100 dark:bg-green-900 rounded text-center">
          <h4 className="text-green-700 dark:text-green-300 text-sm">Credit</h4>
          <p className="font-bold text-green-800 dark:text-green-200 text-base">₹{totalCredit}</p>
        </div>
        <div className="flex-1 p-2 bg-red-100 dark:bg-red-900 rounded text-center">
          <h4 className="text-red-700 dark:text-red-300 text-sm">Debit</h4>
          <p className="font-bold text-red-800 dark:text-red-200 text-base">₹{totalDebit}</p>
        </div>
        <div className="flex-1 p-2 bg-blue-100 dark:bg-blue-900 rounded text-center">
          <h4 className="text-blue-700 dark:text-blue-300 text-sm">Balance</h4>
          <p className="font-bold text-blue-800 dark:text-blue-200 text-base">₹{balance}</p>
        </div>
      </div>

      {editingExpense && (
        <EditExpenseForm
          userId={user.uid}
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
}
