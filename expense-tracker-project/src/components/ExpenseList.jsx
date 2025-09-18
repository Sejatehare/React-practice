import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeExpense } from '../store/expense-slice';
import { removeExpenseFromDB } from '../firebase/firebaseHelpers';
import toast from 'react-hot-toast';

export default function ExpenseList({ items }) {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  async function deleteOne(id) {
    if (!user) return toast.error('Not logged in');
    await removeExpenseFromDB(user.uid, id);
    dispatch(removeExpense(id));
    toast.success('Deleted');
  }

  if (!items || items.length === 0) {
    return <p className="text-sm opacity-70 text-center mt-4">No expenses found.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map(it => (
        <div
          key={it.id}
          className="p-3 bg-white/80 dark:bg-gray-800/80 rounded shadow flex justify-between items-center"
        >
          <div>
            <div className="font-semibold">{it.description || '—'}</div>
            <div className="text-xs mt-1">
              {it.type === "credit" ? (
                <span className="text-green-600 font-medium">Credit</span>
              ) : (
                <span className="text-red-600 font-medium">Debit</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`font-bold ${
                it.type === "credit" ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{it.moneySpent}
            </div>
            <button
              onClick={() => deleteOne(it.id)}
              className="px-2 py-1 border rounded hover:bg-red-50 dark:hover:bg-red-900"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
