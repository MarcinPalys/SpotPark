import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import logo from '../assets/logo-header.png';

// Home-page sections reachable from the navbar.
const TABS = [
  { to: '/', hash: '', icon: 'search', label: 'Znajdź parking' },
  { to: '/#udostepnij', hash: '#udostepnij', icon: 'car', label: 'Udostępnij miejsce' },
  { to: '/#jak-to-dziala', hash: '#jak-to-dziala', icon: 'info', label: 'Jak to działa' },
  { to: '/regulamin', path: '/regulamin', icon: 'document', label: 'Regulamin' },
];

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevKey, setPrevKey] = useState(location.key);

  // Close the mobile menu after navigating.
  if (location.key !== prevKey) {
    setPrevKey(location.key);
    setMenuOpen(false);
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isTabActive = (tab) => (tab.path
    ? location.pathname === tab.path
    : location.pathname === '/' && location.hash === tab.hash);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="SpotPark – strona główna">
          <img src={logo} alt="SpotPark" className="navbar-logo" width="492" height="160" />
        </Link>

        <div className={`navbar-menu${menuOpen ? ' navbar-menu-open' : ''}`}>
          <div className="nav-tabs">
            {TABS.map((tab) => (
              <Link
                key={tab.label}
                to={tab.to}
                className={`nav-tab${isTabActive(tab) ? ' nav-tab-active' : ''}`}
              >
                <Icon name={tab.icon} size={20} />
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-outline nav-login">
                  <Icon name="user" size={18} /> Mój panel
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost">Wyloguj</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-outline nav-login">
                <Icon name="user" size={18} /> Zaloguj się
              </Link>
            )}
            <Link to="/parking-spots/new" className="btn btn-primary nav-cta">
              <Icon name="plus" size={18} strokeWidth={2.2} /> Dodaj miejsce
            </Link>
          </div>
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
          aria-expanded={menuOpen}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
        </button>
      </div>
    </nav>
  );
}
