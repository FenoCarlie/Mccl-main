import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { useEffect } from "react";

export default function GuestLayout() {
  const { user, token } = useStateContext();

  console.log(token);

  const ifToken = (token) => {
    if (token) {
      return <Navigate to="/defaultLayout" />;
    }
  };

  useEffect(() => {
    ifToken(token);
  }, [token]);

  return (
    <div id="guestLayout">
      <Outlet />
    </div>
  );
}
