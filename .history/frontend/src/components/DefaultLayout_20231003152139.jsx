import { Link, NavLink, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { usestatecontext } from "../context/contextprovider";
import axiosclient from "../axios-client.js";
import { iconsimgs } from "../icon/icone";
import axios from "axios";

export default function DefaultLayout() {
  const { user, token, setuser, settoken, notification } = usestatecontext();
  const [loading, setloading] = useState(true);

  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    axios
      .get("http://localhost:8081/user")
      .then(({ data }) => {
        setuser(data);
        setloading(false);
        console.log("in context provider");
      })
      .catch((error) => {
        console.error(
          "erreur lors de la récupération des données utilisateur :",
          error
        );
        setloading(false);
      });
  }, []);

  const onlogout = (ev) => {
    ev.preventDefault();

    axiosclient
      .post("/logout")
      .then(() => {
        setuser({});
        settoken(null);
      })
      .catch((error) => {
        console.error("erreur lors de la déconnexion :", error);
      });
  };

  return (
    <div id="defaultlayout">
      {console.log(user.name)}
      <aside className="nav-item">
        <NavLink to="/dashboard" className="nav-link">
          <img
            src={iconsimgs.dashboard}
            alt=""
            className="nav-link-icon dashboard"
          />
          dashboard
        </NavLink>
        <NavLink to="/users" className="nav-link">
          users
        </NavLink>
        <NavLink to="/container">
          <img src={iconsimgs.container} alt="" className="nav-link-icon" />
          container
        </NavLink>
        <NavLink to="/booking" className="nav-link">
          booking
        </NavLink>
      </aside>
      <div className="content">
        <header>
          <div>header</div>
          <div>
            {user.name} &nbsp; &nbsp;
            <Link to="/logout" className="btn-logout" onClick={onlogout}>
              logout
            </Link>
          </div>
        </header>
        <main>
          {loading ? (
            <div className="loading-indicator">chargement en cours...</div>
          ) : (
            <Outlet />
          )}
        </main>
        {notification && <div className="notification">{notification}</div>}
      </div>
    </div>
  );
}
