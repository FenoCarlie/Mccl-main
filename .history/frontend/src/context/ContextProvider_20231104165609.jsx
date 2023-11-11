import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  currentUser: null,
  token: null,
  notification: null,
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
  setCurrentUser: () => {},
});

export const ContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("user"));
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [token, setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [notification, setNotification] = useState("");

  const setTokenWithLogging = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
      console.log("Token stored in localStorage:", newToken);
    } else {
      localStorage.removeItem("token");
      console.log("Token removed from localStorage.");
    }
  };

  const setNotificationWithLogging = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 5000);

    console.log("Notification set:", message);
  };

  return (
    <StateContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        user,
        setUser,
        token,
        setToken: setTokenWithLogging,
        notification,
        setNotification: setNotificationWithLogging,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
