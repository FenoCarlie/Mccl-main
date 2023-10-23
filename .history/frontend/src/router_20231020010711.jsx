import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import UserForm from "./views/UserForm";
import Container from "./views/Container.jsx";
import ContainerForm from "./views/ContainerForm.jsx";
import EditContainer from "./views/EditContainer.jsx";
import Historic from "./views/Historic.jsx";
import GetIn from "./views/GetIn.jsx";
import GetOut from "./views/GetOut.jsx";
import PreAdvise from "./views/PreAdvise.jsx";
import Transport from "./views/Transport.jsx";
import Client from "./views/Client.jsx";
import Projet from "./views/Projet.jsx";
import InfoClient from "./views/InfoClient.jsx";
import InfoProjet from "./views/InfoProjet.jsx";
import InfoConteneur from "./views/infoConteneur.jsx";

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
        path: "/client/infoClient/:clientId/infoProjet/:projetId/infoConteneur/:conteneurId",
        element: <InfoConteneur />,
      },
      {
        path: "/client/infoClient/:clientId/infoProjet/:projetId",
        element: <InfoProjet />,
      },
      {
        path: "/client/infoClient/:clientId",
        element: <InfoClient />,
      },
      // Ajoutez des routes pour les pages de projet et de conteneur de manière similaire
      {
        path: "/projet/infoProjet/:projetId/infoConteneur/:conteneurId",
        element: <InfoConteneur />,
      },
      {
        path: "/projet/infoProjet/:projetId",
        element: <InfoProjet />,
      },
      {
        path: "/conteneur/infoCInfoConteneur/:conteneurId",
        element: <InfoConteneur />,
      },

      {
        path: "/transport",
        element: <Transport />,
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
