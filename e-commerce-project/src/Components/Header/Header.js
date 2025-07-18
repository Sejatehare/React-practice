import { useState } from "react";
import { Button } from "react-bootstrap";
import Cart from "../Cart/Cart";
import CartContext from "../Context/CartContext";
import { useContext } from "react";
import './Header.css';
import {Link} from 'react-router-dom';

const Header = () => {
    const [showCart, setShowCart] = useState(false);
    const showCartHandler = () => {
        setShowCart(!showCart)
    }

    const cartCtx = useContext(CartContext);
    
    let totalAmount = 0;
    cartCtx.items.map((item) => (
        totalAmount += item.quantity
    ))

    return (
        <div className="navbar">
            <header className="header">
                <div className="links">
                    <Link to="/">Home</Link>
                </div>
                <div className="links">
                    <Link to="/store">Store</Link>
                </div>
                <div className="links">
                    <Link to="/about">About</Link>
                </div>

                <Button className="cart-holder" onClick={showCartHandler}>Cart ({totalAmount})</Button>

                {showCart && <Cart showCartHandler={showCartHandler}></Cart>}
            </header>
            <h1>The Generics</h1>
        </div>
    );
}

export default Header;