import classes from "./Modal.module.css";
import { Fragment } from "react";
import ReactDOM from 'react-dom';

const Backdrop = props => {
    return <div className={classes.backdrop}></div>
}

const ModalOverlay = props => {
    return (
        <div className={classes.modal}>
            <div className={classes.content}>{props.children}</div>
        </div>
    );
}

const portEle = document.getElementById('overlays');

const Modal = props => {
    return <Fragment>
        {ReactDOM.createPortal(<Backdrop />, portEle)}
        {ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay>, portEle)}
    </Fragment>
}

export default Modal;