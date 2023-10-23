import React from "react";
import { Link, NavLink } from 'react-router-dom';


function Sidebar() {
    return (
        <div >
            <nav className="my_container">
                <div className="logo">
                    <Link to="/">
                        <span className="typo">Feno C</span>
                        <span className="point">.</span>
                    </Link>
                </div>
                <div className="parent-link">
                    <NavLink className="social-link" aria-current="page" exact to="/">Home</NavLink>
                    <NavLink className="social-link" to="/about">About me</NavLink>
                    <NavLink className="social-link" to="/project">Project</NavLink>
                    <NavLink className="social-link" to="/contact">Contact</NavLink>
                </div>
            </nav>
        </div>
    )
}

export default Sidebar;