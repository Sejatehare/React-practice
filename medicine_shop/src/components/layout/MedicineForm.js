import React, {useState} from "react";

const MedicineForm = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        description:'',
        price:'',
        quantity:''
    });

    const inputChangeHandler = (event) => {
        const {name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const submitHandler = event => {
        event.preventDefault();
        props.onAddMedicine(formData);
        setFormData({
            name: '',
            description:'',
            price:'',
            quantity:''
        });
    };

    return (
        <form onSubmit={submitHandler}>
            <input type="text" name="name" value={formData.name} onChange={inputChangeHandler} required />
            <input type="text" name="description" value={formData.description} onChange={inputChangeHandler} required />
            <input type="number" name="price" value={formData.price} onChange={inputChangeHandler} required />
            <input type="number" name="quantity" value={formData.quantity} onChange={inputChangeHandler} required />
            <button type="submit">Add Product</button>
        </form>
    )
}

export default MedicineForm