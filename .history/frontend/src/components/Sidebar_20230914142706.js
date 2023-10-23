import { useEffect, useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SidebarContext } from './context/sidebarContext'; // Make sure the correct context file is imported

function Sidebar() {
  const [sidebarClass, setSidebarClass] = useState('');
  const { isSidebarOpen } = useContext(SidebarContext);

  useEffect(() => {
    setSidebarClass(isSidebarOpen ? 'sidebar-change' : '');
  }, [isSidebarOpen]);

  return (
    <div className={`sidebar ${sidebarClass}`}>
      <div className="user-info">
        <div className="info-img img-fit-cover">
          {/* Add user profile image */}
        </div>
        <span className="info-name">alice-doe</span>
      </div>

      <nav className="navigation">
        <div className="nav-list">
          <NavLink className="nav-link" activeClassName="active" exact to="/">
            Home
          </NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/about">
            Container
          </NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/project">
            Client
          </NavLink>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
