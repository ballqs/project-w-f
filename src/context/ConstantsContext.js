import React, { createContext, useContext } from 'react';

const ConstantsContext = createContext();

export const ConstantsProvider = ({ children }) => {
    const constants = {
        API_URL: "http://localhost:8081"
    };

    return (
        <ConstantsContext.Provider value={constants}>
            {children}
        </ConstantsContext.Provider>
    );
};

export const useConstants = () => {
    return useContext(ConstantsContext);
};
