import React, {useState} from "react";
import Expenses from "./components/Expenses/Expenses";
import NewExpense from "./components/NewExpense/NewExpense";

function App() {
  const [expense, setExpenses] = useState([
    {id:"1", date: new Date(2021, 3, 10), title:"Book",price:"200"},
    {id:"2", date: new Date(2022, 2, 5), title:"Insurance",price:"20000"},
    {id:"3", date: new Date(2023, 8, 27), title:"Shopping",price:"3000"},
    {id:"4", date: new Date(2020, 7, 7), title:"Movie",price:"500"},
  ]);

  const dataPassHandler = (expenseData) => {
    setExpenses ((prev) => {
      return [expenseData, ...prev]
    });
  };

  return (
    <div>
       <h1>Let's get started!</h1>
        <NewExpense onDataPass={dataPassHandler}/>
        <Expenses expenses={expense}></Expenses>
    </div>
  );
}

export default App;
