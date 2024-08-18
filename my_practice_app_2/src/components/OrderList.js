import React from "react";
import TableOrder from "./TableOrder";


const OrderList = ({orders,onDeleteOrder}) => {
    return (
        <React.Fragment>
            <h2>
                ORDERS : 
            </h2>
            <TableOrder table="Table 1" orders={orders.filter(order => order.table === 'table1')} onDeleteOrder={onDeleteOrder}/>
            <TableOrder table="Table 2" orders={orders.filter(order => order.table === 'table2')} onDeleteOrder={onDeleteOrder}/>
            <TableOrder table="Table 3" orders={orders.filter(order => order.table === 'table3')} onDeleteOrder={onDeleteOrder}/>
        </React.Fragment>
    )
}

export default OrderList