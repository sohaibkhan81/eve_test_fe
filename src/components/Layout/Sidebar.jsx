import { NavLink } from 'react-router-dom';
import './Sidebar.scss';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'nav-link active-link' : 'nav-link'
            }
          >
            Home
          </NavLink>
        </li>
        <li className="list-group-item">
          <NavLink
            to="/results"
            className={({ isActive }) =>
              isActive ? 'nav-link active-link' : 'nav-link'
            }
          >
            Results
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
