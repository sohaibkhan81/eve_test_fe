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
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            {localStorage.getItem('authToken') && (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
