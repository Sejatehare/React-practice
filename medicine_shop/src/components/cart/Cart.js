import React, {useContext, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import CartContext from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import "../styles/Cart.css";

const Cart = props => {
    const cartCtx = useContext(CartContext);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const total = cartCtx.cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        setTotalAmount(total);
    }, [cartCtx.cart]);

    return ReactDOM.createPortal(
        <div className="Container">
            <div className="Cart-Box">
                <div className="Cart-Array">
                    {cartCtx.cart.length === 0 ? (<p>Cart is empty.</p>) : (
                    cartCtx.cart.map((item, index) => (
                        <div key={index} className="CartItem">
                            <p>{item.name}</p>
                            <p>₹{item.price}</p>
                            <p>Qty: {item.quantity}</p>
                            <div>
                                <button onClick={() => cartCtx.removeMedItems(item)}>
                                <FontAwesomeIcon icon={faCartArrowDown} />
                                </button>
                                <button onClick={() => cartCtx.addMedItems(item)}>
                                <FontAwesomeIcon icon={faCartShopping} />
                                </button>
                            </div>
                        </div>
                        ))
                    )}
                </div>

                <div className="TotalAmount">
                        <p className="TA">Total Amount:</p>
                        <p className="TA">{totalAmount} /-</p>
                </div>
                <div className="Cart-Btns">
                    <button className="BTN CNCL" onClick={props.onClose}>
                        Close
                    </button>
                    <button className="BTN ORDR" onClick={props.onOrder}>
                        Order
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("root1")
    );
};


export default Cart;