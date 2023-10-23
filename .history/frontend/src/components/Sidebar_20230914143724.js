import { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { SidebarContext } from './context/siderbarContext'; // Make sure the correct context file is imported

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
          <NavLink className="nav-link" to="/" activeClassName="active">Home</NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/container">
            Container
          </NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/client">
            Client
          </NavLink>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
