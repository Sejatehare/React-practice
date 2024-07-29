import React, { useState } from "react";
import "./ExpenseForm.css";

const ExpenseForm = (props) => {
    const [userInput, setUserInput] = useState({
        title:"",
        price:"",
        date:"",
    });
    
    const titleHandler = (event) => {
        setUserInput((prevState) => {
            return{
                ...prevState,
                title: event.target.value,
            }
        });
    };

    const amountHandler = (event) => {
        setUserInput((prevState) => {
            return{
                ...prevState,
                price: event.target.value,
            }
        });
    }

    const dateHandler = (event) => {
        setUserInput((prevState) => {
            return{
                ...prevState,
                date: event.target.value,
            }
        });
    }

    const formSubmitHandler = (event) => {
        event.preventDefault();
        const expenseData = {
            title:userInput.title,
            price:userInput.price,
            date:new Date(userInput.date),
        }
        props.onSaveExpenseData(expenseData);
        setUserInput({
            title:"",
            price:"",
            date:"",
        });
    }

    return <div>
        <form onSubmit={formSubmitHandler}>
            <div className="new-expense__controls">
                <div className="new-expense__control">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" value={userInput.title} onChange={titleHandler}></input>
                </div>
                <div className="new-expense__control">
                    <label htmlFor="amount">Amount</label>
                    <input type="number" id="amount" value={userInput.price} onChange={amountHandler}></input>
                </div>
                <div className="new-expense__control">
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" value={userInput.date} min="2020-01-01" max="2025-12-31" onChange={dateHandler}></input>
                </div>
            </div>
            <div className="new_expense__actions">
                <button type="submit">Add</button>
            </div>
        </form>
    </div>
}

export default ExpenseForm;