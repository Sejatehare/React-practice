import React, { useEffect, useState } from 'react';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';
import { useSelector, useDispatch } from 'react-redux';
import { setExpenses } from '../store/expense-slice';
import { listenExpenses } from '../firebase/firebaseHelpers';

export default function ExpenseTracker() {
  const user = useSelector(state => state.auth.user);
  const expenses = useSelector(state => state.expense.items || []);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('');

  // Listen to Firebase for changes
  useEffect(() => {
    if (!user) return;
    const unsub = listenExpenses(user.uid, list => {
      dispatch(setExpenses(list));
    });
    return () => unsub && unsub();
  }, [user, dispatch]);

  // Filter only by description
  const filtered = expenses.filter(
    e => !filter || (e.description || '').toLowerCase().includes(filter.toLowerCase())
  );

  // Totals
  const totalCredit = expenses
    .filter(e => e.type === 'credit')
    .reduce((sum, e) => sum + Number(e.moneySpent || 0), 0);

  const totalDebit = expenses
    .filter(e => e.type === 'debit')
    .reduce((sum, e) => sum + Number(e.moneySpent || 0), 0);

  const balance = totalCredit - totalDebit;

  return (
    <div className="space-y-6">
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
          placeholder="Search by description"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="p-2 rounded border flex-1 dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      {/* Form */}
      <AddExpenseForm />

      {/* Expense list */}
      <ExpenseList items={filtered} />
    </div>
  );
}
