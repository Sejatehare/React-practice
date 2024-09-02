import CartIcon from "../Cart/CartIcon";
import classes from "./HeaderCartButton.module.css";

const HeaderCartButton = (props) => {
    return <div className={classes.button} onClick={props.onClick}>
        <CartIcon/>
        <span className={classes.text}>Your Cart</span>
        <span className={classes.badge}>3</span>
    </div>
}

export default HeaderCartButton;