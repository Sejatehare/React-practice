import React, {useState} from "react";
import ExpensesItem from "./ExpensesItem";
import ExpensesFilter from "./ExpensesFilter";
import "./Expenses.css";
import Card from "../UI/Card";

function Expenses(props){
  const [filterYear, setFilterYear] = useState("2020");

  const changeFilterHandler = (selectedYear) => {
    setFilterYear(selectedYear);
  }

  const filteredExpense = props.expenses.filter((expense) => {
    return expense.date.getFullYear().toString() === filterYear;
  });

  return (
    <Card className="expenses">
      <ExpensesFilter selected={filterYear} onChangeFilter={changeFilterHandler}/>
      {filteredExpense.length === 0 && <p>No Expense Found</p>}
      {filteredExpense.length === 1 && (
        <>
          <ExpensesItem
          key={filteredExpense[0].id}
          date={filteredExpense[0].date}
          title={filteredExpense[0].title}
          price={filteredExpense[0].price}
          ></ExpensesItem>
          <p>Only one expense here. Please add more.</p>
        </>
      )}
      {filteredExpense.length > 1 && filteredExpense.map((expense) => (
      <ExpensesItem
        key={expense.id}
        date={expense.date}
        title={expense.title}
        price={expense.price}
      ></ExpensesItem>
    ))}
    </Card>
  );
}

export default Expenses;