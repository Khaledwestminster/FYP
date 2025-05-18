import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    return () => {
      setIsMenuOpen(false);
    };
  }, [navigate]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e) => {
      if (!e.target.closest('.navbar-menu') && !e.target.closest('.menu-toggle')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2 className="navbar-logo">PolyglotPro</h2>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'is-open' : ''}`}>
          <div className="navbar-start">
            {user && (
              <>
                <Link to="/" className="nav-link" onClick={closeMenu}>Dashboard</Link>
                <Link to="/courses" className="nav-link" onClick={closeMenu}>Courses</Link>
              </>
            )}
          </div>

          <div className="navbar-end">
            {user ? (
              <>
                <span className="user-name">
                  <span className="user-greeting">Welcome,</span>
                  <span className="user-fullname">{user.fullName}</span>
                </span>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
                <Link to="/register" className="nav-link register-button" onClick={closeMenu}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 