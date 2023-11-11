import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import DefaultLayout from "./DefaultLayout";
import GuestLayout from "./GuestLayout";

export default function AuthLayout() {
  const { token } = useStateContext();

  if (token) {
    return <DefaultLayout />;
  }

  return (
    <GuestLayout>
      <Outlet />
    </GuestLayout>
  );
}
