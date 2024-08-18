import React from "react";

const TableOrder = ({table,orders,onDeleteOrder}) => {

    return (
        <React.Fragment>
            <h3>{table}</h3>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        {order.dish} - {order.price} - <button onClick={() => onDeleteOrder(order.id)}>Delete Order</button>
                    </li>
                ))}
            </ul>
        </React.Fragment>
    )
}

export default TableOrder;