import React, { createContext, useContext, useEffect, useState } from "react";

// Create the Context
const AppContext = createContext();

// Custom hook to use the AppContext
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state
  const [articles, setArticles] = useState([]);
  const [contextualMed, setContextualMed] = useState("");
  const [pushToken, setPushToken] = useState(null);

  const value = {
    user,
    articles,
    contextualMed,
    pushToken,
    setPushToken,
    setUser,
    setArticles,
    setContextualMed,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
