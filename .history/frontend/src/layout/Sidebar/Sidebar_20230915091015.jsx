import { useEffect, useState } from 'react';
import { personsImgs } from '../../utils/images';
import "./Sidebar.css";
import { useContext } from 'react';
import { SidebarContext } from '../../context/sidebarContext';
import { NavLink } from 'react-router-dom';


const Sidebar = () => {
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
              <img src={ personsImgs.person_two } alt="profile image" />
          </div>
          <span className="info-name">alice-doe</span>
      </div>
      <nav className="navigation">
        <div className='nav-item'>
          <NavLink className="nav-link" aria-current="page" exact to="/">Content</NavLink>
          <NavLink className="nav-link" to="/container">Container</NavLink>
        </div>
      </nav>
      
    </div>
  )
}

export default Sidebar
