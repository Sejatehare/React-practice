import CartButton from "./CartButton"
import React from "react";
import "../styles/Header.css";
import "./MedicineForm"
import MedicineForm from "./MedicineForm";

const Header = (props) => {
    return(
        <>
            <div className="Header">
                <div className="HD1">
                    <h1 className="H1">Medicine Shop</h1>
                    <CartButton Click={props.onShowCart} />
                </div>
                <MedicineForm/>
            </div>
        </>
    );
}

export default Header