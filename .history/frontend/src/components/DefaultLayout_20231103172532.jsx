import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { useEffect, useState } from "react";
import { iconsImgs } from "../icon/icone";
import axios from "axios";

export default function DefaultLayout() {
  const {
    currentUser,
    setCurrentUser,
    token,
    setToken,
    notification,
    setNotification,
  } = useStateContext();
  const [loading, setLoading] = useState(true);

  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post("/login", {
          reg_number: "your_reg_number",
          password: "your_password",
        });

        const { user, token } = response.data;

        // Utilisez les fonctions du contexte pour définir les données
        setCurrentUser(user);
        setToken(token);

        setLoading(false);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur :",
          error
        );
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setCurrentUser, setToken]);

  console.log("user :" + currentUser);
  const onLogout = async () => {
    localStorage.removeItem("ACCESS_TOKEN");
    window.location.reload();
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
