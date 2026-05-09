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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🏪</div>
          <h2 className="text-2xl font-extrabold text-gray-900">Vendor Login</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your bookings</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-4 border border-red-200 text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vendor@example.com"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-blue-500 transition-colors"
          />

          <label className="block mb-2 font-semibold text-gray-700 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-6 focus:outline-none focus:border-blue-500 transition-colors"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 shadow-sm"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mt-6 text-center">
          <p className="text-blue-700 text-xs font-medium">
            Test: vendor@test.com / vendor123
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            Customer? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
