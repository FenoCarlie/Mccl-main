import { Link, NavLink, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import { useEffect, useState } from "react"; // Ajout de useState
import { iconsImgs } from "../icon/icone";
import axios from "axios";

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const [loading, setLoading] = useState(true); // Ajout de l'état de chargement

  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    axios
      .get("http://localhost:8081/user")
      .then(({ data }) => {
        setUser(data);
        setLoading(false); // Fin du chargement
        console.log("in context provider");
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données utilisateur :",
          error
        );
        setLoading(false); // Fin du chargement en cas d'erreur
      });
  }, []);

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient
      .post("/logout")
      .then(() => {
        setUser({});
        setToken(null);
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
      });
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
        <NavLink to="/users" className="nav-link">
          Users
        </NavLink>
        <NavLink to="/container">
          <img src={iconsImgs.container} alt="" className="nav-link-icon" />
          Container
        </NavLink>
        <NavLink to="/booking" className="nav-link">
          Booking
        </NavLink>
      </aside>
      <div className="content">
        <header>
          <div>Header</div>
          <div>
            {user.name} &nbsp; &nbsp;
            <Link to="/logout" className="btn-logout" onClick={onLogout}>
              Logout
            </Link>
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
