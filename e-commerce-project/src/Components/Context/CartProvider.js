import React, { useState } from "react";
import CartContext from "./CartContext";                     

const CartProvider = (props) => {
    const [items, setItems] = useState([]);

    const addItemToCartHandler = (item) => {
        const updateItem = [...items];
        const existingItem = updateItem.find((cartItem) => cartItem.id === item.id);

        if (existingItem) {
           existingItem.quantity = Number(existingItem.quantity) + Number(item.quantity);
        } else {
            updateItem.push(item);
        }
        setItems(updateItem)
    }

    const removeItemFromCartHandler = (id) => {
        const existingItemIndex = items.findIndex((item) => item.id === id);

        if (existingItemIndex !== -1){
            const updateItem = [...items];
            const existingItem = updateItem[existingItemIndex];

            if (existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                 updateItem.splice(existingItemIndex, 1);
            }
            setItems(updateItem)
        }
    }

    const cartContext ={
        items: items,
        addItem: addItemToCartHandler,
        removeItem: removeItemFromCartHandler,
        totalAmount: 0,
    };

    return (
        <CartContext.Provider value={cartContext}>
            {props.children}
        </CartContext.Provider>
    );
};

export default CartProvider;