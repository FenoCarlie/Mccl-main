import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  userState: {
    currentUser: null,
    setUser: () => {},
  },
  tokenState: {
    token: null,
    setToken: () => {},
  },
  notificationState: {
    notification: null,
    setNotification: () => {},
  },
});

export const ContextProvider = ({ children }) => {
  const [userState, setUserState] = useState({
    currentUser: null,
  });

  const [tokenState, setTokenState] = useState({
    token: localStorage.getItem("ACCESS_TOKEN"),
  });

  const [notificationState, setNotificationState] = useState({
    notification: "",
  });

  const setTokenWithLogging = (newToken) => {
    setTokenState((prevState) => ({
      ...prevState,
      token: newToken,
    }));

    if (newToken) {
      localStorage.setItem("token", newToken);
      console.log("Token stored in localStorage:", newToken);
    } else {
      localStorage.removeItem("token");
      console.log("Token removed from localStorage.");
    }
  };

  const setNotificationWithLogging = (message) => {
    setNotificationState((prevState) => ({
      ...prevState,
      notification: message,
    }));

    setTimeout(() => {
      setNotificationState((prevState) => ({
        ...prevState,
        notification: "",
      }));
    }, 5000);

    console.log("Notification set:", message);
  };

  return (
    <StateContext.Provider
      value={{
        userState,
        setUserState,
        tokenState,
        setTokenState: setTokenWithLogging,
        notificationState,
        setNotificationState: setNotificationWithLogging,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
