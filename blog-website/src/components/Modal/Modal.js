import ReactDOM from "react-dom";

const Modal = (props) => {
    return ReactDOM.createPortal(
        <>
            <>
                <label>Image URL</label>
                <input type="text"/>

                <label>Title</label>
                <input type="text"/>

                <label>Description</label>
                <input type="text"/>
            </>
            <>
                <button>Post</button>
                <button onClick={props.onClose}>Close</button>
            </>
        </>,
        document.getElementById("root1")
    );
}

export default Modal;