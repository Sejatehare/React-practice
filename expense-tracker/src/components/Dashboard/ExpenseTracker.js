import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addExpense } from "../../Store/expense-slice";
import ExpenseContainer from "./ExpenseContainer";

const ExpenseTracker = () => {
  const dispatch = useDispatch();
  const categories = ["food", "petrol", "salary"];

  const [form, setForm] = useState({
    moneySpent: "",
    description: "",
    category: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const { moneySpent, description, category } = form;

    if (!moneySpent || !description || !category) {
      alert("Please fill all fields");
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      moneySpent,
      description,
      category,
    };

    dispatch(addExpense({ item: newExpense }));

    setForm({ moneySpent: "", description: "", category: "" });
  };

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={submitHandler} className="space-y-2">
        <input
          type="number"
          name="moneySpent"
          placeholder="Amount"
          value={form.moneySpent}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Expense
        </button>
      </form>

      <ExpenseContainer />
    </div>
  );
};

export default ExpenseTracker;
