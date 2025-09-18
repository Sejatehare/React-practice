import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddExpenseForm = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categorys.categorys);

  const [form, setForm] = useState({
    moneySpent: "",
    description: "",
    category: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = Date.now().toString();
    dispatch(setExpence({ ...form, id }));
    setForm({ moneySpent: "", description: "", category: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3">
      <input name="moneySpent" type="number" value={form.moneySpent} onChange={handleChange} placeholder="Amount" className="border p-2 w-full" required />
      <input name="description" type="text" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 w-full" required />
      <select name="category" value={form.category} onChange={handleChange} className="border p-2 w-full" required>
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.name}>{c.name}</option>
        ))}
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Expense</button>
    </form>
  );
};

export default AddExpenseForm;
