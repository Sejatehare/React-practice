import cartIcon from "../cart/cartIcon";
import classes from "./HeaderCartButton.module.css";

const HeaderCartButton = () => {
    return <button>
        <span className={classes.button}><cartIcon></cartIcon></span>
        <span className={classes.icon}>Your Cart</span>
        <span className={classes.badge}>3</span>
    </button>
}

export default HeaderCartButton;