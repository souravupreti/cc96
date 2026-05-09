import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function VendorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password required');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/vendor/login', { email, password });
      auth.login(res.data.token, res.data.vendorId, '', email, 'vendor');
      navigate('/vendor-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-app-bg flex items-center justify-center px-4 py-12 fade-in">
      <div className="bg-white rounded-premium shadow-[0_20px_60px_rgba(16,185,129,0.08)] max-w-md w-full border border-gray-100 overflow-hidden">
        {/* Gradient Header for Vendor (Teal/Green) */}
        <div className="bg-gradient-to-br from-[#059669] to-[#34d399] p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="text-5xl mb-4 relative z-10">🏪</div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight relative z-10">Vendor Portal</h2>
          <p className="text-white/80 text-sm relative z-10">Manage your business</p>
        </div>

        <div className="p-8">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 text-sm font-medium flex items-center gap-2 fade-in">
            <span>⚠️</span> {error}
          </div>}

          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-bold text-app-text text-sm ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vendor@example.com"
              className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl mb-5 focus:outline-none focus:border-[#10b981] focus:bg-white transition-all text-lg"
            />

            <label className="block mb-2 font-bold text-app-text text-sm ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl mb-8 focus:outline-none focus:border-[#10b981] focus:bg-white transition-all"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#10b981] text-white py-4 rounded-btn font-bold hover:bg-[#059669] shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.35)] disabled:opacity-50 transition-all duration-300 text-lg hover:-translate-y-0.5"
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

          <div className="bg-green-50 border border-green-100 rounded-xl p-4 mt-8 text-center">
            <p className="text-green-700 text-sm font-semibold">
              Test: <span className="font-mono bg-white px-2 py-0.5 rounded ml-1">vendor@test.com</span>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <Link to="/login" className="inline-block px-6 py-2 rounded-full border-2 border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50 font-semibold text-sm transition-all">
              ← Back to Customer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
