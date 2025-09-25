import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addExpenseToFirebase } from "../store/actions/expenseActions";

const AddExpenseForm = ({ userId }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("debit");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return alert("Please fill all fields!");

    setLoading(true);
    try {
      await dispatch(addExpenseToFirebase(userId, {
        title,
        amount: parseFloat(amount),
        type,
      }));
      setTitle("");
      setAmount("");
      setType("debit");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-md shadow">
      <input
        type="text"
        placeholder="Expense Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            value="credit"
            checked={type === "credit"}
            onChange={() => setType("credit")}
            className="accent-indigo-600"
          />
          Credit
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            value="debit"
            checked={type === "debit"}
            onChange={() => setType("debit")}
            className="accent-red-600"
          />
          Debit
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
      >
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
};

export default AddExpenseForm;
