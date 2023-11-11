import { Link, NavLink, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { useEffect, useState } from "react";
import { iconsImgs } from "../icon/icone";
import axios from "axios";

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const [loading, setLoading] = useState(true);
  const [showYardDropdown, setShowYardDropdown] = useState(false);

  const handleYardMouseEnter = () => {
    setShowYardDropdown(true);
  };

  const handleYardMouseLeave = () => {
    setShowYardDropdown(false);
  };

  const onLogout = (ev) => {
    ev.preventDefault();

    axios
      .post(
        "http://localhost:8081/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        // Gérez la déconnexion côté client
        setCurrentUser(null);
        setToken(null);
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
      });
  };

  useEffect(() => {
    // Effectuer une requête pour obtenir les données de l'utilisateur au montage du composant
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
        <div
          className={`dropdown ${activePage === "yard" ? "active" : ""}`}
          onMouseEnter={handleYardMouseEnter}
          onMouseLeave={handleYardMouseLeave}
        >
          <button
            className={`nav-link ${activePage === "yard" ? "active" : ""}`}
            style={
              activePage === "yard"
                ? { backgroundColor: "#007bff7a", color: "#fff" }
                : {}
            }
          >
            <img src={iconsImgs.yard} alt="" className="nav-link-icon" />
            Yard
          </button>
          {showYardDropdown && (
            <div className="dropdown-content">
              <NavLink to="/getIn" className="nav-link">
                Get In
              </NavLink>
              <NavLink to="/getOut" className="nav-link">
                Get Out
              </NavLink>
            </div>
          )}
        </div>
        <NavLink to="/transport" className="nav-link">
          Transport
        </NavLink>
        <NavLink to="/booking" className="nav-link">
          Booking
        </NavLink>
      </aside>
      <div className="content">
        <header>
          <div>Header</div>
          <div>
            {currentUser && currentUser.name} &nbsp; &nbsp;
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
