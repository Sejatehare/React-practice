import React from "react";

const CartContext = React.createContext({
    MedCart: [],
    addMedItems : (item) => {},
    removeMedItems: (item) => {},
    addToMenu: (item) => {},
    MenuItems: []
});

export default CartContext;
