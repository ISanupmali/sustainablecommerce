import React, { createContext, useState } from "react";
export const ConfigContext = createContext();

const ConfigContextProvider = (props) => {
  const [variableOne, setVariableOne] = useState("somethingRandom");
  const Url = process.env.REACT_APP_STOREFRONT_URL;
  return (
    <ConfigContext.Provider
      value={{
        variableOne,
        Url,
      }}
    >
      {props.children}
    </ConfigContext.Provider>
  );
};
export default ConfigContextProvider;
