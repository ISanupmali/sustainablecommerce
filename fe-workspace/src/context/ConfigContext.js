import React, { createContext, useState } from 'react'
export const ConfigContext = createContext()

const ConfigContextProvider = (props) => {
    const [variableOne, setVariableOne] = useState('somethingRandom`)
    const Url = "http://localhost:3000"
    return (
         <ConfigContext.Provider 
            value={{
                variableOne,
                Url
             }}>
               {props.children}
         </ConfigContext.Provider>
    )
}
export default ConfigContextProvider