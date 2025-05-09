import React, {useState} from "react";

const OrderForm = (props) => {
    const [userInput, setUserInput] = useState({
        id:"",
        price:"",
        dish:'',
        table:'',
    });

    const orderIdHandler = (event) => {
        setUserInput((prev) => {
            return{
                ...prev,
                id: event.target.value,
            }
        })
    }

    const priceHandler = (event) => {
        setUserInput((prev) => {
            return{
                ...prev,
                price: event.target.value,
            }
        })
    }

    const dishHandler = (event) => {
        setUserInput((prev) => {
            return{
                ...prev,
                dish: event.target.value,
            }
        })
    }

    const tableHandler = (event) => {
        setUserInput((prev) => {
            return{
                ...prev,
                table: event.target.value,
            }
        })
    }

    const formSubmitHandler = (event) => {
        event.preventDefault();
        const data = {
            id: userInput.id,
            price: +userInput.price,
            dish: userInput.dish,
            table: userInput.table,
        }

        props.onAddOrder(data)
        localStorage.setItem(userInput.id, JSON.stringify(data));

        setUserInput({
            id:'',
            price:'',
            dish:'',
            table:'',
        })
    }

    return <React.Fragment>
        <form onSubmit={formSubmitHandler}>
            <label htmlFor="orderId">Unique Order ID : </label>
            <input id="orderId" type="number" value={userInput.id} onChange={orderIdHandler}></input>
            <label htmlFor="price">Enter Price : </label>
            <input id="price" type="number" value={userInput.price} onChange={priceHandler}></input>
            <label htmlFor="dish">Enter Dish : </label>
            <input id="dish" type="text" value={userInput.dish} onChange={dishHandler}></input>
            <label>Enter Table : </label>
            <select onChange={tableHandler} value={userInput.table}>
                <option value="table1">Table 1</option>
                <option value="table2">Table 2</option>
                <option value="table3">Table 3</option>
            </select>
            <button>Order a Dish</button>
        </form>
    </React.Fragment>
}

export default OrderForm;