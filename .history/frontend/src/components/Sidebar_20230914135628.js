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
                    //<img src={ personsImgs.person_two } alt="profile image" />
                </div>
                <span className="info-name">alice-doe</span>
            </div>

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