import { useContext } from "react";
import CartIcon from "../Cart/CartIcon";
import classes from "./HeaderCartButton.module.css";
import CartContext from "../../store/cart-context";

const HeaderCartButton = (props) => {
    const cartCtx = useContext(CartContext);

    const numberOfCartItems = cartCtx.items.reduce((curNumber, item) => {
        return curNumber + item.amount;
    }, 0);

    return <div className={classes.button} onClick={props.onClick}>
        <CartIcon/>
        <span className={classes.text}>Your Cart</span>
        <span className={classes.badge}>{numberOfCartItems}</span>
    </div>
}

export default HeaderCartButton;