import React, { useContext } from "react";
import CartContext from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import "../styles/List.css";

const List = () => {
    const cartCtx = useContext(CartContext);
    return (
        <div className="ListBox">
            {
                cartCtx.menuItems.map((item, index) => (
                    <div key={index} className="ListItem">
                        <p className="pp">{item.name}</p>
                        <p className="pp">{item.desc}</p>
                        <p className="pp">{item.price}</p>
                        <p className="pp">{item.avail}</p>
                        <button type="button" className="CBTN" onClick={() => cartCtx.addMedItems(item)}>
                            <FontAwesomeIcon icon={faCartShopping} size="lg" style={{ color: "#ffffff", }} />
                        </button>
                    </div>
                ))
            }
        </div>
    );
}

export default List;