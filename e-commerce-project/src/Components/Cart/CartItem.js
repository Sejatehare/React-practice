import { useContext } from "react";
import CartContext from "../Context/CartContext";

const CartItem = () => {
    const cartCtx = useContext(CartContext);
    
    const removeItemFromCart = (id) => {
        cartCtx.removeItem(id);
    };

    return (
        <>
            {cartCtx.items.map((item) => (
                <div className="cart-items" key={item.id}>
                    <div className="cart-item-name">
                        <img src={item.imageUrl} alt=""></img>
                        <span className="title">{item.title}</span>
                    </div>
                    <div className="cart-items-price">${item.price}</div>
                    <div className="cart-items-quantity">
                        <input type="number" value={item.quantity} readOnly></input>
                        <button onClick={() => {removeItemFromCart(item.id)}}>Remove</button>
                    </div>
                </div>
            ))}
        </>
    );
}

export default CartItem;