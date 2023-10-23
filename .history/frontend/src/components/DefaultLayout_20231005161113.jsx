import { Link, NavLink, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { useEffect, useState } from "react";
import { iconsImgs } from "../icon/icone";
import axios from "axios";

export default function DefaultLayout() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activePage, setActivePage] = useState("");

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };
  const {
    currentUser,
    setCurrentUser,
    token,
    setUser,
    setToken,
    notification,
  } = useStateContext();
  const [loading, setLoading] = useState(true);

  if (!token) {
    return <Navigate to="/login" />;
  }
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
        setCurrentUser(null);
        setToken(null);
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
      });
  };

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
        <div
          className={`dropdown ${activePage === "container" ? "active" : ""}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <NavLink
            className={`nav-link ${
              activePage === "container" ? "active" : ""
            }`}
            style={
              activePage === "container"
                ? { backgroundColor: "#007bff7a", color: "#fff" }
                : {}
            }
          >
            <img src={iconsImgs.container} alt="" className="nav-link-icon" />
            Container
          </NavLink>
          {showDropdown && (
            <div className="dropdown-content">
              <NavLink to="/container" className="nav-link">
                All Containers
              </NavLink>
              <NavLink to="/container/getIn" className="nav-link">
                Get In
              </NavLink>
              <NavLink to="/container/getOut" className="nav-link">
                Get Out
              </NavLink>
              <NavLink to="/container/preAdvise" className="nav-link">
                PreAdvise
              </NavLink>
            </div>
          )}
        </div>
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
