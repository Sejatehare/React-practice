import React, {useState} from "react";
import ExpensesFilter from "./ExpensesFilter";
import ExpenseChart from "./ExpenseChart";
import ExpensesList from "./ExpensesList";
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
      <ExpenseChart chartData={filteredExpense}/>
      <ExpensesList items={filteredExpense}/>
    </Card>
  );
}

export default Expenses;