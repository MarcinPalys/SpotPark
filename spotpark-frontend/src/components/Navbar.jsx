import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">SpotPark</Link>
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost">Dashboard</Link>
              <Link to="/parking-spots/new" className="btn btn-ghost">+ Add Spot</Link>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
