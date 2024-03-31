import { createContext, useState } from "react";

export const ControllerContext = createContext("")

export const ControllerProvider = ({children}) => {

    const [isConnected, setIsConnected] = useState(false)

    // return values
    const values = {isConnected}

    return (
        <ControllerContext.Provider value={values}> 
            {children}
        </ControllerContext.Provider>
    )
}