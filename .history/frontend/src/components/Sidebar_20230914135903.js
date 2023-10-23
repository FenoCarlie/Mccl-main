import { useEffect, useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SidebarContext } from './context/siderbarContext';


function Sidebar() {
    const [sidebarClass, setSidebarClass] = useState("");
  const { isSidebarOpen } = useContext(SidebarContext);

  useEffect(() => {
    if(isSidebarOpen){
      setSidebarClass('sidebar-change');
    } else {
      setSidebarClass('');
    }
  }, [isSidebarOpen]);
    return (
        <div className={ `sidebar ${sidebarClass}` }>
            <div className="user-info">
                <div className="info-img img-fit-cover">
                </div>
                <span className="info-name">alice-doe</span>
            </div>

            <nav className="navigation">
                <div className="logo">
                    <Link to="/">
                        <span className="typo">Feno C</span>
                        <span className="point">.</span>
                    </Link>
                </div>
                <div className="nav-list">
                    <NavLink className="nav-link" aria-current="page" exact to="/">Home</NavLink>
                    <NavLink className="nav-linkk" to="/about">Container</NavLink>
                    <NavLink className="nav-link" to="/project">Client</NavLink>
                </div>
            </nav>
        </div>
    )
}

export default Sidebar;