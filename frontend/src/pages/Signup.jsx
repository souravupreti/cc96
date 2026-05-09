import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import OTPInput from '../components/OTPInput';
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d{10}$/.test(mobile)) {
      setError('Mobile must be 10 digits');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/customer/send-otp', { mobile });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/customer/verify-otp', { mobile, otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !password) {
      setError('All fields required');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/customer/register', { mobile, name, password });
      auth.login(res.data.token, res.data.customerId, mobile, '', 'customer');
      navigate('/services');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['Mobile', 'Verify OTP', 'Details'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
        <h2 className="text-2xl font-extrabold mb-2 text-center text-gray-900">Create Account</h2>
        <p className="text-gray-500 text-center text-sm mb-6">Join thousands of happy customers</p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > i + 1 ? 'bg-green-500 text-white' :
                step === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              {i < 2 && <div className={`w-8 h-0.5 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-4 border border-red-200 text-sm">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Mobile Number</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-blue-500 transition-colors"
              maxLength="10"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 shadow-sm"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">OTP will be printed in backend console</p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <label className="block mb-4 font-semibold text-gray-700 text-sm text-center">Enter 6-digit OTP sent to {mobile}</label>
            <OTPInput onChange={setOtp} />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 mt-6 disabled:opacity-50 transition-all duration-200 shadow-sm"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-gray-500 text-sm mt-3 hover:text-gray-700">
              ← Change mobile number
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleRegister}>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 shadow-sm"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
