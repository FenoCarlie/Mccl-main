import {Link, NavLink, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import {useEffect} from "react";
import { iconsImgs } from "../icon/icone";

export default function DefaultLayout() {
  const {user, token, setUser, setToken, notification} = useStateContext();

  if (!token) {
    return <Navigate to="/login"/>
  }

  const onLogout = ev => {
    ev.preventDefault()

    axiosClient.post('/logout')
      .then(() => {
        setUser({})
        setToken(null)
      })
  }

  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
         setUser(data)
      })
  }, [])

  return (
    <div id="defaultLayout">
      <aside className="nav-item">
      <NavLink to="/dashboard" className="nav-link">
        <img src={iconsImgs.dashboard} alt="" className="nav-link-icon dashboard" />
        Dashboard
      </NavLink>
      <NavLink to="/users" className="nav-link">
        Users
      </NavLink>
      <div className="nav-link-dropdown">
        <span className="nav-link">
          Container
        </span>
        <div className="nav-dropdown-content">
          <Link to="/container/getIn" className="nav-link">
            Get In
          </Link>
          <Link to="/container/getOut" className="nav-link">
            Get Out
          </Link>
        </div>
      </div>
      <NavLink to="/booking" className="nav-link">
        Booking
      </NavLink>
    </aside>
      <div className="content">
        <header>
          <div>
            Header
          </div>
          <div>
            {user.name} &nbsp; &nbsp;
            <a onClick={onLogout} className="btn-logout" href="#">Logout</a>
          </div>
        </header>
        <main>
          <Outlet/>
        </main>
        {notification &&
          <div className="notification">
            {notification}
          </div>
        }
      </div>
    </div>
  )
}
