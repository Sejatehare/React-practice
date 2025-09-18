import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateExpenseInFirebase } from "../store/actions/expenseActions";

const EditExpenseForm = ({ userId, expense, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(expense.title || "");
  const [amount, setAmount] = useState(expense.amount || "");
  const [type, setType] = useState(expense.type || "debit");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(expense.title);
    setAmount(expense.amount);
    setType(expense.type || "debit");
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return alert("Please fill all fields!");

    setLoading(true);
    try {
      await dispatch(updateExpenseInFirebase(userId, expense.id, {
        title,
        amount: parseFloat(amount),
        type,
        date: new Date().toISOString(),
      }));
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center">Edit Expense</h2>

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

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExpenseForm;
