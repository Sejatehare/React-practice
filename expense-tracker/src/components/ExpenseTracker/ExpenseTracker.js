import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../Store/auth-slice";
import ExpenseContext from "../../Store/ExpenseContext";
import ExpenseList from "./ExpenseList";
import DownloadCSVButton from "./DownloadCSVButton";

const ExpenseTracker = () => {
  const [money, setMoney] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const dispatch = useDispatch();
  const isPremium = useSelector((s) => s.auth.isPremium);
  const items = useSelector((s) => s.expense.items);
  const total = items.reduce((sum, e) => sum + Number(e.moneySpent), 0);

  const ctx = useContext(ExpenseContext);

  useEffect(() => {
    ctx.fetchExpense();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    const obj = { moneySpent: money, description: desc, category: cat };
    if (isEdit) {
      ctx.updateExpense({ ...obj, id: editId });
    } else {
      ctx.addExpense(obj);
    }
    setMoney(""); setDesc(""); setCat(""); setIsEdit(false);
  };

  const onEdit = (e) => {
    setIsEdit(true);
    setMoney(e.moneySpent);
    setDesc(e.description);
    setCat(e.category);
    setEditId(e.id);
  };

  const activateHandler = () => {
    dispatch(authActions.activatePremium());
  };

  return (
    <div>
      <h2>Expense Tracker</h2>
      <form onSubmit={submitHandler}>
        <input placeholder="Money" value={money} onChange={(e) => setMoney(e.target.value)} required />
        <input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} required />
        <select value={cat} onChange={(e) => setCat(e.target.value)} required>
          <option value="">Select Category</option>
          <option>Food</option>
          <option>Petrol</option>
          <option>Salary</option>
        </select>
        <button type="submit">{isEdit ? "Edit" : "Add"}</button>
      </form>

      <ExpenseList expenses={items} onEditExpense={onEdit} />
      <h3>Total: ₹{total}</h3>

      {!isPremium && total >= 10000 && (
        <button onClick={activateHandler}>Activate Premium</button>
      )}
      {isPremium && <DownloadCSVButton />}
    </div>
  );
};

export default ExpenseTracker;
