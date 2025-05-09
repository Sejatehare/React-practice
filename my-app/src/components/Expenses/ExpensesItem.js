import React from "react";
import Card from "../UI/Card";
import "./ExpensesItem.css";
import ExpenseDate from "./ExpenseDate";

function ExpensesItem(props) {
  return (
    <Card className="expense-item">
      <ExpenseDate date={props.date}></ExpenseDate>
      <div className="expense-item__description">
        <h2>{props.title}</h2>
        <div className="expense-item__price">${props.price}</div>
      </div>
    </Card>
  );
}

export default ExpensesItem;