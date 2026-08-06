import { useContext } from "react";
import { CounterContext } from "./CounterContext";

export const Counter = () => {
    const {count,inc,dec} = useContext(CounterContext);
    return (
        <>
            <h1>Count {count}</h1>
            <button onClick={inc}>+</button>
            <button onClick={dec}>-</button>
        </>
    )
}