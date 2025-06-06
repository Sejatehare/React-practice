import React from "react";
import headerimg from "../../assets/headerimg.jpeg";
import HeaderCartButton from "./HeaderCartButton";
import classes from "./Header.module.css";

const Header = (props) => {
    return (
        <React.Fragment>
            <header className={classes.header}>
                <h1>HappyMeals</h1>
                <HeaderCartButton onClick={props.onShowCart} />
            </header>
            <div className={classes['main-image']}>
                <img src={headerimg} alt="header cover"></img>
            </div>
        </React.Fragment>
    )
}

export default Header;