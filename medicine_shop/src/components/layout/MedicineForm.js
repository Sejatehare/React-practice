import React, {useContext, useRef} from "react";
import CartContext from "../context/CartContext";
import "../styles/MedicineForm.css";

const MedicineForm = () => {
    const name = useRef();
    const description = useRef();
    const price = useRef();
    const available = useRef();

    const cartCtx = useContext(CartContext);

    const submitHandler = (event) => {
        event.preventDefault();

        const medObj = {
            name : name.current.value,
            desc : description.current.value,
            price : price.current.value,
            avail : available.current.value
        }

        cartCtx.addToMenu(medObj);
        name.current.value = "";
        description.current.value = "";
        price.current.value = "";
        available.current.value = "";
    };

    return (
        <>
            <div className="BOX">
                <form onSubmit={submitHandler}>
                    <div className="Form-Box">
                        <div className="Box1">
                            <div className="InsideBox">
                                <label className="LBL">Medicine Name</label>
                                <input type="text" className="IP" ref={name} required />
                            </div>
                            <div className="InsideBox">
                                <label className="LBL">Description</label>
                                <input type="text" className="IP" ref={description} required />
                            </div>
                        </div>
                        <div className="Box1">
                            <div className="InsideBox">
                                <label className="LBL">Price</label>
                                <input type="number" className="IP" ref={price} required />
                            </div>
                            <div className="InsideBox">
                                <label className="LBL">Available Quantity</label>
                                <input type="number" className="IP" ref={available} required />
                            </div>
                        </div>
                    </div>
                    <div className="ButtonBox">
                        <button type="submit" className="SBTN">Add Medicine</button>
                    </div>
                </form>
                
            </div>            
        </>
    )
}

export default MedicineForm