import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    // Logout function
    const handleLogout = () => {
      // Remove the token from localStorage (or your authentication storage)
      localStorage.removeItem('authToken');
      
      // Redirect to login page after logout
      navigate('/login');
    };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">MyApp</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="" id="">
        <ul className="navbar-nav">
            {localStorage.getItem('authToken') && (
              <li className="nav-item">
                <button className="nav-link btn btn-primary" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
