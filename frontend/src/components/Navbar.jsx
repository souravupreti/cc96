import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    auth.logout();
    setIsMobileOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] fade-in">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl text-white shadow-premium group-hover:scale-105 transition-transform duration-300">
            ⚡
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-[#9B6BFF] text-transparent bg-clip-text">
            ServiceHub
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6 font-medium text-gray-600">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
            <a href="/#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
          </div>
          
          <div className="flex items-center gap-3 border-l pl-8 border-gray-200">
            {!auth.isAuthenticated ? (
              <>
                <Link to="/login" className="px-6 py-2.5 rounded-btn font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300">
                  Login
                </Link>
                <Link to="/vendor-login" className="px-6 py-2.5 rounded-btn font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300">
                  Vendor
                </Link>
                <Link to="/signup" className="px-6 py-2.5 rounded-btn font-semibold bg-primary text-white hover:bg-primary-hover shadow-premium hover:shadow-premium-hover transition-all duration-300">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {auth.userType === 'customer' && (
                  <Link to="/my-bookings" className="px-6 py-2.5 rounded-btn font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300">
                    My Bookings
                  </Link>
                )}
                {auth.userType === 'vendor' && (
                  <Link to="/vendor-dashboard" className="px-6 py-2.5 rounded-btn font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300">
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 rounded-btn font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-gray-600 p-2"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-6 space-y-4 shadow-xl absolute w-full left-0 fade-in">
          <Link to="/" onClick={() => setIsMobileOpen(false)} className="block font-medium text-gray-600 py-2">Home</Link>
          <Link to="/services" onClick={() => setIsMobileOpen(false)} className="block font-medium text-gray-600 py-2">Services</Link>
          <a href="/#how-it-works" onClick={() => setIsMobileOpen(false)} className="block font-medium text-gray-600 py-2">How it Works</a>
          <hr className="border-gray-100" />
          {!auth.isAuthenticated ? (
            <div className="flex flex-col gap-3 pt-2">
              <Link to="/login" onClick={() => setIsMobileOpen(false)} className="text-center px-6 py-3 rounded-btn font-semibold text-gray-700 bg-gray-50">Login</Link>
              <Link to="/signup" onClick={() => setIsMobileOpen(false)} className="text-center px-6 py-3 rounded-btn font-semibold bg-primary text-white shadow-premium">Sign Up</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              {auth.userType === 'customer' && (
                <Link to="/my-bookings" onClick={() => setIsMobileOpen(false)} className="text-center px-6 py-3 rounded-btn font-semibold text-gray-700 bg-gray-50">My Bookings</Link>
              )}
              {auth.userType === 'vendor' && (
                <Link to="/vendor-dashboard" onClick={() => setIsMobileOpen(false)} className="text-center px-6 py-3 rounded-btn font-semibold text-gray-700 bg-gray-50">Dashboard</Link>
              )}
              <button onClick={handleLogout} className="text-center px-6 py-3 rounded-btn font-semibold bg-red-50 text-red-600">Logout</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
