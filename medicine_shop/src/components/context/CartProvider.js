import React, {useState, useEffect} from "react";
import CartContext from "./CartContext";

const CartProvider = props => {

    const [cart, setCart] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const storedMenuItems = localStorage.getItem("MenuItems");
        if(storedMenuItems){
            setMenuItems(JSON.parse(storedMenuItems));
        }

        const storedCart = localStorage.getItem("Cart");
        if(storedCart){
            setCart(JSON.parse(storedCart));
        }
    }, []);

    useEffect (() => {
        if (cart.length === 0) return;
        localStorage.setItem("Cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (menuItems.length === 0) return;
        localStorage.setItem("MenuItems", JSON.stringify(menuItems));
    }, [menuItems]);


    const addToMenu = newItem => {
        setMenuItems(prevItems => [...prevItems, newItem]);
    };

    const addMedItems = newItem => {
        const existingItem = cart.find((item) => item.name === newItem.name);
        const menuItem = menuItems.find(item => item.name === newItem.name);

        if (menuItem.avail <= 0) {
            alert("Oops! Out of stock.");
            return;
        }

        const updatedMenuItems = menuItems.map(item => 
            item.name === newItem.name ? {...item, avail: item.avail - 1 } : item
        );

        setMenuItems(updatedMenuItems);

        if (existingItem) {
            const updatedCart = cart.map((item) =>
                item.name === newItem.name ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCart(updatedCart);
        } else {
            setCart((prevCart) => [...prevCart, { ...newItem, quantity: 1 }]);
        }
    };
    

    const removeMedItems = (deletingItem) => {
        const existingItem = cart.find(item => item.name === deletingItem.name);

        if (!existingItem) return;

        const updatedMenuItems = menuItems.map(item =>
            item.name === deletingItem.name
                ? { ...item, avail: Number(item.avail) + 1 }
                : item
        );
        setMenuItems(updatedMenuItems);

        if (existingItem.quantity === 1) {
            const updatedCart = cart.filter(item => item.name !== deletingItem.name);
            setCart(updatedCart);
        } else {
            const updatedCart = cart.map(item =>
                item.name === deletingItem.name
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );
            setCart(updatedCart);
        }
    };

    const contextValue = {
        cart,
        menuItems,
        addToMenu,
        addMedItems,
        removeMedItems,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {props.children}
        </CartContext.Provider>
    );
};

export default CartProvider;