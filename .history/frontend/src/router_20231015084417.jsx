import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import UserForm from "./views/UserForm";
import Container from "./views/Container.jsx";
import Booking from "./views/Booking.jsx";
import ContainerForm from "./views/ContainerForm.jsx";
import EditContainer from "./views/EditContainer.jsx";
import Historic from "./views/Historic.jsx";
import GetIn from "./views/GetIn.jsx";
import GetOut from "./views/GetOut.jsx";
import PreAdvise from "./views/PreAdvise.jsx";
import Transport from "./views/Transport.jsx";
import Client from "./views/Client.jsx";
import Projet from "./views/Projet.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/client",
        element: <Client />,
      },
      {
        path: "/projet",
        element: <Projet />,
      },
      {
        path: "/container",
        element: <Container />,
      },
      {
        path: "/transport",
        element: <Transport />,
      },
      {
        path: "/booking",
        element: <Booking />,
      },
      {
        path: "/getIn",
        element: <GetIn />,
      },
      {
        path: "/getOut",
        element: <GetOut />,
      },
      {
        path: "/preAdvise",
        element: <PreAdvise />,
      },
      {
        path: "/container/new",
        element: <ContainerForm key="containerCreate" />,
      },
      {
        path: "/container/historic/:num_container",
        element: <Historic />,
      },
      {
        path: "/container/:id_container",
        element: <EditContainer />,
      },
      {
        path: "/users/new",
        element: <UserForm key="userCreate" />,
      },
      {
        path: "/users/:id",
        element: <UserForm key="userUpdate" />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
