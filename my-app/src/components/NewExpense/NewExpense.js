import React from "react";
import ExpenseForm from "./ExpenseForm";
import "./NewExpense.css";

const NewExpense = (props) => {
    const SaveExpenseDataHandler = ((enteredExpense) => {
        const expenseData = {...enteredExpense,
            id: Math.random().toString()
        }
        console.log(expenseData)
        props.onDataPass(expenseData)
    })

    return <div className="new-expense">
        <ExpenseForm onSaveExpenseData={SaveExpenseDataHandler}/>
    </div>
}

export default NewExpense;