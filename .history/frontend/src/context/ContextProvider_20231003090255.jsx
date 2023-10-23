import React, { createContext, useContext, useState } from "react";

const StateContext = createContext({
  currentUser: null,
  token: null,
  notification: null,
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState();
  const [notification, setNotification] = useState("");

  const setTokenWithLocalStorage = (token) => {
    setToken(token);
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  };

  const setNotificationWithTimeout = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 5000);
  };

  return (
    <StateContext.Provider
      value={{
        currentUser: user,
        setUser,
        token,
        setToken: setTokenWithLocalStorage,
        notification,
        setNotification: setNotificationWithTimeout,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
