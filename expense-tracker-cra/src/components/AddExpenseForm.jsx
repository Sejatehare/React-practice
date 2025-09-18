import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { addExpenseToDB } from '../firebase/firebaseHelpers';
import toast from 'react-hot-toast';

export default function AddExpenseForm(){
  const user = useSelector(state => state.auth.user);
  const [form, setForm] = useState({ moneySpent:'', description:'', category:'Food' });

  async function submit(e){
    e.preventDefault();
    if(!user) return toast.error('Please login first');
    if(!form.moneySpent) return toast.error('Enter amount');
    const payload = { ...form, date: new Date().toISOString() };
    await addExpenseToDB(user.uid, payload);
    toast.success('Expense added');
    setForm({ moneySpent:'', description:'', category:'Food' });
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
      <input value={form.moneySpent} onChange={e=>setForm({...form,moneySpent:e.target.value})} placeholder="Amount" className="p-2 rounded border"/>
      <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" className="p-2 rounded border"/>
      <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="p-2 rounded border">
        <option>Food</option>
        <option>Petrol</option>
        <option>Salary</option>
        <option>Other</option>
      </select>
      <div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Add Expense</button>
      </div>
    </form>
  )
}
