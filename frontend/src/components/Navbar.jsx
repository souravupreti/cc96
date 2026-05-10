import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Zap, User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    auth.logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
        {/* Logo Section */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <Zap size={28} fill="currentColor" />
            <span className="text-gradient">ServiceHub</span>
          </Link>
        </div>

        {/* Links Section (Desktop) */}
        <div style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
          <ul className="navbar-links" style={{ display: 'flex', gap: '32px', listStyle: 'none', margin: 0, padding: 0 }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><a href="/#how-it-works">How it Works</a></li>
          </ul>
        </div>

        {/* Actions Section (Desktop) */}
        <div className="navbar-actions" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
          {!auth.isAuthenticated ? (
            <div className="navbar-desktop-actions" style={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--dark)', fontWeight: '600', marginRight: '20px' }}>Login</Link>
              <Link to="/signup" className="btn-premium" style={{ padding: '10px 24px', fontSize: '14px' }}>Sign Up</Link>
            </div>
          ) : (
            <div className="navbar-desktop-actions" style={{ display: 'flex', alignItems: 'center' }}>
              {auth.userType === 'customer' && (
                <Link to="/my-bookings" className="btn-outline" style={{ padding: '8px 20px', fontSize: '14px', marginRight: '10px' }}>My Bookings</Link>
              )}
              {auth.userType === 'vendor' && (
                <Link to="/vendor-dashboard" className="btn-outline" style={{ padding: '8px 20px', fontSize: '14px', marginRight: '10px' }}>Dashboard</Link>
              )}
              <button onClick={handleLogout} className="btn-premium" style={{ padding: '10px 24px', fontSize: '14px' }}>Logout</button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle" 
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dark)' }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* CSS for Mobile Toggle display */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-toggle { display: block !important; }
        }
      `}</style>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <Link to="/" className="mobile-nav-link" onClick={closeMenu}>Home</Link>
          <Link to="/services" className="mobile-nav-link" onClick={closeMenu}>Services</Link>
          <a href="/#how-it-works" className="mobile-nav-link" onClick={closeMenu}>How it Works</a>
          
          {!auth.isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              <Link to="/login" className="mobile-nav-link" onClick={closeMenu}>Login</Link>
              <Link to="/signup" className="btn-premium" style={{ width: '100%' }} onClick={closeMenu}>Sign Up</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              {auth.userType === 'customer' && (
                <Link to="/my-bookings" className="mobile-nav-link" onClick={closeMenu}>My Bookings</Link>
              )}
              {auth.userType === 'vendor' && (
                <Link to="/vendor-dashboard" className="mobile-nav-link" onClick={closeMenu}>Dashboard</Link>
              )}
              <button onClick={handleLogout} className="btn-premium" style={{ width: '100%' }}>Logout</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
