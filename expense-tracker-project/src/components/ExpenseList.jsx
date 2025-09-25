import React from "react";
import { useDispatch } from "react-redux";
import { deleteExpenseFromFirebase } from "../store/actions/expenseActions";
import toast from "react-hot-toast";

export default function ExpenseList({ items, onEdit, userId }) {
  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    if (!userId) return toast.error("Not logged in");
    try {
      await dispatch(deleteExpenseFromFirebase(userId, id));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  if (!items || items.length === 0)
    return <p className="text-center mt-4 text-sm opacity-70">No expenses found.</p>;

  return (
    <ul className="mt-4 flex flex-col gap-3">
      {items.map((exp) => (
        <li
          key={exp.id}
          className="p-3 bg-white dark:bg-gray-700 rounded-md shadow flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{exp.title || "—"}</p>
            <p>₹{exp.moneySpent || exp.amount}</p>
            <span
              className={`inline-block px-2 py-1 text-xs font-bold rounded ${
                exp.type === "credit"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {exp.type.toUpperCase()}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(exp)}
              className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(exp.id)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
