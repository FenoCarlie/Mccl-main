import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

export default function GuestLayout() {
  const { user, token } = useStateContext();

  console.log(token);

  if (token) {
    return <Navigate to="/defaultLayout" />;
  }

  return (
    <div id="guestLayout">
      <Outlet />
    </div>
  );
}
