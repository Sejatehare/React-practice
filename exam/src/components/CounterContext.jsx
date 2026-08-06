import { Children, use } from "react";
import { createContext, useState } from "react";

export const CounterContext = createContext(null);
export const CounterProvider = ({Children}) => {
    const [count, setCount] = useState(0);

    const inc = () => setCount((prev) => prev + 1);
    const dec = () => setCount((prev) => prev - 1);
    
    return (
        <CounterContext.Provider value={{count,inc,dec}}>
            {Children}
        </CounterContext.Provider>
    )
}