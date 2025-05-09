import React, { useState } from "react";
import ExpenseForm from "./ExpenseForm";
import "./NewExpense.css";

const NewExpense = (props) => {
    const [isEditing, setIsEditing] = useState(false);

    const SaveExpenseDataHandler = ((enteredExpense) => {
        const expenseData = {...enteredExpense,
            id: Math.random().toString()
        }
        props.onDataPass(expenseData)
        setIsEditing(false);
    })

    return <div className="new-expense">
        {!isEditing && (
            <button type="button" onClick={() => {
                setIsEditing(true);
            }}>Add Expense</button>
        )}
        {isEditing && (
            <ExpenseForm onSaveExpenseData={SaveExpenseDataHandler} onCancel={() => {
                setIsEditing(false);
            }}/>
        )}
    </div>
}

export default NewExpense;