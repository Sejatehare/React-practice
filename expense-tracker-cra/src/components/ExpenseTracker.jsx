import React, { useEffect, useState } from 'react';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';
import { useSelector, useDispatch } from 'react-redux';
import { setExpenses } from '../store/expense-slice';
import { listenExpenses } from '../firebase/firebaseHelpers';

export default function ExpenseTracker(){
  const user = useSelector(state=>state.auth.user);
  const expenses = useSelector(state=>state.expense.items);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('');

  useEffect(()=>{
    if(!user) return;
    const unsub = listenExpenses(user.uid, list => {
      dispatch(setExpenses(list));
    });
    return () => unsub && unsub();
  },[user, dispatch]);

  const filtered = expenses.filter(e => !filter || e.category.toLowerCase().includes(filter.toLowerCase()) || (e.description||'').toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input placeholder="Search by description or category" value={filter} onChange={e=>setFilter(e.target.value)} className="p-2 rounded border flex-1"/>
      </div>
      <AddExpenseForm />
      <ExpenseList items={filtered} />
    </div>
  )
}
