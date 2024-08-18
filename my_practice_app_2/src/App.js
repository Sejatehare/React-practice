import React, {useState} from "react";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";

function App() {
  const [orders, setOrders] = useState([]);

  const addOrderHandler = (order) => {
    setOrders((prev) => [...prev, order])
  }

  const deleteOrderHandler = (orderid) => {
    localStorage.removeItem(orderid)
    setOrders(orders.filter(order => order.id !== orderid))
  }

  return (
    <React.Fragment>
      <OrderForm onAddOrder={addOrderHandler}/>
      <OrderList orders={orders} onDeleteOrder={deleteOrderHandler}/>
    </React.Fragment>
  );
}

export default App;
