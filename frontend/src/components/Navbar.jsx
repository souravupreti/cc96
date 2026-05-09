import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold tracking-tight hover:opacity-90 transition-opacity">
          <span className="text-blue-200">Service</span>Hub
        </Link>
        <div className="flex items-center gap-2">
          {!auth.isAuthenticated ? (
            <>
              <Link to="/login" className="hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                Login
              </Link>
              <Link to="/vendor-login" className="hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                Vendor
              </Link>
              <Link to="/signup" className="bg-white text-blue-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-all duration-200 shadow-sm">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {auth.userType === 'customer' && (
                <>
                  <Link to="/services" className="hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                    Services
                  </Link>
                  <Link to="/my-bookings" className="hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                    My Bookings
                  </Link>
                </>
              )}
              {auth.userType === 'vendor' && (
                <Link to="/vendor-dashboard" className="hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500/80 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
