import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!mobile || !password) {
      setError('Mobile and password required');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/customer/login', { mobile, password });
      auth.login(res.data.token, res.data.customerId, mobile, '', 'customer');
      navigate('/services');
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
          <div className="text-4xl mb-3">👤</div>
          <h2 className="text-2xl font-extrabold text-gray-900">Customer Login</h2>
          <p className="text-gray-500 text-sm mt-1">Welcome back!</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-4 border border-red-200 text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">Mobile Number</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="10-digit mobile"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-blue-500 transition-colors"
            maxLength="10"
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

        <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-2">
          <p className="text-gray-500 text-sm">
            Don't have account? <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Sign Up</Link>
          </p>
          <p className="text-gray-500 text-sm">
            Vendor? <Link to="/vendor-login" className="text-blue-600 font-semibold hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
