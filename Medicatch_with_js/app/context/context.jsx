import React, { createContext, useContext, useState } from "react";

// Create the Context
const AppContext = createContext();

// Custom hook to use the AppContext
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state
  const [token, setToken] = useState(null); // Token state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    setIsLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
