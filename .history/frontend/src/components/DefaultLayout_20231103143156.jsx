import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { useEffect, useState } from "react";
import { iconsImgs } from "../icon/icone";
import axios from "axios";

export default function DefaultLayout() {
  const { currentUser, setCurrentUser, token, user, setToken, notification } =
    useStateContext();
  const [loading, setLoading] = useState(true);

  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    axios
      .get("http://localhost:8081/user")
      .then(({ data }) => {
        setCurrentUser(data);
        setLoading(false);
        console.log("In context provider");
        console.log(data);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données utilisateur :",
          error
        );
        setLoading(false);
      });
  }, []);

  const onLogout = () => {
    // Nettoyer l'état si nécessaire
    setCurrentUser(null);
  };

  return (
    <div id="defaultLayout">
      <aside className="nav-item">
        <NavLink to="/dashboard" className="nav-link">
          <img
            src={iconsImgs.dashboard}
            alt=""
            className="nav-link-icon dashboard"
          />
          Dashboard
        </NavLink>
        <NavLink to="/client" className="nav-link">
          <img src={iconsImgs.client} alt="" className="nav-link-icon" />
          Client
        </NavLink>
        <NavLink to="/projet" className="nav-link">
          <img src={iconsImgs.project} alt="" className="nav-link-icon" />
          Projet
        </NavLink>
        <NavLink to="/container" className="nav-link">
          <img src={iconsImgs.container} alt="" className="nav-link-icon" />
          Conteneur
        </NavLink>
        <NavLink to="/terre_plein" className="nav-link">
          <img src={iconsImgs.logistic} alt="" className="nav-link-icon" />
          Terre plein
        </NavLink>
        <NavLink to="/transport" className="nav-link">
          Transport
        </NavLink>
        <NavLink to="/booking" className="nav-link">
          Booking
        </NavLink>
      </aside>
      <div className="content">
        <header>
          <div>{}</div>
          <div>
            {currentUser && currentUser.name} &nbsp; &nbsp;
            <button onClick={onLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </header>
        <main>
          {loading ? (
            <div className="loading-indicator">Chargement en cours...</div>
          ) : (
            <Outlet />
          )}
        </main>
        {notification && <div className="notification">{notification}</div>}
      </div>
    </div>
  );
}
