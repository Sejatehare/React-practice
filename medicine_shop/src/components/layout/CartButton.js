import React, {useContext, useState, useEffect, useCallback} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import CartContext from "../context/CartContext";
import "../styles/CartButton.css";

const CartButton = (props) => {
    const cartCtx = useContext(CartContext);
    const [cartQuantity, setCartQuantity] = useState(0);

    const updateCartQuantity = useCallback(() => {
        const totalQuantity = cartCtx.cart.reduce((total, item) => total + item.quantity, 0);
        setCartQuantity(totalQuantity);
    }, [cartCtx.cart]);

    useEffect(() => {
        updateCartQuantity();
    }, [cartCtx.cart, updateCartQuantity]);

    return (
        <button className="cart-btn" onClick={props.Click}>
            <FontAwesomeIcon icon={faCartShopping} size="xl" style={{ color: "#ffffff", }} />
            <p className="C-RT">{cartQuantity}</p>
        </button>
    );
};

export default CartButton